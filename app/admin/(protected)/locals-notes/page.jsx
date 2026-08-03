// app/admin/(protected)/locals-notes/page.jsx
// Locals' Notes list — mirrors submissions/page.jsx, filtered to
// requested_type = 'locals_note'.

import { createClient } from '@/lib/supabase/server';
import LocalsNotesHeader from '@/components/admin/LocalsNotesHeader';
import LocalsNotesTable from '@/components/admin/LocalsNotesTable';

export default async function LocalsNotesPage({ searchParams }) {
  const params = await searchParams;
  const activeStatus = params?.status && ['pending', 'approved', 'rejected'].includes(params.status)
    ? params.status
    : 'pending';

  const supabase = await createClient();

  const [{ count: pendingCount }, { count: approvedCount }, { count: rejectedCount }, { count: allCount }] =
    await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('requested_type', 'locals_note').eq('status', 'pending'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('requested_type', 'locals_note').eq('status', 'approved'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('requested_type', 'locals_note').eq('status', 'rejected'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('requested_type', 'locals_note'),
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
    .eq('requested_type', 'locals_note')
    .order('created_at', { ascending: false });

  if (activeStatus !== 'all') {
    query = query.eq('status', activeStatus);
  }

  const { data: submissions, error } = await query;

  return (
    <LocalsNotesHeader activeStatus={activeStatus} counts={counts} error={!!error}>
      <LocalsNotesTable submissions={submissions ?? []} activeStatus={activeStatus} />
    </LocalsNotesHeader>
  );
}