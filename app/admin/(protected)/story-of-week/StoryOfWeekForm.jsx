'use client';

import { useState } from 'react';
import { setStoryOfWeekAction } from './actions';

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

export default function StoryOfWeekForm({ stories }) {
  const [storyId, setStoryId] = useState('');
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(false);

  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const weekStart = toISODate(monday);
  const weekEnd = toISODate(sunday);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!storyId) return;
    setPending(true);
    setStatus(null);

    const result = await setStoryOfWeekAction({ storyId, weekStart, weekEnd });

    setPending(false);
    setStatus(result.ok ? 'Saved.' : result.error || 'Something went wrong.');
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        Pick a story for the week of {weekStart} → {weekEnd}
      </label>
      <select
        value={storyId}
        onChange={(e) => setStoryId(e.target.value)}
        style={{ width: '100%', minHeight: 52, borderRadius: 10, marginBottom: '1rem' }}
      >
        <option value="">— Select a published story —</option>
        {stories.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
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
        {pending ? 'Saving…' : 'Set as Story of the Week'}
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </form>
  );
}