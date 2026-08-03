// app/admin/(protected)/authors/actions.js
// AD8 — Server actions for the Authors screen.
//
// Same shape as AD6/AD7: requireAdmin() re-checks auth (server
// actions don't inherit the (protected) layout guard), every
// successful write calls logActivity(), and both actions
// revalidatePath('/admin/authors') so the list reflects changes
// without a full redeploy.

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentAdmin, logActivity } from '@/lib/supabase/admin-auth';

const ALLOWED_TIERS = ['none', 'verified', 'top_storyteller'];

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Not authorized. Please sign in again.');
  }
  return admin;
}

export async function updateVerifiedTierAction(profileId, tier) {
  try {
    const admin = await requireAdmin();

    if (!ALLOWED_TIERS.includes(tier)) {
      return { error: 'Invalid verified tier.' };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ verified_tier: tier })
      .eq('id', profileId);

    if (error) return { error: `Update failed: ${error.message}` };

    await logActivity(admin.user_id, 'update_verified_tier', 'profiles', profileId, tier);

    revalidatePath('/admin/authors');
    return { ok: true };
  } catch (err) {
    return { error: err.message || 'Update failed.' };
  }
}

// Revokes "claimed author" status on the PROFILE only.
// verified_tier is intentionally left untouched — it reflects
// recognition/track record, not claim status. An author can be
// unclaimed but still carry "Top Storyteller," and regain claimed
// status later without losing that tier.
//
// OPEN ITEM: this does not touch claimed_by / claim_status on any
// stories this author previously claimed via claimStoryAction — there's
// no confirmed product decision yet on whether revoking a profile
// should also unlink their published stories, re-open the claim slot,
// or leave the byline as-is. If that behavior is wanted later, extend
// this action to also update `stories` where claimed_by = profileId
// (mirroring the pattern in lib/actions/claims.js).
export async function revokeClaimAction(profileId) {
  try {
    const admin = await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ is_claimed_author: false })
      .eq('id', profileId);

    if (error) return { error: `Revoke failed: ${error.message}` };

    await logActivity(admin.user_id, 'revoke_claim', 'profiles', profileId, null);

    revalidatePath('/admin/authors');
    return { ok: true };
  } catch (err) {
    return { error: err.message || 'Revoke failed.' };
  }
}