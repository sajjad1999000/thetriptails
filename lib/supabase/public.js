import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Plain client, no cookies — safe to use in generateStaticParams,
// generateMetadata, and any other build-time or public read-only
// context. Story data is public, doesn't need a user session.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}