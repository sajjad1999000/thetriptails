'use server';

// app/admin/(protected)/note-of-month/actions.js
// Mirrors story-of-week/actions.js exactly, pointed at note_of_month
// instead. Same profiles auto-heal reasoning applies here — selected_by
// references profiles(id).

import { getCurrentAdmin, logActivity } from '@/lib/supabase/admin-auth';
import { setManualNoteOfMonth } from '@/lib/supabase/noteOfMonth';
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

  if (existing) return;

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

export async function setNoteOfMonthAction({ storyId, month, year }) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: 'Not authorized.' };

  try {
    await ensureAdminHasProfile(admin.user_id, admin.email);

    await setManualNoteOfMonth({ storyId, month, year, adminUserId: admin.user_id });

    await logActivity(
      admin.user_id,
      'set_note_of_month',
      'note_of_month',
      storyId,
      `Manually set as Note of the Month for ${month}/${year}`
    );

    return { ok: true };
  } catch (err) {
    console.error('setNoteOfMonthAction failed:', err);
    return { error: 'Failed to set Note of the Month.' };
  }
}