// lib/supabase/admin-auth.js
// Helpers for checking admin access and logging admin actions.
// Used by app/admin/layout.jsx and every admin server action.
//
// Note: this project already had an `admins` table (just user_id)
// before the admin panel build started. We extended that same table
// with email/role/created_at rather than creating a second table —
// so all admin checks below query `admins`, not `admin_users`.
//
// TEMP DEBUG: added a console.error in the failure branch of
// getCurrentAdmin() so we can see WHY the admin check is failing
// (RLS error vs. no matching row vs. something else) instead of it
// silently returning null and looking identical to "not logged in."
// Remove the console.error once the bug is found and fixed.

import { createClient } from './server';

/**
 * Returns the current admin's record (from admins) plus their
 * email, or null if not logged in / not an admin.
 *
 * Use this at the top of app/admin/(protected)/layout.jsx to gate all admin pages.
 */
export async function getCurrentAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('getCurrentAdmin: no authenticated user found (no session).');
    return null;
  }

  const { data: adminRow, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !adminRow) {
    console.error(
      'getCurrentAdmin: admin lookup failed.',
      '\n  user.id:', user.id,
      '\n  user.email:', user.email,
      '\n  supabase error:', error,
      '\n  adminRow:', adminRow
    );
    return null;
  }

  return {
    ...adminRow,
    email: user.email,
  };
}

/**
 * Logs an admin action to activity_log. Call this from any
 * approve/reject/toggle/hide action, right after the action succeeds.
 *
 * Example:
 *   await logActivity(admin.id, 'approve_submission', 'submissions', submissionId, 'Approved')
 */
export async function logActivity(actorId, action, targetTable, targetId, notes = null) {
  const supabase = await createClient();

  const { error } = await supabase.from('activity_log').insert({
    actor_id: actorId,
    action,
    target_table: targetTable,
    target_id: String(targetId),
    notes,
  });

  if (error) {
    console.error('Failed to log activity:', error);
  }
}