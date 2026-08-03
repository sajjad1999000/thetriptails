// proxy.js
// (Next.js 16 renamed "middleware.js" to "proxy.js" — same feature,
// new name and exported function name. If you still have an old
// middleware.js file sitting in your project, delete it so there's
// only one of these.)
//
// Required by @supabase/ssr: refreshes the auth session cookie on
// every request so server components always see an up-to-date session.
// Without this, sessions can appear to randomly log out.
//
// If you already have a proxy.js/middleware.js (Phase 1 Part 3 mentions
// one for rate limiting / security headers), MERGE this logic into your
// existing file rather than replacing it — don't run two of these files.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touching getUser() is what actually triggers the token refresh
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and images, to keep
     * this from running on every asset request unnecessarily.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
