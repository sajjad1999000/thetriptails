'use server';

import { createClient } from '@/lib/supabase/server';

function slugify(str) {
  return (
    (str || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'traveller'
  );
}

// Only runs at claim time — the one confirmed place profiles gets
// written to for an author right now. Doesn't touch a profile that
// already has a slug (won't reshuffle URLs on re-claim/re-run).
async function ensureProfileSlug(supabase, profileId, preferredName) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('slug, display_name')
    .eq('id', profileId)
    .maybeSingle();

  if (profile?.slug) return;

  const base = slugify(profile?.display_name || preferredName);
  let candidate = base;
  let n = 1;

  while (n <= 20) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!existing) break;
    n += 1;
    candidate = `${base}-${n}`;
  }

  const updates = { slug: candidate };
  if (!profile?.display_name && preferredName) {
    updates.display_name = preferredName;
  }

  await supabase.from('profiles').update(updates).eq('id', profileId);
}

export async function claimStoryAction(token) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You need to be signed in to claim this story.' };
  }

  const { data: story, error: findError } = await supabase
    .from('stories')
    .select('id, claim_status, claimed_by, slug, author_name')
    .eq('claim_token', token)
    .maybeSingle();

  if (findError || !story) {
    return { error: 'This claim link is invalid or has expired.' };
  }

  if (story.claimed_by) {
    return { error: 'This story has already been claimed.' };
  }

  const { error: updateError } = await supabase
    .from('stories')
    .update({
      claimed_by: user.id,
      claim_status: 'claimed',
    })
    .eq('id', story.id);

  if (updateError) {
    return { error: 'Could not complete the claim — try again.' };
  }

  await supabase
    .from('profiles')
    .update({ is_claimed_author: true })
    .eq('id', user.id);

  await ensureProfileSlug(supabase, user.id, story.author_name);

  return { ok: true, slug: story.slug };
}