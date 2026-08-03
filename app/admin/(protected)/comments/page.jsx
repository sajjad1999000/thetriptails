// app/admin/(protected)/comments/page.jsx
// AD9 — Comment moderation.
//
// Server component: fetches comments from Supabase, filtered by a
// ?status= query param (defaults to 'reported'). Uses the admin
// (service-role) client for reads — comments RLS is scoped to
// 'visible' for public readers, but this screen needs hidden rows
// too. Rendering + styling lives in CommentsHeader (client) and
// CommentsTable (client) — this file stays a plain Server Component,
// same pattern as app/admin/(protected)/submissions/page.jsx.

import { createAdminClient } from '@/lib/supabase/admin';
import CommentsHeader from '@/components/admin/CommentsHeader';
import CommentsTable from '@/components/admin/CommentsTable';

export default async function CommentsPage({ searchParams }) {
  const params = await searchParams;
  const activeStatus = params?.status && ['all', 'reported', 'hidden'].includes(params.status)
    ? params.status
    : 'reported';

  const supabase = createAdminClient();

  const [{ count: allCount }, { count: hiddenCount }, { data: reportRows }] =
    await Promise.all([
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'hidden'),
      supabase
        .from('comment_reports')
        .select('id, comment_id, reason, created_at')
        .order('created_at', { ascending: false }),
    ]);

  const reportMap = {};
  (reportRows || []).forEach((r) => {
    if (!reportMap[r.comment_id]) reportMap[r.comment_id] = [];
    reportMap[r.comment_id].push(r);
  });

  const counts = {
    all: allCount ?? 0,
    hidden: hiddenCount ?? 0,
    reported: Object.keys(reportMap).length,
  };

  // "Reported" tab needs comment ids up front to filter the query.
  // If there are zero reported comments, skip the query entirely
  // and render an empty state.
  let reportedIds = null;
  if (activeStatus === 'reported') {
    reportedIds = Object.keys(reportMap);
    if (reportedIds.length === 0) {
      return (
        <CommentsHeader activeStatus={activeStatus} counts={counts}>
          <CommentsTable comments={[]} />
        </CommentsHeader>
      );
    }
  }

  let query = supabase
    .from('comments')
    .select(
      'id, content, status, created_at, story_id, user_id, profiles(display_name), stories(title, slug)'
    )
    .order('created_at', { ascending: false });

  if (activeStatus === 'hidden') {
    query = query.eq('status', 'hidden');
  }
  if (activeStatus === 'reported') {
    query = query.in('id', reportedIds);
  }

  const { data: comments, error } = await query;

  const enriched = (comments ?? []).map((c) => ({
    ...c,
    reports: reportMap[c.id] || [],
  }));

  return (
    <CommentsHeader activeStatus={activeStatus} counts={counts} error={!!error}>
      <CommentsTable comments={enriched} />
    </CommentsHeader>
  );
}