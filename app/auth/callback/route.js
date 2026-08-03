// app/auth/callback/route.js
//
// This is the route your Phase 2 Build Guide already planned
// (app/auth/callback/route.js) — it's shared infrastructure for
// BOTH the reader magic-link login (Phase 2, System A) and the
// admin magic-link login (this admin panel). One callback handles
// both, since the logic is identical: exchange the code, then
// redirect wherever the link said to go.

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong (expired/invalid link) — send them back to
  // login with an error flag so the login page can show a message.
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}