'use server';

// app/admin/(protected)/actions.js
//
// Server actions for AD6: Save Draft / Publish / Reject.
// Written for the REAL normalized schema:
//   stories + story_images + cost_breakdowns + story_faqs
//
// Every action re-checks admin auth itself — server actions do NOT
// inherit the (protected) layout's guard, so this is required.
//
// AD7 CHANGE: requireAdmin() now returns the admin record (it always
// could — saveStory() just wasn't capturing it before), and all three
// actions call logActivity() after a successful write.
//
// STEP V CHANGE: on publish, if the story doesn't already have a
// claim_token, generate one and set claim_status to 'invited'. This
// doesn't send any email — the token/link is shown in the admin
// review page for manual sending, per current workflow decision.
//
// AD6 FIX (this pass): saveStory() was only revalidating admin paths
// (/admin, /admin/submissions, /admin/submissions/[id]). Since the
// site is SSG-first, that meant a newly published story would show
// as "approved" in the admin list but would NOT actually appear on
// the public site — /stories, /stories/[slug], its region page, its
// category page, and the homepage would all keep serving stale
// cached versions until a full redeploy. Added public-path
// revalidation, scoped to publish only (drafts aren't public, so
// they don't need it).
//
// NOTE on stories.email: the schema audit found no confirmed `email`
// column on `stories`, so the author email is intentionally NOT saved
// to the stories table here. The original email still lives on the
// submission row.

import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getCurrentAdmin, logActivity } from '@/lib/supabase/admin-auth';

// ---------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Not authorized. Please sign in again.');
  }
  return admin;
}

