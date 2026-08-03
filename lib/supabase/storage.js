// lib/supabase/storage.js
//
// Handles all story-image uploads for the admin panel. Two entry points:
//
// 1. uploadStoryPhoto(file) — for images picked from your computer
//    (New Story flow, or admin uploading images received via email).
//    Compresses + converts to WebP client-side BEFORE upload, so
//    large files never hit Supabase Storage at all.
//
// 2. moveSubmissionPhotoToStory(submissionPhotoUrl) — for images that
//    already exist in the submission-photos bucket (uploaded via the
//    public form). Downloads the original, converts to WebP, and
//    re-uploads into story-photos. Used when approving a submission's
//    existing photos into a published story.
//
// Both return a public URL suitable for storing in stories.photo_urls.

import { createClient } from '@/lib/supabase/client';

const STORY_BUCKET = 'story-photos';
const MAX_DIMENSION = 1800; // px, generous for fullscreen viewing, no story needs wider
const WEBP_QUALITY = 0.82;   // ~80-85% sweet spot: small file, no visible loss

// --- Client-side compression (runs in the browser only) ---

async function compressFileToWebP(file, maxDimension = MAX_DIMENSION, quality = WEBP_QUALITY) {
  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality)
  );

  if (!blob) {
    throw new Error('Image compression failed — could not produce a WebP blob.');
  }

  return blob;
}

function randomFileName(extension = 'webp') {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${rand}.${extension}`;
}

/**
 * Upload a File picked from the admin's computer. Compresses to WebP
 * client-side first. Returns the public URL.
 */
export async function uploadStoryPhoto(file) {
  const supabase = createClient();

  const compressedBlob = await compressFileToWebP(file);
  const path = randomFileName();

  const { error } = await supabase.storage
    .from(STORY_BUCKET)
    .upload(path, compressedBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year, filenames are unique so this is safe
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(STORY_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Take a photo already sitting in submission-photos (jpeg/png/webp,
 * uploaded via the public form) and copy it into story-photos as
 * WebP. Used during Approve/Publish so published stories only ever
 * reference the story-photos bucket.
 */
export async function moveSubmissionPhotoToStory(submissionPhotoUrl) {
  const supabase = createClient();

  const response = await fetch(submissionPhotoUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch submission photo: ${submissionPhotoUrl}`);
  }
  const originalBlob = await response.blob();
  const originalFile = new File([originalBlob], 'submission-photo', {
    type: originalBlob.type,
  });

  const compressedBlob = await compressFileToWebP(originalFile);
  const path = randomFileName();

  const { error } = await supabase.storage
    .from(STORY_BUCKET)
    .upload(path, compressedBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(STORY_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a photo from story-photos by its public URL. Called when an
 * image is removed/replaced in the editor, so orphaned files don't
 * pile up in the bucket.
 */
export async function deleteStoryPhoto(publicUrl) {
  const supabase = createClient();
  const path = publicUrl.split(`${STORY_BUCKET}/`).pop();
  if (!path) return;

  const { error } = await supabase.storage.from(STORY_BUCKET).remove([path]);
  if (error) {
    // Non-fatal — log and move on, don't block the editor over a cleanup failure.
    console.error('Failed to delete story photo:', error.message);
  }
}