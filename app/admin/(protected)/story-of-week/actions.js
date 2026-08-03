'use server';

// app/admin/(protected)/story-of-week/actions.js
//
// Server action for the admin dashboard's manual Story of the Week
// override. Gates on getCurrentAdmin() (lib/supabase/admin-auth.js)
// rather than trusting the caller — this is the enforcement point
// setManualStoryOfWeek() itself relies on, since that function uses
// the service-role client and has no RLS protection of its own.
//
// FIX: story_of_week.selected_by has a foreign key to profiles(id).
// Not every admin is guaranteed to have logged in through the
// reader-facing auth flow that auto-creates a profiles row, so we
// auto-heal here — create a minimal profiles row for this admin if
// one doesn't already exist, before attempting the insert that
// depends on it.

import { getCurrentAdmin, logActivity } from '@/lib/supabase/admin-auth';
import { setManualStoryOfWeek } from '@/lib/supabase/storyOfWeek';
import { createAdminClient } from '@/lib/supabase/admin';

async function ensureAdminHasProfile(adminUserId, adminEmail) {
  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', adminUserId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Checking admin profile failed: ${fetchError.message}`);
  }

  if (existing) return; // already has one — nothing to do

  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: adminUserId,
      email: adminEmail,
      display_name: adminEmail?.split('@')[0] || 'Admin',
      is_claimed_author: false,
      verified_tier: 'none',
    });

  if (insertError) {
    throw new Error(`Auto-creating admin profile failed: ${insertError.message}`);
  }
}

export async function setStoryOfWeekAction({ storyId, weekStart, weekEnd }) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: 'Not authorized.' };

  try {
    // selected_by references profiles.id, which matches auth.users.id
    // — same value as admin.user_id (admins.user_id also references
    // auth.users.id directly). Auto-heal the profiles row if missing,
    // so this never fails on a foreign key violation for an admin
    // who's never logged in through the reader-facing auth flow.
    await ensureAdminHasProfile(admin.user_id, admin.email);

    await setManualStoryOfWeek({ storyId, weekStart, weekEnd, adminUserId: admin.user_id });

    await logActivity(
      admin.user_id,
      'set_story_of_week',
      'story_of_week',
      storyId,
      `Manually set as Story of the Week for week of ${weekStart}`
    );

    return { ok: true };
  } catch (err) {
    console.error('setStoryOfWeekAction failed:', err);
    return { error: 'Failed to set Story of the Week.' };
  }
}