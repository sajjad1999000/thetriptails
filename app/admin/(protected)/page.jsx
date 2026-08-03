// app/admin/(protected)/page.jsx
// The main /admin landing page. Shows quick stats so you know
// what needs attention without digging into the submissions list.
//
// This stays a Server Component (no 'use client') because it needs
// to import lib/supabase/server.js, which uses next/headers' cookies()
// — a server-only API. The actual UI + styled-jsx live in the client
// component DashboardStats.jsx, which this file renders with the
// fetched data passed in as props.
import { createClient } from '@/lib/supabase/server';
import DashboardStats from './DashboardStats';
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  // Pending count
  const { count: pendingCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  // Today's submissions (created since midnight, local server time)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfToday.toISOString());
  // Total PUBLISHED stories only — filtered by status so drafts
  // (which now exist from AD6/AD7 testing) don't inflate this number.
  const { count: publishedCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  return (
    <DashboardStats
      pendingCount={pendingCount ?? 0}
      todayCount={todayCount ?? 0}
      publishedCount={publishedCount ?? 0}
    />
  );
}