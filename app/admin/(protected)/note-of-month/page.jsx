import { createClient } from '@/lib/supabase/server';
import { getCurrentNoteOfMonth } from '@/lib/supabase/noteOfMonth';
import NoteOfMonthForm from './NoteOfMonthForm';

export default async function NoteOfMonthAdminPage() {
  const supabase = await createClient();

  const { data: notes, error } = await supabase
    .from('stories')
    .select('id, title, slug, status')
    .eq('status', 'published')
    .eq('story_type', 'locals_note')
    .order('published_at', { ascending: false });

  const current = await getCurrentNoteOfMonth(supabase);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--display)', marginBottom: '0.5rem' }}>
        Note of the Month — Manual Override
      </h1>

      {current ? (
        <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
          Current pick ({current.selection_type}): <strong>{current.story?.title}</strong>
          {' '}({current.month}/{current.year})
        </p>
      ) : (
        <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
          No Note of the Month set for the current month yet.
        </p>
      )}

      {error && <p style={{ color: 'red' }}>Failed to load locals&apos; notes: {error.message}</p>}

      <NoteOfMonthForm notes={notes ?? []} />
    </div>
  );
}