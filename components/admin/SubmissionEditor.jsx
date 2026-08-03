'use client';
// components/admin/SubmissionEditor.jsx
//
// Shared editor used by six entry points:
//   - Story submission review   (app/admin/submissions/[id]/page.jsx)         mode="review" fixedStoryType="tale"       submission=row
//   - New Story                 (app/admin/stories/new/page.jsx)              mode="new"    fixedStoryType="tale"       submission=null
//   - Edit existing story       (app/admin/stories/[id]/page.jsx)             mode="review" fixedStoryType="tale"       submission=null
//   - Locals' Note review       (app/admin/locals-notes/[id]/page.jsx)        mode="review" fixedStoryType="locals_note" submission=row
//   - New Locals' Note          (app/admin/locals-notes/new/page.jsx)         mode="new"    fixedStoryType="locals_note" submission=null
//   - Edit existing locals note (app/admin/locals-notes/library/[id]/page.jsx) mode="review" fixedStoryType="locals_note" submission=null
//
// STEP AD CHANGE: Reject is now only shown when there's an actual
// submission behind this edit (mode==='review' AND submission is
// truthy). Editing an already-existing story directly (no submission
// row) has nothing to "reject" — there was never a pending request.

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ConfirmDialog';
import { parseMetadataBlock, slugify } from '@/lib/admin/parseMetadata';
import {
  uploadStoryPhoto,
  moveSubmissionPhotoToStory,
  deleteStoryPhoto,
} from '@/lib/supabase/storage';

const CATEGORIES = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'culture-heritage', label: 'Culture & Heritage' },
  { value: 'food-drink', label: 'Food & Drink' },
  { value: 'budget-travel', label: 'Budget Travel' },
  { value: 'solo-travel', label: 'Solo Travel' },
  { value: 'family-travel', label: 'Family Travel' },
  { value: 'road-trips', label: 'Road Trips' },
  { value: 'nature-wildlife', label: 'Nature & Wildlife' },
];

const REGIONS = [
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'africa', label: 'Africa' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'middle-east', label: 'Middle East' },
];

const STORY_TYPE_LABELS = {
  tale: { label: 'Tale', hint: 'A full first-person travel story.' },
  locals_note: { label: "Local's Note", hint: 'A short, practical tip from someone who lives there.' },
};

