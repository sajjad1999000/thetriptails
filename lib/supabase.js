import { createClient } from '@supabase/supabase-js'

/**
 * Browser-safe Supabase client.
 * Uses the public anon key — safe to ship to the client because Row Level
 * Security on `submissions` only grants the anon role INSERT access
 * (see supabase/migrations/0001_submissions.sql). It can never read,
 * update, or delete rows.
 *
 * Not currently used by the submit flow (that goes through the server
 * action in lib/actions/submitStory.js instead, so validation and rate
 * limiting can't be bypassed by disabling JS-side checks). Kept here for
 * future client-side needs — e.g. realtime story counts.
 */
export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Server-side Supabase client — for use inside Server Actions and Route
 * Handlers only. Never import this into a 'use client' component.
 *
 * This intentionally still uses the anon key, not the service role key.
 * The submit flow only ever needs INSERT, which RLS already grants to
 * anon — so there's no reason to hold a key capable of bypassing RLS in
 * this part of the app. The service role key should only be introduced
 * later, for the authenticated admin review dashboard (Build Guide Step P).
 */
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
