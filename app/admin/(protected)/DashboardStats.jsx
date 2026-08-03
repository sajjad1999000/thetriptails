'use client';
// app/admin/(protected)/DashboardStats.jsx
// Client-side UI for the admin dashboard. Receives already-fetched
// counts as props from the server component (page.jsx) — this file
// itself does no data fetching, it just renders.

import Link from 'next/link';

export default function DashboardStats({ pendingCount, todayCount, publishedCount }) {
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Dashboard</h1>

      <div className="admin-stat-grid">
        <Link href="/admin/submissions?status=pending" className="admin-stat-card">
          <span className="admin-stat-number">{pendingCount ?? 0}</span>
          <span className="admin-stat-label">Pending Review</span>
        </Link>

        <div className="admin-stat-card">
          <span className="admin-stat-number">{todayCount ?? 0}</span>
          <span className="admin-stat-label">Submitted Today</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-number">{publishedCount ?? 0}</span>
          <span className="admin-stat-label">Published Stories</span>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="admin-dashboard-cta">
          <p>
            You have <strong>{pendingCount}</strong>{' '}
            {pendingCount === 1 ? 'submission' : 'submissions'} waiting for review.
          </p>
          <Link href="/admin/submissions?status=pending" className="btn-sun">
            Review Now
          </Link>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          max-width: 1150px;
          margin: 0 auto;
          padding: 3rem 6vw;
        }
        .admin-dashboard-title {
          font-family: var(--display);
          font-size: 2rem;
          color: var(--pine);
          margin: 0 0 2rem;
        }
        .admin-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .admin-stat-card {
          background: var(--cloud);
          border-radius: 14px;
          box-shadow: var(--shadow);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        a.admin-stat-card:hover {
          transform: translateY(-4px);
        }
        .admin-stat-number {
          font-family: var(--display);
          font-size: 2.5rem;
          color: var(--pine);
        }
        .admin-stat-label {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--grey);
        }
        .admin-dashboard-cta {
          background: var(--pine);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-dashboard-cta p {
          font-family: var(--body);
          color: var(--cloud);
          margin: 0;
          font-size: 1.05rem;
        }

        @media (max-width: 640px) {
          .admin-dashboard {
            padding: 1.75rem 5vw 3rem;
          }
          .admin-dashboard-title {
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
          }
          .admin-stat-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 1.75rem;
          }
          .admin-stat-card {
            padding: 1.4rem;
          }
          .admin-stat-number {
            font-size: 2rem;
          }
          .admin-dashboard-cta {
            flex-direction: column;
            align-items: stretch;
            padding: 1.5rem;
            text-align: center;
          }
          .admin-dashboard-cta p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}