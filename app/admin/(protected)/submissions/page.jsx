// app/admin/(protected)/submissions/page.jsx
// AD5 — Submissions list.
//
// Server component: fetches submissions from Supabase, filtered by
// a ?status= query param (defaults to 'pending'). Rendering + all
// styling lives in SubmissionsHeader (client component) and
// SubmissionsTable (client component) — this file stays a plain
// Server Component so it can talk to Supabase directly, with no
// styled-jsx here (that was causing the build error).

import { createClient } from '@/lib/supabase/server';
import SubmissionsHeader from '@/components/admin/SubmissionsHeader';
import SubmissionsTable from '@/components/admin/SubmissionsTable';

export default async function SubmissionsPage({ searchParams }) {
  const params = await searchParams;
  const activeStatus = params?.status && ['pending', 'approved', 'rejected'].includes(params.status)
    ? params.status
    : 'pending';

  const supabase = await createClient();

  const [{ count: pendingCount }, { count: approvedCount }, { count: rejectedCount }, { count: allCount }] =
    await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
    ]);

  const counts = {
    pending: pendingCount ?? 0,
    approved: approvedCount ?? 0,
    rejected: rejectedCount ?? 0,
    all: allCount ?? 0,
  };

  let query = supabase
    .from('submissions')
    .select('id, name, email, country, location, title, status, created_at')
    .order('created_at', { ascending: false });

  if (activeStatus !== 'all') {
    query = query.eq('status', activeStatus);
  }

  const { data: submissions, error } = await query;

  return (
    <SubmissionsHeader activeStatus={activeStatus} counts={counts} error={!!error}>
      <SubmissionsTable submissions={submissions ?? []} activeStatus={activeStatus} />
    </SubmissionsHeader>
  );
}