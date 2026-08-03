// lib/supabase/client.js
// Browser-side Supabase client using @supabase/ssr.
// Use this in 'use client' components — e.g. the admin login form,
// or anywhere else in the site that needs Supabase in the browser.

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}