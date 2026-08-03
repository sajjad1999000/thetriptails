'use server'

import { headers } from 'next/headers'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { createServerSupabase } from '@/lib/supabase'
import { isRateLimited } from '@/lib/rateLimit'

// Mirrors lib/actions/submitStory.js's structure closely on purpose —
// same validation backbone, server-side re-checks, honeypot, rate
// limit, and compression pipeline. Differences: shorter max photo
// count, shorter min/max text length (a tip isn't a tale), and tags
// requested_type: 'locals_note' on insert.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5MB — matches the bucket's own limit
const MAX_PHOTOS = 2 // a note doesn't need a full photo gallery like a tale does

const MAX_DIMENSION = 1600 // px, longest side
const WEBP_QUALITY = 80

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Server Action backing the Locals' Note submission form.
 * Everything here runs server-side — client-side checks in
 * LocalsNoteSubmitForm.jsx are a UX nicety layered on top, never a
 * substitute for these.
 */
export async function submitLocalsNote(prevState, formData) {
  // Honeypot — same pattern as submitStory.js.
  if (clean(formData.get('company')) !== '') {
    return { status: 'error', message: 'Something went wrong. Please try again.', errors: {} }
  }

  const name = clean(formData.get('name'))
  const email = clean(formData.get('email'))
  const location = clean(formData.get('location'))
  const country = clean(formData.get('country'))
  const title = clean(formData.get('title'))
  const story = clean(formData.get('story')) // the note text itself

  const rawPhotos = formData.getAll('photos').filter(
    (f) => f instanceof File && f.size > 0
  )

  const errors = {}
  if (name.length < 2 || name.length > 80) {
    errors.name = 'Enter your full name.'
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (location.length < 2 || location.length > 100) {
    errors.location = 'Tell us which place this tip is about.'
  }
  // Notes are short by design — lower floor than a full tale (200 in
  // submitStory.js), but still enough to be a real, useful tip.
  if (story.length < 40) {
    errors.story = 'Give us at least a sentence or two (40+ characters).'
  } else if (story.length > 2000) {
    errors.story =
      "That's more a tale than a tip — trim it under 2,000 characters, or submit it as a full story instead."
  }

  if (rawPhotos.length > MAX_PHOTOS) {
    errors.photos = `Please send at most ${MAX_PHOTOS} photo(s).`
  } else {
    for (const file of rawPhotos) {
      if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        errors.photos = 'Photos must be JPEG, PNG, or WebP.'
        break
      }
      if (file.size > MAX_PHOTO_BYTES) {
        errors.photos = 'Each photo must be under 5MB.'
        break
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', errors }
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return {
      status: 'error',
      message: 'Too many submissions from this connection. Please try again in a few minutes.',
      errors: {},
    }
  }

  const supabase = createServerSupabase()

  const photoUrls = []
  for (const file of rawPhotos) {
    const originalBuffer = Buffer.from(await file.arrayBuffer())

    let compressedBuffer
    try {
      compressedBuffer = await sharp(originalBuffer)
        .rotate()
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
    } catch (compressError) {
      console.error('photo compression failed:', compressError.message)
      return {
        status: 'error',
        message: 'One of your photos could not be processed. Please try a different file.',
        errors: {},
      }
    }

    const path = `${randomUUID()}.webp`
    const { error: uploadError } = await supabase.storage
      .from('submission-photos')
      .upload(path, compressedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('photo upload failed:', uploadError.message)
      return {
        status: 'error',
        message: 'We could not upload your photo just now. Please try again shortly.',
        errors: {},
      }
    }

    const { data } = supabase.storage.from('submission-photos').getPublicUrl(path)
    photoUrls.push(data.publicUrl)
  }

  const { error } = await supabase.from('submissions').insert({
    name,
    email,
    country: country || null,
    location,
    title: title || null,
    story,
    photo_urls: photoUrls,
    status: 'pending',
    requested_type: 'locals_note',
  })

  if (error) {
    console.error('submissions insert failed:', error.message)
    return {
      status: 'error',
      message: 'We could not save your tip just now. Please try again shortly.',
      errors: {},
    }
  }

  return {
    status: 'success',
    message: 'Sent! Local tips move fast — we usually get these live within a day or two.',
    errors: {},
  }
}