'use server'

import { headers } from 'next/headers'
import { randomUUID } from 'crypto'
import { createServerSupabase } from '@/lib/supabase'
import { isRateLimited } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5MB — matches the bucket's own limit
const MAX_PHOTOS = 5

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function extFromType(type) {
  return { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || 'jpg'
}

/**
 * Server Action backing the "Share Your Tale" form.
 *
 * Everything here runs server-side, so none of it can be skipped by a
 * bot (or a person) disabling JavaScript or editing the client bundle —
 * client-side validation in SubmitForm.jsx is a UX nicety layered on top
 * of this, never a substitute for it. That includes the photo checks
 * below: the form's `accept="image/..."` attribute is not a security
 * boundary, so type/size are re-checked here before anything touches
 * Storage.
 */
export async function submitStory(prevState, formData) {
  // Honeypot: a field real visitors never see (hidden via CSS in
  // SubmitForm.jsx) but that simple bots tend to fill in anyway.
  if (clean(formData.get('company')) !== '') {
    return { status: 'error', message: 'Something went wrong. Please try again.', errors: {} }
  }

  const name = clean(formData.get('name'))
  const email = clean(formData.get('email'))
  const location = clean(formData.get('location'))
  const country = clean(formData.get('country'))
  const title = clean(formData.get('title'))
  const story = clean(formData.get('story'))

  // File inputs arrive as File objects via formData.getAll(). Browsers
  // sometimes include an empty File (name: "", size: 0) when nothing was
  // picked — filter those out before validating anything else.
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
    errors.location = 'Tell us where this happened.'
  }
  if (story.length < 200) {
    errors.story = 'Give us at least a couple of paragraphs (200+ characters).'
  } else if (story.length > 20000) {
    errors.story = "That's a lot of tale — trim it under 20,000 characters and send the rest as a follow-up."
  }

  if (rawPhotos.length > MAX_PHOTOS) {
    errors.photos = `Please send at most ${MAX_PHOTOS} photos.`
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

  // Next.js 15+ made headers() async — must be awaited.
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

  // Upload any attached photos to Storage *before* inserting the row, so
  // photo_urls is populated in the same write rather than a follow-up
  // update. If any single upload fails, bail out with an error rather than
  // silently saving a submission with partial/missing photos.
  const photoUrls = []
  for (const file of rawPhotos) {
    const path = `${randomUUID()}.${extFromType(file.type)}`
    const { error: uploadError } = await supabase.storage
      .from('submission-photos')
      .upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false })

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
  })

  if (error) {
    // Log server-side for debugging; never leak DB error details to the client.
    console.error('submissions insert failed:', error.message)
    return {
      status: 'error',
      message: 'We could not save your story just now. Please try again shortly.',
      errors: {},
    }
  }

  return {
    status: 'success',
    message: 'Sent! We read every single one and reply within 48 hours.',
    errors: {},
  }
}