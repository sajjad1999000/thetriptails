/**
 * lib/supabase/storyOfWeek.js
 *
 * Read helpers (safe for server components, use the normal
 * request-scoped client) + the manual-override admin action
 * (uses the service-role client, must only be called from a
 * route/action already gated behind admin auth).
 */

import { createAdminClient } from '@/lib/supabase/admin'

/** Current week's pick for the homepage hero. Returns null if none set. */
export async function getCurrentStoryOfWeek(supabase) {
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('story_of_week')
    .select('story_id, week_start, week_end, selection_type, story:stories(*)')
    .lte('week_start', today)
    .gte('week_end', today)
    .maybeSingle()

  if (error) {
    console.error('getCurrentStoryOfWeek failed:', error)
    return null
  }
  return data
}

/** Current month's winner, if the rollup has run yet. */
export async function getCurrentMonthWinner(supabase) {
  const now = new Date()
  const { data, error } = await supabase
    .from('monthly_winners')
    .select('story_id, month, year, story:stories(*)')
    .eq('month', now.getUTCMonth() + 1)
    .eq('year', now.getUTCFullYear())
    .maybeSingle()

  if (error) {
    console.error('getCurrentMonthWinner failed:', error)
    return null
  }
  return data
}

/** Last settled year's winner (this year's is still open for voting). */
export async function getYearlyWinner(supabase, year) {
  const { data, error } = await supabase
    .from('yearly_winners')
    .select('story_id, year, vote_count, story:stories(*)')
    .eq('year', year)
    .maybeSingle()

  if (error) {
    console.error('getYearlyWinner failed:', error)
    return null
  }
  return data
}

/**
 * Admin override — sets (or replaces) the Story of the Week for a
 * given week_start, marked 'manual' so the auto rotation job never
 * touches it again for that week.
 *
 * Call only from a server action/route already checking the caller
 * is an authenticated admin — this uses the service-role client and
 * has no RLS protection of its own by design.
 */
export async function setManualStoryOfWeek({ storyId, weekStart, weekEnd, adminUserId }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('story_of_week').upsert(
    {
      story_id: storyId,
      week_start: weekStart,
      week_end: weekEnd,
      selection_type: 'manual',
      selected_by: adminUserId,
    },
    { onConflict: 'week_start' }
  )

  if (error) throw error
}

/**
 * Cast or change a reader's Story of the Year vote. One vote per
 * user per year — calling again with a different storyId changes
 * the vote (upsert on the unique (user_id, year) constraint).
 */
export async function castYearlyVote(supabase, { storyId, userId, year }) {
  const { error } = await supabase.from('yearly_votes').upsert(
    { story_id: storyId, user_id: userId, year },
    { onConflict: 'user_id,year' }
  )
  if (error) throw error
}
