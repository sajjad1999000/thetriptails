/**
 * lib/jobs/story-of-week-rotation.js
 *
 * Runs weekly (e.g. Monday 00:05 via Vercel Cron / GitHub Action).
 * Selection rule (per Step Z decision):
 *   - If an admin has already set a MANUAL story_of_week row for
 *     this week, the job does nothing — manual always wins.
 *   - Otherwise, auto-pick the story with the highest engagement
 *     score (comments + comment likes) over the past 7 days,
 *     excluding any story that won in the last 4 weeks (so the
 *     same story doesn't repeat back-to-back).
 *
 * Run with: node lib/jobs/story-of-week-rotation.js
 */

import { createAdminClient } from '@/lib/supabase/admin'

const RECENT_WEEKS_EXCLUDED = 4

function getWeekWindow(today = new Date()) {
  // Monday-start week, matching the cron's Monday run
  const day = today.getUTCDay() // 0 = Sun
  const diffToMonday = (day === 0 ? -6 : 1) - day
  const weekStart = new Date(today)
  weekStart.setUTCDate(today.getUTCDate() + diffToMonday)
  weekStart.setUTCHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)

  const iso = (d) => d.toISOString().slice(0, 10)
  return { weekStart: iso(weekStart), weekEnd: iso(weekEnd) }
}

export async function runStoryOfWeekRotation() {
  const supabase = createAdminClient()
  const { weekStart, weekEnd } = getWeekWindow()

  // 1. Bail if this week already has a manual pick
  const { data: existing, error: existingErr } = await supabase
    .from('story_of_week')
    .select('id, selection_type')
    .eq('week_start', weekStart)
    .maybeSingle()

  if (existingErr) throw existingErr

  if (existing?.selection_type === 'manual') {
    console.log(`[story-of-week] ${weekStart}: manual override already set, skipping auto-pick.`)
    return
  }

  // 2. Recently-won story_ids to exclude
  const cutoff = new Date(weekStart)
  cutoff.setUTCDate(cutoff.getUTCDate() - 7 * RECENT_WEEKS_EXCLUDED)
  const { data: recentWinners, error: recentErr } = await supabase
    .from('story_of_week')
    .select('story_id')
    .gte('week_start', cutoff.toISOString().slice(0, 10))

  if (recentErr) throw recentErr
  const excludeIds = new Set((recentWinners ?? []).map((r) => r.story_id))

  // 3. Candidate stories: live/published, not recently won
  const { data: candidates, error: candErr } = await supabase
    .from('stories')
    .select('id')
    .eq('status', 'published')

  if (candErr) throw candErr
  const eligible = (candidates ?? []).filter((s) => !excludeIds.has(s.id))

  if (eligible.length === 0) {
    console.warn(`[story-of-week] ${weekStart}: no eligible candidates, skipping.`)
    return
  }

  // 4. Score each candidate via the story_engagement_score() SQL fn
  const scored = await Promise.all(
    eligible.map(async (s) => {
      const { data: score, error } = await supabase.rpc('story_engagement_score', {
        p_story_id: s.id,
        p_window_start: weekStart,
        p_window_end: weekEnd,
      })
      if (error) throw error
      return { story_id: s.id, score: score ?? 0 }
    })
  )

  scored.sort((a, b) => b.score - a.score)
  const winner = scored[0]

  if (!winner || winner.score === 0) {
    console.log(`[story-of-week] ${weekStart}: no engagement this week, skipping auto-pick.`)
    return
  }

  // 5. Upsert the pick
  const { error: upsertErr } = await supabase
    .from('story_of_week')
    .upsert(
      {
        story_id: winner.story_id,
        week_start: weekStart,
        week_end: weekEnd,
        selection_type: 'auto',
      },
      { onConflict: 'week_start' }
    )

  if (upsertErr) throw upsertErr

  console.log(
    `[story-of-week] ${weekStart}: auto-picked story ${winner.story_id} (score ${winner.score})`
  )
}

// CLI entry point (e.g. `node lib/jobs/story-of-week-rotation.js`).
// Route handlers import { runStoryOfWeekRotation } instead, so this
// guard keeps the job from firing again on import.
if (process.argv[1] && process.argv[1].endsWith('story-of-week-rotation.js')) {
  runStoryOfWeekRotation().catch((err) => {
    console.error('[story-of-week] failed:', err)
    process.exit(1)
  })
}
