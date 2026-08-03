// app/admin/(protected)/locals-notes/[id]/page.jsx
// Locals' Note review/edit — mirrors submissions/[id]/page.jsx exactly,
// reusing the same SubmissionEditor and the same shared actions.js.

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SubmissionEditor from '@/components/admin/SubmissionEditor';
import {
  saveDraftAction,
  publishAction,
  rejectSubmissionAction,
} from '../../actions';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-dynamic';

function reshapeStoryForEditor(story) {
  if (!story) return null;

  const images = (story.story_images ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const cost = Array.isArray(story.cost_breakdowns)
    ? story.cost_breakdowns[0]
    : story.cost_breakdowns;

  const faqs = (story.story_faqs ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    id: story.id,
    submission_id: story.submission_id,
    name: story.author_name ?? '',
    email: '',
    country: story.author_country ?? '',
    location: story.location ?? '',
    title: story.title ?? '',
    excerpt: story.excerpt ?? '',
    region: story.region ?? '',
    category: story.category ?? '',
    story_type: story.story_type ?? 'locals_note',
    story: story.content ?? '',
    photo_urls: images.map((img) => img.url),
    show_cost_breakdown: story.show_cost_breakdown ?? false,
    cost_breakdown: cost
      ? {
          flights: cost.flights ?? '',
          stay: cost.stay ?? '',
          food: cost.food ?? '',
          activities: cost.activities ?? '',
          total: cost.total ?? '',
          currency: cost.currency ?? 'USD',
          notes: cost.notes ?? '',
        }
      : { flights: '', stay: '', food: '', activities: '', total: '', currency: 'USD', notes: '' },
    primary_keyword: story.primary_keyword ?? '',
    secondary_keywords: story.secondary_keywords ?? [],
    meta_title: story.meta_title ?? '',
    meta_description: story.meta_description ?? '',
    slug: story.slug ?? '',
    aeo_questions: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    geo_context_line: story.geo_context ?? '',
  };
}

export default async function LocalsNoteReviewPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission, error: subError } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (subError) {
    throw new Error(`Could not load submission: ${subError.message}`);
  }
  if (!submission) {
    notFound();
  }

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select(
      `
      *,
      story_images ( id, url, sort_order ),
      cost_breakdowns ( id, flights, stay, food, activities, total, total_per_day, currency, notes ),
      story_faqs ( id, question, answer, sort_order )
    `
    )
    .eq('submission_id', id)
    .maybeSingle();

  if (storyError) {
    throw new Error(`Could not load draft story: ${storyError.message}`);
  }

  const existingStory = reshapeStoryForEditor(story);

  const claimUrl = story?.claim_token
    ? `${SITE_URL}/claim/${story.claim_token}`
    : null;

  return (
    <div>
      <header style={{ padding: '1.5rem 6vw 0' }}>
        <p style={{ fontFamily: 'var(--body)', color: 'var(--grey)', fontSize: '0.9rem', margin: '0 0 0.3rem' }}>
          Reviewing locals&apos; note from {submission.name || 'Unknown'}
          {submission.email ? ` · ${submission.email}` : ''}
        </p>
        <p style={{ fontFamily: 'var(--body)', color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 1rem' }}>
          Submission status: <strong>{submission.status || 'pending'}</strong>
          {existingStory && (
            <>
              {' '}
              · Draft exists (last saved slug: <strong>{existingStory.slug || '—'}</strong>)
            </>
          )}
        </p>

        {story?.claim_token && (
          <div
            style={{
              background: 'var(--mist)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '1rem 1.2rem',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ fontFamily: 'var(--body)', fontSize: '0.9rem', color: 'var(--ink)', margin: '0 0 0.4rem' }}>
              Claim status: <strong>{story.claim_status}</strong>
              {story.claimed_by ? ' (already claimed)' : ''}
            </p>
            {!story.claimed_by && (
              <>
                <p style={{ fontFamily: 'var(--body)', fontSize: '0.85rem', color: 'var(--grey)', margin: '0 0 0.5rem' }}>
                  Send this link to {submission.name || 'the author'} so they can claim their note:
                </p>
                <code
                  style={{
                    display: 'block',
                    background: 'var(--cloud)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.85rem',
                    wordBreak: 'break-all',
                    userSelect: 'all',
                  }}
                >
                  {claimUrl}
                </code>
              </>
            )}
          </div>
        )}
      </header>

      <SubmissionEditor
        mode="review"
        submission={submission}
        existingStory={existingStory}
        fixedStoryType="locals_note"
        onReject={rejectSubmissionAction}
        onSaveDraft={saveDraftAction}
        onPublish={publishAction}
      />
    </div>
  );
}