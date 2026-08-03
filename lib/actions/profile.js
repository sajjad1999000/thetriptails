'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Runs after a successful login (OTP verified). Auto-heals the
 * profiles row: creates it if missing (this is the fix for reader
 * login never having created one), and reports back whether a
 * display_name still needs to be collected.
 *
 * Safe to call on every login, not just first signup — this is
 * what makes existing accounts (like a pre-existing test account
 * with no profile row) self-heal the next time they log in,
 * instead of needing a one-off manual fix.
 */
export async function ensureProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, needsName: false }
  }

  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (lookupError) {
    console.error('ensureProfile: lookup failed', lookupError)
    return { ok: false, needsName: false }
  }

  if (!existing) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
    })

    if (insertError) {
      console.error('ensureProfile: insert failed', insertError)
      return { ok: false, needsName: false }
    }

    // Brand new profile row, no display_name set yet.
    return { ok: true, needsName: true }
  }

  return { ok: true, needsName: !existing.display_name }
}

/**
 * Sets the current user's display name. Called from LoginModal's
 * name step, right after ensureProfile() reports needsName: true.
 */
export async function setDisplayName(name) {
  const trimmed = (name || '').trim()

  if (!trimmed) {
    return { ok: false, error: 'Please enter a name.' }
  }
  if (trimmed.length > 60) {
    return { ok: false, error: 'That name is too long.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You need to be signed in to do that.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: trimmed })
    .eq('id', user.id)

  if (error) {
    console.error('setDisplayName: update failed', error)
    return { ok: false, error: 'Could not save your name — try again.' }
  }

  return { ok: true }
}