import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client for server-only code: cron jobs, rollup
 * scripts, admin actions. This bypasses RLS entirely, so it must
 * NEVER be imported into a client component or exposed to the
 * browser — only used inside server actions, route handlers, or
 * standalone Node scripts (lib/jobs/*).
 *
 * SUPABASE_SERVICE_ROLE_KEY lives in .env.local / your host's
 * server-only env vars — never prefixed with NEXT_PUBLIC_.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}
