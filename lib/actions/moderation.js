'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentAdmin, logActivity } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

// Only the story's claimed author can block a commenter on that story's
// thread. Re-checked here server-side — never trust a client-side
// isClaimedAuthor flag alone, per Phase 2 security checklist.
export async function blockUserAction(storyId, blockedUserId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You need to be signed in to do that.' };
  }

  if (user.id === blockedUserId) {
    return { error: 'You cannot block yourself.' };
  }

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('id, claimed_by')
    .eq('id', storyId)
    .maybeSingle();

  if (storyError || !story) {
    return { error: 'Story not found.' };
  }

  if (story.claimed_by !== user.id) {
    return { error: 'Only the claimed author of this story can block commenters.' };
  }

  const { error: insertError } = await supabase.from('author_blocks').insert({
    author_id: user.id,
    blocked_user_id: blockedUserId,
    story_id: storyId,
  });

  if (insertError) {
    // Unique-violation-style errors (already blocked) shouldn't look scary.
    if (insertError.code === '23505') {
      return { ok: true, alreadyBlocked: true };
    }
    return { error: 'Could not block this user — try again.' };
  }

  return { ok: true };
}

export async function unblockUserAction(storyId, blockedUserId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You need to be signed in to do that.' };
  }

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('id, claimed_by')
    .eq('id', storyId)
    .maybeSingle();

  if (storyError || !story || story.claimed_by !== user.id) {
    return { error: 'Only the claimed author of this story can manage blocks.' };
  }

  const { error: deleteError } = await supabase
    .from('author_blocks')
    .delete()
    .eq('story_id', storyId)
    .eq('blocked_user_id', blockedUserId)
    .eq('author_id', user.id);

  if (deleteError) {
    return { error: 'Could not unblock this user — try again.' };
  }

  return { ok: true };
}

// ---------------------------------------------------------------
// AD9 — Admin comment moderation actions.
// These use getCurrentAdmin() (admins table check), not the
// regular user session check above — different privilege tier.
// createAdminClient() bypasses RLS since admin needs to see/edit
// hidden comments that public RLS policies would otherwise block.
// ---------------------------------------------------------------

export async function adminHideCommentAction(commentId) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: 'Not authorized.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('comments')
    .update({ status: 'hidden' })
    .eq('id', commentId);

  if (error) return { error: 'Could not hide comment.' };

  await logActivity(admin.id, 'hide_comment', 'comments', commentId);
  return { ok: true };
}

export async function adminUnhideCommentAction(commentId) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: 'Not authorized.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('comments')
    .update({ status: 'visible' })
    .eq('id', commentId);

  if (error) return { error: 'Could not unhide comment.' };

  await logActivity(admin.id, 'unhide_comment', 'comments', commentId);
  return { ok: true };
}

// Clears a single report row without touching the comment itself —
// for "reviewed, not actually a problem" cases.
export async function dismissReportAction(reportId) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: 'Not authorized.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('comment_reports')
    .delete()
    .eq('id', reportId);

  if (error) return { error: 'Could not dismiss report.' };

  await logActivity(admin.id, 'dismiss_report', 'comment_reports', reportId);
  return { ok: true };
}