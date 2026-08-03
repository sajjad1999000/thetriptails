/**
 * lib/jobs/yearly-vote-tally.js
 *
 * Runs once, on Jan 1st, tallying the PREVIOUS year's yearly_votes
 * and storing the result in yearly_winners (see migration note —
 * this table isn't in the original Phase 2 schema doc, added to
 * mirror monthly_winners so results don't need re-tallying on
 * every page load).
 *
 * Ties: if two stories are tied on vote count, the earlier-created
 * vote batch wins (i.e. first to reach the tied count) — arbitrary
 * but deterministic; flag if you'd rather break ties another way
 * (e.g. total engagement as a tiebreaker, same as monthly-rollup).
 *
 * Run with: node lib/jobs/yearly-vote-tally.js
 */

import { createAdminClient } from '@/lib/supabase/admin'

function getPreviousYear(today = new Date()) {
  return today.getUTCFullYear() - 1
}

export async function runYearlyVoteTally() {
  const supabase = createAdminClient()
  const year = getPreviousYear()

  const { data: existing, error: existingErr } = await supabase
    .from('yearly_winners')
    .select('id')
    .eq('year', year)
    .maybeSingle()
  if (existingErr) throw existingErr
  if (existing) {
    console.log(`[yearly-tally] ${year}: winner already set, skipping.`)
    return
  }

  const { data: votes, error: votesErr } = await supabase
    .from('yearly_votes')
    .select('story_id')
    .eq('year', year)

  if (votesErr) throw votesErr

  if (!votes || votes.length === 0) {
    console.log(`[yearly-tally] ${year}: no votes cast, skipping.`)
    return
  }

  const counts = new Map()
  for (const v of votes) {
    counts.set(v.story_id, (counts.get(v.story_id) ?? 0) + 1)
  }

  let winnerId = null
  let winnerCount = -1
  for (const [storyId, count] of counts) {
    if (count > winnerCount) {
      winnerId = storyId
      winnerCount = count
    }
  }

  const { error: insertErr } = await supabase.from('yearly_winners').insert({
    story_id: winnerId,
    year,
    vote_count: winnerCount,
  })
  if (insertErr) throw insertErr

  console.log(`[yearly-tally] ${year}: story ${winnerId} wins with ${winnerCount} vote(s)`)
}

if (process.argv[1] && process.argv[1].endsWith('yearly-vote-tally.js')) {
  runYearlyVoteTally().catch((err) => {
    console.error('[yearly-tally] failed:', err)
    process.exit(1)
  })
}
