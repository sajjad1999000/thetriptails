import { createClient } from '@/lib/supabase/server';
import { getCurrentStoryOfWeek } from '@/lib/supabase/storyOfWeek';
import StoryOfWeekForm from './StoryOfWeekForm';

export default async function StoryOfWeekAdminPage() {
  const supabase = await createClient();

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, slug, status')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const current = await getCurrentStoryOfWeek(supabase);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--display)', marginBottom: '0.5rem' }}>
        Story of the Week — Manual Override
      </h1>

      {current ? (
        <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
          Current pick ({current.selection_type}): <strong>{current.story?.title}</strong>
          {' '}({current.week_start} → {current.week_end})
        </p>
      ) : (
        <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
          No Story of the Week set for the current week yet.
        </p>
      )}

      {error && <p style={{ color: 'red' }}>Failed to load stories: {error.message}</p>}

      <StoryOfWeekForm stories={stories ?? []} />
    </div>
  );
}