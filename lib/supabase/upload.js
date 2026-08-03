// lib/supabase/uploads.js
//
// Reusable helper for the "Share Your Tale" submit form (Build Guide Step J).
// Uploads a single photo to the `submission-photos` Storage bucket and
// returns its public URL — call once per selected file, then pass the
// resulting array of URLs into the `submissions.photo_urls` column.
//
// Depends on: your existing lib/supabase.js client export.

import { supabase } from '@/lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

export async function uploadSubmissionPhoto(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.');
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Each photo must be under ${MAX_SIZE_MB}MB.`);
  }

  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('submission-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('submission-photos')
    .getPublicUrl(path);

  return data.publicUrl;
}

// Convenience wrapper for multiple files (e.g. a multi-file <input>).
// Uploads sequentially and returns all public URLs, or throws on the first
// failure — swap for Promise.all if you'd rather upload in parallel and
// don't need to stop on the first bad file.
export async function uploadSubmissionPhotos(files) {
  const urls = [];
  for (const file of files) {
    urls.push(await uploadSubmissionPhoto(file));
  }
  return urls;
}
