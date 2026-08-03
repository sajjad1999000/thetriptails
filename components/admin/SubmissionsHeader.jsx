'use client';

import Link from 'next/link';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export default function SubmissionsHeader({
  activeStatus,
  counts,
  error,
  children,
}) {
  return (
    <div className="submissions-page">
      <h1 className="submissions-title">Submissions</h1>

      <div className="submissions-tabs">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/submissions?status=${tab.key}`}
            className={`submissions-tab${
              activeStatus === tab.key ? ' active' : ''
            }`}
          >
            {tab.label}
            <span className="submissions-tab-count">
              {counts?.[tab.key] ?? 0}
            </span>
          </Link>
        ))}
      </div>

      {error && (
        <p className="submissions-error">
          Couldn&apos;t load submissions right now. Try refreshing.
        </p>
      )}

      {!error && children}

      <style jsx>{`
        .submissions-page {
          padding: 2.5rem 6vw;
        }

        .submissions-title {
          font-family: var(--display);
          font-size: 2rem;
          color: var(--pine);
          margin: 0 0 1.5rem;
        }

        .submissions-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--line);
        }

        .submissions-tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--body);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--grey);
          text-decoration: none;
          padding: 0.6rem 1rem;
          border-bottom: 2px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .submissions-tab:hover {
          color: var(--ocean);
        }

        .submissions-tab.active {
          color: var(--pine);
          border-bottom-color: var(--sun);
        }

        .submissions-tab-count {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--mist);
          color: var(--ink);
          border-radius: 100px;
          padding: 0.1rem 0.5rem;
          min-width: 1.4rem;
          text-align: center;
        }

        .submissions-tab.active .submissions-tab-count {
          background: var(--sun);
          color: var(--pine);
        }

        .submissions-error {
          font-family: var(--body);
          color: #b3261e;
        }

        @media (max-width: 640px) {
          .submissions-page {
            padding: 1.75rem 5vw;
          }

          .submissions-title {
            font-size: 1.6rem;
            margin-bottom: 1.25rem;
          }

          .submissions-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 2px;
          }

          .submissions-tab {
            flex-shrink: 0;
            padding: 0.55rem 0.8rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}