export default function SubmissionEditor({
  mode, // 'review' | 'new'
  submission, // original submission row, null when editing an existing story directly
  existingStory, // draft/published story row if one already exists, else null
  fixedStoryType, // required — 'tale' | 'locals_note'
  onReject,   // server action — optional, only used when submission exists
  onSaveDraft, // server action
  onPublish,   // server action
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const seed = existingStory ?? {};

  const [name, setName] = useState(seed.name ?? submission?.name ?? '');
  const [email, setEmail] = useState(seed.email ?? submission?.email ?? '');
  const [country, setCountry] = useState(seed.country ?? submission?.country ?? '');
  const [location, setLocation] = useState(seed.location ?? submission?.location ?? '');
  const [title, setTitle] = useState(seed.title ?? submission?.title ?? '');
  const [story, setStory] = useState(seed.story ?? submission?.story ?? '');
  const [excerpt, setExcerpt] = useState(seed.excerpt ?? '');
  const [region, setRegion] = useState(seed.region ?? '');
  const [category, setCategory] = useState(seed.category ?? '');

  const storyType = fixedStoryType ?? seed.story_type ?? 'tale';
  const storyTypeInfo = STORY_TYPE_LABELS[storyType] ?? STORY_TYPE_LABELS.tale;

  const [photos, setPhotos] = useState(
    seed.photo_urls?.map((url) => ({ url, source: 'existing' })) ?? []
  );
  const [uploading, setUploading] = useState(false);

  const [showCostBreakdown, setShowCostBreakdown] = useState(seed.show_cost_breakdown ?? false);
  const [cost, setCost] = useState(
    seed.cost_breakdown ?? { flights: '', stay: '', food: '', activities: '', total: '', currency: 'USD', notes: '' }
  );

  const [metadataPaste, setMetadataPaste] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState(seed.primary_keyword ?? '');
  const [secondaryKeywords, setSecondaryKeywords] = useState(seed.secondary_keywords ?? []);
  const [metaTitle, setMetaTitle] = useState(seed.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(seed.meta_description ?? '');
  const [slug, setSlug] = useState(seed.slug ?? '');
  const [aeoQuestions, setAeoQuestions] = useState(seed.aeo_questions ?? []);
  const [geoContextLine, setGeoContextLine] = useState(seed.geo_context_line ?? '');

  const [confirmAction, setConfirmAction] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  function handleParseMetadata() {
    const parsed = parseMetadataBlock(metadataPaste);
    if (parsed.primaryKeyword) setPrimaryKeyword(parsed.primaryKeyword);
    if (parsed.secondaryKeywords.length) setSecondaryKeywords(parsed.secondaryKeywords);
    if (parsed.metaTitle) setMetaTitle(parsed.metaTitle);
    if (parsed.metaDescription) setMetaDescription(parsed.metaDescription);
    if (parsed.slug) setSlug(parsed.slug);
    if (parsed.aeoQuestions.length) setAeoQuestions(parsed.aeoQuestions);
    if (parsed.geoContextLine) setGeoContextLine(parsed.geoContextLine);
  }

  function handleTitleBlur() {
    if (!slug && title) setSlug(slugify(title));
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setErrorMsg('');
    try {
      for (const file of files) {
        const url = await uploadStoryPhoto(file);
        setPhotos((prev) => [...prev, { url, source: 'new' }]);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleUseSubmissionPhoto(submissionUrl) {
    setUploading(true);
    setErrorMsg('');
    try {
      const storyUrl = await moveSubmissionPhotoToStory(submissionUrl);
      setPhotos((prev) => [...prev, { url: storyUrl, source: 'submission' }]);
    } catch (err) {
      setErrorMsg(err.message || 'Could not import that photo.');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemovePhoto(index) {
    const photo = photos[index];
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (photo.source !== 'existing-external') {
      await deleteStoryPhoto(photo.url).catch(() => {});
    }
  }

  function buildStoryPayload() {
    return {
      storyId: seed.id ?? null,
      submissionId: submission?.id ?? existingStory?.submission_id ?? null,
      name,
      email,
      country,
      location,
      title,
      story,
      excerpt,
      region,
      category,
      photoUrls: photos.map((p) => p.url),
      showCostBreakdown,
      costBreakdown: showCostBreakdown ? cost : null,
      primaryKeyword,
      secondaryKeywords,
      metaTitle,
      metaDescription,
      slug: slug || slugify(title),
      aeoQuestions,
      geoContextLine,
      storyType,
    };
  }

  function libraryPath() {
    if (storyType === 'locals_note') {
      return submission ? '/admin/locals-notes' : '/admin/locals-notes/library';
    }
    return submission ? '/admin/submissions' : '/admin/stories';
  }

  function handleSaveDraft() {
    setErrorMsg('');
    startTransition(async () => {
      const result = await onSaveDraft(buildStoryPayload());
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        router.push(libraryPath());
      }
    });
  }

  function handlePublish() {
    setErrorMsg('');
    startTransition(async () => {
      const result = await onPublish(buildStoryPayload());
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        router.push(libraryPath());
      }
    });
  }

  function handleReject() {
    if (!submission) return;
    setErrorMsg('');
    startTransition(async () => {
      const result = await onReject(submission.id);
      setConfirmAction(null);
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        router.push(libraryPath());
      }
    });
  }

  return (
    <div className="editor">
      {errorMsg && <p className="editor-error">{errorMsg}</p>}

      <section className="editor-section">
        <h2 className="editor-section-title">Story Details</h2>

        <div className="editor-type-fixed">
          <span className="editor-type-fixed-label">{storyTypeInfo.label}</span>
          <span className="editor-type-fixed-hint">{storyTypeInfo.hint}</span>
        </div>

        <div className="editor-grid">
          <label className="editor-field">
            <span>Author name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="editor-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="editor-field">
            <span>Location</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <label className="editor-field">
            <span>Country</span>
            <input value={country} onChange={(e) => setCountry(e.target.value)} />
          </label>
          <label className="editor-field">
            <span>Region</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">— Select region —</option>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
          <label className="editor-field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">— Select category —</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="editor-field">
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleTitleBlur} />
        </label>

        <label className="editor-field">
          <span>Excerpt</span>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short 1-2 sentence teaser shown on story cards and listing pages."
          />
        </label>

        <label className="editor-field">
          <span>Story</span>
          <textarea rows={14} value={story} onChange={(e) => setStory(e.target.value)} />
        </label>

        {submission?.story && mode === 'review' && (
          <details className="editor-original">
            <summary>View original submission text</summary>
            <p>{submission.story}</p>
          </details>
        )}
      </section>

      <section className="editor-section">
        <h2 className="editor-section-title">Photos</h2>

        {submission?.photo_urls?.length > 0 && (
          <div className="editor-submission-photos">
            <p className="editor-hint">From the original submission — click to add:</p>
            <div className="editor-photo-grid">
              {submission.photo_urls.map((url) => (
                <button
                  type="button"
                  key={url}
                  className="editor-photo-thumb editor-photo-thumb-add"
                  onClick={() => handleUseSubmissionPhoto(url)}
                  disabled={uploading}
                >
                  <img src={url} alt="" />
                  <span>+ Add</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="editor-photo-grid">
          {photos.map((photo, i) => (
            <div className="editor-photo-thumb" key={photo.url}>
              <img src={photo.url} alt="" />
              <button type="button" onClick={() => handleRemovePhoto(i)}>Remove</button>
            </div>
          ))}
        </div>

        <label className="editor-upload-btn">
          {uploading ? 'Uploading…' : 'Upload photos from computer'}
          <input type="file" accept="image/*" multiple hidden onChange={handleFileUpload} disabled={uploading} />
        </label>
      </section>

      <section className="editor-section">
        <h2 className="editor-section-title">Cost Breakdown</h2>

        <label className="editor-toggle">
          <input
            type="checkbox"
            checked={showCostBreakdown}
            onChange={(e) => setShowCostBreakdown(e.target.checked)}
          />
          <span>Show cost breakdown on this story</span>
        </label>

        {showCostBreakdown && (
          <div className="editor-grid">
            <label className="editor-field">
              <span>Flights</span>
              <input value={cost.flights} onChange={(e) => setCost({ ...cost, flights: e.target.value })} />
            </label>
            <label className="editor-field">
              <span>Stay</span>
              <input value={cost.stay} onChange={(e) => setCost({ ...cost, stay: e.target.value })} />
            </label>
            <label className="editor-field">
              <span>Food</span>
              <input value={cost.food} onChange={(e) => setCost({ ...cost, food: e.target.value })} />
            </label>
            <label className="editor-field">
              <span>Activities</span>
              <input value={cost.activities} onChange={(e) => setCost({ ...cost, activities: e.target.value })} />
            </label>
            <label className="editor-field">
              <span>Total</span>
              <input value={cost.total} onChange={(e) => setCost({ ...cost, total: e.target.value })} />
            </label>
            <label className="editor-field">
              <span>Currency</span>
              <input value={cost.currency} onChange={(e) => setCost({ ...cost, currency: e.target.value })} />
            </label>
          </div>
        )}
      </section>

      <section className="editor-section">
        <h2 className="editor-section-title">Metadata</h2>
        <p className="editor-hint">Paste the full metadata block below, then click Parse.</p>

        <textarea
          rows={8}
          className="editor-metadata-paste"
          placeholder="Primary keyword: ...&#10;Secondary keywords: ...&#10;Meta title: ...&#10;Meta description: ...&#10;URL slug: ...&#10;AEO questions answered:&#10;Q: ...&#10;A: ...&#10;GEO context line: ..."
          value={metadataPaste}
          onChange={(e) => setMetadataPaste(e.target.value)}
        />
        <button type="button" className="editor-parse-btn" onClick={handleParseMetadata}>
          Parse metadata
        </button>

        <div className="editor-grid">
          <label className="editor-field">
            <span>Primary keyword</span>
            <input value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} />
          </label>
          <label className="editor-field">
            <span>URL slug</span>
            <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
          </label>
        </div>

        <label className="editor-field">
          <span>Meta title</span>
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </label>

        <label className="editor-field">
          <span>Meta description</span>
          <textarea rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </label>

        <label className="editor-field">
          <span>Secondary keywords (comma-separated)</span>
          <input
            value={secondaryKeywords.join(', ')}
            onChange={(e) => setSecondaryKeywords(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </label>

        <label className="editor-field">
          <span>GEO context line</span>
          <textarea rows={2} value={geoContextLine} onChange={(e) => setGeoContextLine(e.target.value)} />
        </label>

        {aeoQuestions.length > 0 && (
          <div className="editor-aeo-list">
            <span className="editor-aeo-label">AEO questions</span>
            {aeoQuestions.map((qa, i) => (
              <div className="editor-aeo-pair" key={i}>
                <input
                  value={qa.question}
                  placeholder="Question"
                  onChange={(e) => {
                    const next = [...aeoQuestions];
                    next[i] = { ...next[i], question: e.target.value };
                    setAeoQuestions(next);
                  }}
                />
                <textarea
                  rows={2}
                  value={qa.answer}
                  placeholder="Answer"
                  onChange={(e) => {
                    const next = [...aeoQuestions];
                    next[i] = { ...next[i], answer: e.target.value };
                    setAeoQuestions(next);
                  }}
                />
                <button type="button" onClick={() => setAeoQuestions(aeoQuestions.filter((_, idx) => idx !== i))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="editor-actions">
        {mode === 'review' && submission && (
          <button
            type="button"
            className="editor-btn-reject"
            onClick={() => setConfirmAction('reject')}
            disabled={isPending}
          >
            Reject
          </button>
        )}
        <button type="button" className="editor-btn-draft" onClick={handleSaveDraft} disabled={isPending}>
          {isPending ? 'Saving…' : 'Save Draft'}
        </button>
        <button type="button" className="editor-btn-publish btn-sun" onClick={handlePublish} disabled={isPending}>
          {isPending ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      <ConfirmDialog
        open={confirmAction === 'reject'}
        title="Reject this submission?"
        message="This marks the submission as rejected. This can't be easily undone."
        confirmLabel="Reject"
        destructive
        onConfirm={handleReject}
        onCancel={() => setConfirmAction(null)}
      />

      <style jsx>{`
        .editor {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 6vw 6rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .editor-error {
          background: #fbe6e4;
          color: #b3261e;
          font-family: var(--body);
          padding: 0.9rem 1.2rem;
          border-radius: 10px;
        }
        .editor-section {
          background: var(--cloud);
          border-radius: 14px;
          border: 1px solid var(--line);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .editor-section-title {
          font-family: var(--display);
          font-size: 1.3rem;
          color: var(--pine);
          margin: 0;
        }
        .editor-type-fixed {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          background: var(--mist);
          width: fit-content;
        }
        .editor-type-fixed-label {
          font-family: var(--body);
          font-weight: 700;
          color: var(--pine);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .editor-type-fixed-hint {
          font-family: var(--body);
          font-size: 0.82rem;
          color: var(--grey);
        }
        .editor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .editor-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-family: var(--body);
        }
        .editor-field span {
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--grey);
        }
        .editor-field input,
        .editor-field textarea,
        .editor-field select,
        .editor-metadata-paste {
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          font-family: var(--body);
          font-size: 0.95rem;
          background: var(--mist);
        }
        .editor-hint {
          font-family: var(--body);
          color: var(--grey);
          font-size: 0.85rem;
          margin: 0;
        }
        .editor-original {
          font-family: var(--body);
          color: var(--grey);
          font-size: 0.9rem;
        }
        .editor-original p {
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .editor-photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
        }
        .editor-photo-thumb {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
        }
        .editor-photo-thumb img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        .editor-photo-thumb button,
        .editor-photo-thumb-add span {
          font-family: var(--body);
          font-size: 0.75rem;
          border: none;
          background: var(--pine);
          color: white;
          padding: 0.35rem;
          cursor: pointer;
        }
        .editor-upload-btn {
          display: inline-block;
          width: fit-content;
          background: var(--mist);
          border: 1px dashed var(--line);
          border-radius: 8px;
          padding: 0.7rem 1.2rem;
          font-family: var(--body);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .editor-toggle {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--body);
          font-size: 0.95rem;
        }
        .editor-parse-btn {
          width: fit-content;
          background: var(--ocean);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-family: var(--body);
          font-size: 0.85rem;
          cursor: pointer;
        }
        .editor-aeo-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .editor-aeo-label {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--grey);
        }
        .editor-aeo-pair {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 0.75rem;
        }
        .editor-aeo-pair input,
        .editor-aeo-pair textarea {
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 0.5rem;
          font-family: var(--body);
          font-size: 0.9rem;
        }
        .editor-aeo-pair button {
          width: fit-content;
          background: none;
          border: none;
          color: #b3261e;
          font-family: var(--body);
          font-size: 0.8rem;
          cursor: pointer;
        }
        .editor-actions {
          position: sticky;
          bottom: 0;
          display: flex;
          justify-content: flex-end;
          gap: 0.9rem;
          background: var(--mist);
          padding: 1rem 0;
        }
        .editor-btn-reject {
          background: none;
          border: 1px solid #b3261e;
          color: #b3261e;
          border-radius: 8px;
          padding: 0.7rem 1.4rem;
          font-family: var(--body);
          font-weight: 700;
          cursor: pointer;
        }
        .editor-btn-draft {
          background: none;
          border: 1px solid var(--line);
          color: var(--ink);
          border-radius: 8px;
          padding: 0.7rem 1.4rem;
          font-family: var(--body);
          font-weight: 700;
          cursor: pointer;
        }
        .editor-btn-publish {
          border: none;
          border-radius: 8px;
          padding: 0.7rem 1.4rem;
          font-family: var(--body);
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .editor {
            padding: 1.5rem 5vw 6rem;
            gap: 1.75rem;
          }
          .editor-section {
            padding: 1.25rem;
          }
          .editor-section-title {
            font-size: 1.15rem;
          }
          .editor-type-fixed {
            width: 100%;
          }
          .editor-grid {
            grid-template-columns: 1fr;
          }
          .editor-photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          }
          .editor-photo-thumb img {
            height: 80px;
          }
          .editor-actions {
            flex-direction: column-reverse;
            gap: 0.6rem;
            padding: 0.9rem 5vw;
            margin: 0 -5vw;
          }
          .editor-btn-reject,
          .editor-btn-draft,
          .editor-btn-publish {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}