// Cost inputs arrive as strings ("120", "", "12.50") — convert safely.
function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// ~200 words per minute, minimum 1 minute.
function estimateReadTime(text) {
  if (!text || !text.trim()) return null;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Long random string — unguessable, per Phase 2 security checklist.
function generateClaimToken() {
  return randomBytes(24).toString('hex');
}

// Map the editor payload -> a row shaped for the real `stories` table.
function buildStoryRow(payload, { publish }) {
  const row = {
    submission_id: payload.submissionId ?? null,
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt ?? null,
    region: payload.region ?? null,
    category: payload.category ?? null,
    content: payload.story ?? '',
    author_name: payload.name ?? '',
    author_country: payload.country ?? null,
    location: payload.location ?? null,
    cover_image_url: payload.coverImageUrl ?? payload.photoUrls?.[0] ?? null,
    read_time_minutes: estimateReadTime(payload.story),
    story_type: payload.storyType ?? 'tale',
    show_cost_breakdown: !!payload.showCostBreakdown,
    primary_keyword: payload.primaryKeyword || null,
    secondary_keywords: payload.secondaryKeywords?.length
      ? payload.secondaryKeywords
      : null,
    meta_title: payload.metaTitle || null,
    meta_description: payload.metaDescription || null,
    geo_context: payload.geoContextLine || null,
    status: publish ? 'published' : 'draft',
  };

  if (publish) {
    row.published_at = new Date().toISOString();
  }

  return row;
}

// Find a story that already exists for this payload so we update it
// instead of creating a duplicate. Priority:
//   1. explicit storyId (editor sends existingStory.id when present)
//   2. story linked to this submission
//   3. story with the same slug
async function findExistingStoryId(supabase, payload) {
  if (payload.storyId) return payload.storyId;

  if (payload.submissionId) {
    const { data, error } = await supabase
      .from('stories')
      .select('id')
      .eq('submission_id', payload.submissionId)
      .maybeSingle();
    if (error) throw new Error(`Lookup by submission failed: ${error.message}`);
    if (data?.id) return data.id;
  }

  if (payload.slug) {
    const { data, error } = await supabase
      .from('stories')
      .select('id')
      .eq('slug', payload.slug)
      .maybeSingle();
    if (error) throw new Error(`Lookup by slug failed: ${error.message}`);
    if (data?.id) return data.id;
  }

  return null;
}

// Replace-all pattern for child tables.
async function replaceStoryImages(supabase, storyId, photoUrls) {
  const { error: delError } = await supabase
    .from('story_images')
    .delete()
    .eq('story_id', storyId);
  if (delError) throw new Error(`Clearing old images failed: ${delError.message}`);

  if (!photoUrls?.length) return;

  const rows = photoUrls.map((url, index) => ({
    story_id: storyId,
    url,
    sort_order: index,
  }));

  const { error: insError } = await supabase.from('story_images').insert(rows);
  if (insError) throw new Error(`Saving images failed: ${insError.message}`);
}

async function replaceCostBreakdown(supabase, storyId, cost) {
  const { error: delError } = await supabase
    .from('cost_breakdowns')
    .delete()
    .eq('story_id', storyId);
  if (delError) throw new Error(`Clearing old cost breakdown failed: ${delError.message}`);

  if (!cost) return;

  const row = {
    story_id: storyId,
    flights: toNumberOrNull(cost.flights),
    stay: toNumberOrNull(cost.stay),
    food: toNumberOrNull(cost.food),
    activities: toNumberOrNull(cost.activities),
    total: toNumberOrNull(cost.total),
    total_per_day: toNumberOrNull(cost.totalPerDay),
    currency: cost.currency || 'USD',
    notes: cost.notes || null,
  };

  const { error: insError } = await supabase.from('cost_breakdowns').insert(row);
  if (insError) throw new Error(`Saving cost breakdown failed: ${insError.message}`);
}

async function replaceStoryFaqs(supabase, storyId, aeoQuestions) {
  const { error: delError } = await supabase
    .from('story_faqs')
    .delete()
    .eq('story_id', storyId);
  if (delError) throw new Error(`Clearing old FAQs failed: ${delError.message}`);

  const cleaned = (aeoQuestions ?? []).filter(
    (qa) => qa.question?.trim() && qa.answer?.trim()
  );
  if (!cleaned.length) return;

  const rows = cleaned.map((qa, index) => ({
    story_id: storyId,
    question: qa.question.trim(),
    answer: qa.answer.trim(),
    sort_order: index,
  }));

  const { error: insError } = await supabase.from('story_faqs').insert(rows);
  if (insError) throw new Error(`Saving FAQs failed: ${insError.message}`);
}

// STEP V: generate + save a claim token on publish, only if one
// doesn't already exist for this story (don't reset an in-progress
// or already-claimed invitation on re-publish/edit).
async function ensureClaimToken(supabase, storyId) {
  const { data, error } = await supabase
    .from('stories')
    .select('claim_token, claim_status')
    .eq('id', storyId)
    .maybeSingle();

  if (error) throw new Error(`Checking claim token failed: ${error.message}`);
  if (data?.claim_token) return; // already has one — leave it alone

  const token = generateClaimToken();
  const { error: updError } = await supabase
    .from('stories')
    .update({ claim_token: token, claim_status: 'invited' })
    .eq('id', storyId);

  if (updError) throw new Error(`Saving claim token failed: ${updError.message}`);
}

// ---------------------------------------------------------------
// Core save flow (shared by Save Draft and Publish)
// ---------------------------------------------------------------

async function saveStory(payload, { publish }) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  if (!payload.title?.trim()) return { error: 'A title is required.' };
  if (!payload.slug?.trim()) return { error: 'A URL slug is required.' };

  const storyRow = buildStoryRow(payload, { publish });
  const existingId = await findExistingStoryId(supabase, payload);

  let storyId;

  if (existingId) {
    const { error } = await supabase
      .from('stories')
      .update(storyRow)
      .eq('id', existingId);
    if (error) return { error: `Updating story failed: ${error.message}` };
    storyId = existingId;
  } else {
    const { data, error } = await supabase
      .from('stories')
      .insert(storyRow)
      .select('id')
      .single();
    if (error) return { error: `Creating story failed: ${error.message}` };
    storyId = data.id;
  }

  try {
    await replaceStoryImages(supabase, storyId, payload.photoUrls);
    await replaceCostBreakdown(
      supabase,
      storyId,
      payload.showCostBreakdown ? payload.costBreakdown : null
    );
    await replaceStoryFaqs(supabase, storyId, payload.aeoQuestions);

    if (publish) {
      await ensureClaimToken(supabase, storyId);
    }
  } catch (err) {
    return { error: err.message };
  }

  if (publish && payload.submissionId) {
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', payload.submissionId);
    if (error) {
      return {
        error: `Story published, but updating the submission status failed: ${error.message}`,
      };
    }
  }

  await logActivity(
    admin.user_id,
    publish ? 'publish_story' : 'save_draft',
    'stories',
    storyId,
    payload.title || null
  );

  // --- Admin paths — always revalidate so the admin UI reflects the
  // new status immediately regardless of draft vs publish. ---
  revalidatePath('/admin');
  revalidatePath('/admin/submissions');
  revalidatePath(`/admin/submissions/${payload.submissionId}`);

  // --- Public paths — ONLY relevant on publish. A draft was never
  // live, so there's nothing public to invalidate for it. Without
  // this block, a newly published story would show "approved" in
  // the admin list but keep serving a stale cached (or 404) page on
  // the public site until a full redeploy, since the site is
  // SSG-first. ---
  if (publish) {
    revalidatePath('/stories');
    revalidatePath(`/stories/${payload.slug}`);
    if (payload.region) revalidatePath(`/destinations/${payload.region}`);
    if (payload.category) revalidatePath(`/category/${payload.category}`);
    revalidatePath('/'); // homepage — remove if it never shows recent/featured stories
  }

  return { ok: true, storyId };
}

// ---------------------------------------------------------------
// The three exported actions
// ---------------------------------------------------------------

export async function saveDraftAction(payload) {
  try {
    return await saveStory(payload, { publish: false });
  } catch (err) {
    return { error: err.message || 'Save failed.' };
  }
}

export async function publishAction(payload) {
  try {
    return await saveStory(payload, { publish: true });
  } catch (err) {
    return { error: err.message || 'Publish failed.' };
  }
}

export async function rejectSubmissionAction(submissionId) {
  try {
    const admin = await requireAdmin();
    if (!submissionId) return { error: 'No submission to reject.' };

    const supabase = await createClient();
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId);

    if (error) return { error: `Reject failed: ${error.message}` };

    await logActivity(admin.user_id, 'reject_submission', 'submissions', submissionId, null);

    // Rejected submissions were never live on the public site, so
    // only admin paths need revalidation here — nothing public to
    // invalidate.
    revalidatePath('/admin');
    revalidatePath('/admin/submissions');
    return { ok: true };
  } catch (err) {
    return { error: err.message || 'Reject failed.' };
  }
}