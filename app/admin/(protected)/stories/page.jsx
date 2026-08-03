// app/admin/(protected)/stories/page.jsx
// "All Stories" library — every Tale in the stories table, draft or
// published, regardless of whether it came from a submission or was
// written from scratch. This is where you go to find and re-edit
// anything already created — separate from Submissions, which only
// tracks the review queue.

import { createClient } from '@/lib/supabase/server';
import StoriesLibraryHeader from '@/components/admin/StoriesLibraryHeader';
import StoriesLibraryTable from '@/components/admin/StoriesLibraryTable';

export default async function StoriesLibraryPage({ searchParams }) {
  const params = await searchParams;
  const activeStatus = params?.status && ['draft', 'published'].includes(params.status)
    ? params.status
    : 'published';

  const supabase = await createClient();

  const [{ count: draftCount }, { count: publishedCount }, { count: allCount }] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'tale').eq('status', 'draft'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'tale').eq('status', 'published'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'tale'),
  ]);

  const counts = {
    draft: draftCount ?? 0,
    published: publishedCount ?? 0,
    all: allCount ?? 0,
  };

  let query = supabase
    .from('stories')
    .select('id, title, slug, location, author_name, status, published_at, created_at')
    .eq('story_type', 'tale')
    .order('created_at', { ascending: false });

  if (activeStatus !== 'all') {
    query = query.eq('status', activeStatus);
  }

  const { data: stories, error } = await query;

  return (
    <StoriesLibraryHeader activeStatus={activeStatus} counts={counts} error={!!error}>
      <StoriesLibraryTable stories={stories ?? []} basePath="/admin/stories" activeStatus={activeStatus} />
    </StoriesLibraryHeader>
  );
}