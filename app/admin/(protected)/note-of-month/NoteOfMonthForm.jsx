'use client';

import { useState } from 'react';
import { setNoteOfMonthAction } from './actions';

export default function NoteOfMonthForm({ notes }) {
  const [storyId, setStoryId] = useState('');
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(false);

  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!storyId) return;
    setPending(true);
    setStatus(null);

    const result = await setNoteOfMonthAction({ storyId, month, year });

    setPending(false);
    setStatus(result.ok ? 'Saved.' : result.error || 'Something went wrong.');
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        Pick a locals&apos; note for {month}/{year}
      </label>
      <select
        value={storyId}
        onChange={(e) => setStoryId(e.target.value)}
        style={{ width: '100%', minHeight: 52, borderRadius: 10, marginBottom: '1rem' }}
      >
        <option value="">— Select a published locals&apos; note —</option>
        {notes.map((n) => (
          <option key={n.id} value={n.id}>{n.title}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={pending || !storyId}
        style={{
          minHeight: 52,
          padding: '0 2rem',
          borderRadius: 100,
          background: 'var(--sun)',
          color: 'var(--pine)',
          fontWeight: 700,
          border: 'none',
          cursor: pending ? 'wait' : 'pointer',
        }}
      >
        {pending ? 'Saving…' : 'Set as Note of the Month'}
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </form>
  );
}