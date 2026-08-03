// app/admin/(protected)/authors/page.jsx
// AD8 — Authors/Profiles screen.
//
// Server component: fetches profiles from Supabase, filtered by a
// ?filter= query param (all / claimed / verified / top_storyteller).
// Story counts are derived from stories.claimed_by (set in
// lib/actions/claims.js at claim time) — fetched separately and
// merged in JS to avoid a Supabase group-by, same N+1-avoidance
// approach as elsewhere in this codebase.
//
// All rendering + styling lives in AuthorsTable (client component),
// matching the split used for Dashboard (AD4) and Submissions (AD5)
// to keep styled-jsx out of Server Components.

import { createClient } from '@/lib/supabase/server';
import AuthorsTable from '@/components/admin/AuthorsTable';

const VALID_FILTERS = ['all', 'claimed', 'verified', 'top_storyteller'];

export default async function AuthorsPage({ searchParams }) {
  const params = await searchParams;
  const activeFilter = VALID_FILTERS.includes(params?.filter) ? params.filter : 'all';

  const supabase = await createClient();

  const [{ count: allCount }, { count: claimedCount }, { count: verifiedCount }, { count: topCount }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_claimed_author', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified_tier', 'verified'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified_tier', 'top_storyteller'),
    ]);

  const counts = {
    all: allCount ?? 0,
    claimed: claimedCount ?? 0,
    verified: verifiedCount ?? 0,
    top_storyteller: topCount ?? 0,
  };

  let query = supabase
    .from('profiles')
    .select('id, email, display_name, avatar_url, is_claimed_author, verified_tier, created_at, slug, bio')
    .order('created_at', { ascending: false });

  if (activeFilter === 'claimed') query = query.eq('is_claimed_author', true);
  if (activeFilter === 'verified') query = query.eq('verified_tier', 'verified');
  if (activeFilter === 'top_storyteller') query = query.eq('verified_tier', 'top_storyteller');

  const { data: profiles, error } = await query;

  // Derive story counts per author. Only claimed authors will have
  // any rows here (claimed_by is only set in claimStoryAction).
  let storyCounts = {};
  if (!error && profiles?.length) {
    const ids = profiles.map((p) => p.id);
    const { data: storyRows } = await supabase
      .from('stories')
      .select('claimed_by')
      .in('claimed_by', ids);

    (storyRows ?? []).forEach((row) => {
      storyCounts[row.claimed_by] = (storyCounts[row.claimed_by] ?? 0) + 1;
    });
  }

  return (
    <AuthorsTable
      profiles={profiles ?? []}
      storyCounts={storyCounts}
      activeFilter={activeFilter}
      counts={counts}
      error={!!error}
    />
  );
}