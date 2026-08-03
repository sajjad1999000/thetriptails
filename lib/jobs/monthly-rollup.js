/**
 * lib/jobs/monthly-rollup.js
 *
 * Runs once a month (1st of the month, after the last Monday's
 * weekly rotation has fired). Looks at every story_of_week row
 * whose week_start fell in the PREVIOUS month, dedupes if the same
 * story won more than one week, ranks by total engagement across
 * the month, and stores the top story in monthly_winners.
 *
 * Tie-break: if two stories tie on total engagement, the one that
 * won more individual weeks wins the month.
 *
 * Run with: node lib/jobs/monthly-rollup.js
 */

import { createAdminClient } from '@/lib/supabase/admin'

function getPreviousMonthWindow(today = new Date()) {
  const firstOfThisMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  const lastMonthEnd = new Date(firstOfThisMonth)
  lastMonthEnd.setUTCDate(lastMonthEnd.getUTCDate() - 1) // last day of prev month
  const lastMonthStart = new Date(Date.UTC(lastMonthEnd.getUTCFullYear(), lastMonthEnd.getUTCMonth(), 1))

  return {
    monthStart: lastMonthStart.toISOString().slice(0, 10),
    monthEnd: lastMonthEnd.toISOString().slice(0, 10),
    month: lastMonthStart.getUTCMonth() + 1,
    year: lastMonthStart.getUTCFullYear(),
  }
}

export async function runMonthlyRollup() {
  const supabase = createAdminClient()
  const { monthStart, monthEnd, month, year } = getPreviousMonthWindow()

  // Skip if this month already has a winner (idempotent re-runs)
  const { data: existing, error: existingErr } = await supabase
    .from('monthly_winners')
    .select('id')
    .eq('month', month)
    .eq('year', year)
    .maybeSingle()
  if (existingErr) throw existingErr
  if (existing) {
    console.log(`[monthly-rollup] ${year}-${month}: winner already set, skipping.`)
    return
  }

  // Every week pick that fell in this month
  const { data: weekPicks, error: weekErr } = await supabase
    .from('story_of_week')
    .select('story_id, week_start')
    .gte('week_start', monthStart)
    .lte('week_start', monthEnd)

  if (weekErr) throw weekErr

  if (!weekPicks || weekPicks.length === 0) {
    console.log(`[monthly-rollup] ${year}-${month}: no weekly picks found, skipping.`)
    return
  }

  // Dedupe story_ids, count how many weeks each won
  const winCounts = new Map()
  for (const pick of weekPicks) {
    winCounts.set(pick.story_id, (winCounts.get(pick.story_id) ?? 0) + 1)
  }
  const candidateIds = [...winCounts.keys()]

  // Score each candidate by TOTAL engagement across the full month
  const scored = await Promise.all(
    candidateIds.map(async (storyId) => {
      const { data: score, error } = await supabase.rpc('story_engagement_score', {
        p_story_id: storyId,
        p_window_start: monthStart,
        p_window_end: monthEnd,
      })
      if (error) throw error
      return { story_id: storyId, score: score ?? 0, weeksWon: winCounts.get(storyId) }
    })
  )

  scored.sort((a, b) => b.score - a.score || b.weeksWon - a.weeksWon)
  const winner = scored[0]

  const { error: insertErr } = await supabase.from('monthly_winners').insert({
    story_id: winner.story_id,
    month,
    year,
  })
  if (insertErr) throw insertErr

  console.log(
    `[monthly-rollup] ${year}-${month}: story ${winner.story_id} wins (score ${winner.score}, ${winner.weeksWon} week(s) won)`
  )
}

if (process.argv[1] && process.argv[1].endsWith('monthly-rollup.js')) {
  runMonthlyRollup().catch((err) => {
    console.error('[monthly-rollup] failed:', err)
    process.exit(1)
  })
}
