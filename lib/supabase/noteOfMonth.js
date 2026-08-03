/**
 * lib/supabase/noteOfMonth.js
 *
 * Mirrors storyOfWeek.js's pattern: a public read helper (safe for
 * server components) and a manual-override admin action (uses the
 * service-role client, must only be called from an already-gated
 * admin server action).
 */

import { createAdminClient } from '@/lib/supabase/admin'

/** Current month's manual pick for Locals' Notes. Returns null if none set. */
export async function getCurrentNoteOfMonth(supabase) {
  const now = new Date()
  const month = now.getUTCMonth() + 1
  const year = now.getUTCFullYear()

  const { data, error } = await supabase
    .from('note_of_month')
    .select('story_id, month, year, selection_type, story:stories(*)')
    .eq('month', month)
    .eq('year', year)
    .maybeSingle()

  if (error) {
    console.error('getCurrentNoteOfMonth failed:', error)
    return null
  }
  return data
}

/**
 * Admin override — sets (or replaces) the Note of the Month for a
 * given month/year. Call only from a server action already checking
 * the caller is an authenticated admin.
 */
export async function setManualNoteOfMonth({ storyId, month, year, adminUserId }) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('note_of_month').upsert(
    {
      story_id: storyId,
      month,
      year,
      selection_type: 'manual',
      selected_by: adminUserId,
    },
    { onConflict: 'month,year' }
  )

  if (error) throw error
}