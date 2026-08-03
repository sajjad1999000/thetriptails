// components/admin/CommentsHeader.jsx
// AD9 — Tabs + page shell for comment moderation. Same pattern as
// SubmissionsHeader.jsx (tab links carry ?status=, active tab styled).
'use client';
import Link from 'next/link';
const TABS = [
  { key: 'reported', label: 'Reported' },
  { key: 'hidden', label: 'Hidden' },
  { key: 'all', label: 'All' },
];
export default function CommentsHeader({ activeStatus, counts, error, children }) {
  return (
    <div className="comments-page">
      <h1>Comments</h1>
      {error && (
        <p className="load-error">Couldn&rsquo;t load comments — try refreshing.</p>
      )}
      <div className="tabs">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/comments?status=${t.key}`}
            className={`tab${activeStatus === t.key ? ' active' : ''}`}
          >
            {t.label} <span className="count">{counts[t.key] ?? 0}</span>
          </Link>
        ))}
      </div>
      {children}
      <style jsx>{`
        .comments-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 6vw;
        }
        h1 {
          font-family: var(--display);
          color: var(--pine);
          margin-bottom: 1.2rem;
        }
        .load-error {
          background: #fbe6e4;
          color: #b3261e;
          font-family: var(--body);
          font-size: 0.88rem;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .tabs {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .tab {
          font-family: var(--body);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--grey);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          background: var(--mist);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .tab:hover {
          background: var(--line);
        }
        .tab.active {
          background: var(--pine);
          color: var(--cloud);
        }
        .count {
          opacity: 0.7;
          margin-left: 0.2rem;
        }

        @media (max-width: 640px) {
          .comments-page {
            padding: 1.75rem 5vw;
          }
          h1 {
            font-size: 1.6rem;
            margin-bottom: 1rem;
          }
          .tabs {
            gap: 0.5rem;
          }
          .tab {
            font-size: 0.82rem;
            padding: 0.45rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}