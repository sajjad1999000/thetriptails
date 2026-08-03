// app/admin/(protected)/locals-notes/library/page.jsx
// "All Locals' Notes" library — mirrors stories/page.jsx, filtered to
// story_type = 'locals_note'. Separate path from /admin/locals-notes
// so it doesn't collide with the existing submission-review list.

import { createClient } from '@/lib/supabase/server';
import StoriesLibraryHeader from '@/components/admin/StoriesLibraryHeader';
import StoriesLibraryTable from '@/components/admin/StoriesLibraryTable';

export default async function LocalsNotesLibraryPage({ searchParams }) {
  const params = await searchParams;
  const activeStatus = params?.status && ['draft', 'published'].includes(params.status)
    ? params.status
    : 'published';

  const supabase = await createClient();

  const [{ count: draftCount }, { count: publishedCount }, { count: allCount }] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'locals_note').eq('status', 'draft'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'locals_note').eq('status', 'published'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('story_type', 'locals_note'),
  ]);

  const counts = {
    draft: draftCount ?? 0,
    published: publishedCount ?? 0,
    all: allCount ?? 0,
  };

  let query = supabase
    .from('stories')
    .select('id, title, slug, location, author_name, status, published_at, created_at')
    .eq('story_type', 'locals_note')
    .order('created_at', { ascending: false });

  if (activeStatus !== 'all') {
    query = query.eq('status', activeStatus);
  }

  const { data: stories, error } = await query;

  return (
    <StoriesLibraryHeader activeStatus={activeStatus} counts={counts} error={!!error}>
      <StoriesLibraryTable stories={stories ?? []} basePath="/admin/locals-notes/library" activeStatus={activeStatus} />
    </StoriesLibraryHeader>
  );
}