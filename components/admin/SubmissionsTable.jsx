// components/admin/SubmissionsTable.jsx
// AD5 — Renders the actual submissions table.
//
// Kept as a client component (not strictly required for a static
// table, but this is where AD6 will likely add row-level actions
// like quick-approve later, so it's set up to take interactivity
// without a rewrite).
//
// Row click -> /admin/submissions/[id]. That page is AD6 and
// doesn't exist yet, so this will 404 until it's built.
//
// Mobile (<640px): table rows collapse into stacked cards via CSS
// only — no markup restructuring. Each <td> gets a data-label
// attribute; a ::before pseudo-element in the mobile media query
// renders it as a small caption above the cell's value.

'use client';

import Link from 'next/link';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status-pending' },
  approved: { label: 'Approved', className: 'status-approved' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
};

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SubmissionsTable({ submissions, activeStatus }) {
  if (submissions.length === 0) {
    return (
      <div className="submissions-empty">
        <p>
          {activeStatus === 'all'
            ? 'No submissions yet.'
            : `No ${activeStatus} submissions right now.`}
        </p>

        <style jsx>{`
          .submissions-empty {
            font-family: var(--body);
            color: var(--grey);
            text-align: center;
            padding: 3rem 1rem;
            background: var(--cloud);
            border-radius: 12px;
            border: 1px solid var(--line);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="submissions-table-wrap">
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Title / Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const statusInfo = STATUS_STYLES[submission.status] ?? {
              label: submission.status,
              className: '',
            };

            return (
              <tr key={submission.id}>
                <td data-label="Title / Name">
                  <Link href={`/admin/submissions/${submission.id}`} className="submissions-row-link">
                    <span className="submissions-row-title">
                      {submission.title || 'Untitled'}
                    </span>
                    <span className="submissions-row-name">by {submission.name}</span>
                  </Link>
                </td>
                <td data-label="Location">
                  {submission.location}
                  {submission.country ? `, ${submission.country}` : ''}
                </td>
                <td data-label="Status">
                  <span className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </td>
                <td data-label="Submitted">{formatDate(submission.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style jsx>{`
        .submissions-table-wrap {
          background: var(--cloud);
          border-radius: 12px;
          border: 1px solid var(--line);
          overflow: hidden;
        }
        .submissions-table {
          width: 100%;
          border-collapse: collapse;
        }
        .submissions-table th {
          text-align: left;
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--grey);
          padding: 0.9rem 1.2rem;
          border-bottom: 1px solid var(--line);
          background: var(--mist);
        }
        .submissions-table td {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--line);
          font-family: var(--body);
          font-size: 0.9rem;
          color: var(--ink);
          vertical-align: middle;
        }
        .submissions-table tr:last-child td {
          border-bottom: none;
        }
        .submissions-table tr:hover td {
          background: var(--mist);
        }
        .submissions-row-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          gap: 0.15rem;
        }
        .submissions-row-title {
          color: var(--pine);
          font-weight: 700;
        }
        .submissions-row-name {
          color: var(--grey);
          font-size: 0.8rem;
        }
        .status-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.7rem;
          border-radius: 100px;
        }
        .status-pending {
          background: #fff4dc;
          color: #a6650a;
        }
        .status-approved {
          background: #e2f3e6;
          color: #1e7a37;
        }
        .status-rejected {
          background: #fbe6e4;
          color: #b3261e;
        }

        @media (max-width: 640px) {
          .submissions-table-wrap {
            border: none;
            background: transparent;
            overflow: visible;
          }
          .submissions-table thead {
            display: none;
          }
          .submissions-table,
          .submissions-table tbody,
          .submissions-table tr,
          .submissions-table td {
            display: block;
            width: 100%;
          }
          .submissions-table tr {
            background: var(--cloud);
            border: 1px solid var(--line);
            border-radius: 12px;
            margin-bottom: 0.9rem;
            padding: 0.9rem 1.1rem;
          }
          .submissions-table tr:hover td {
            background: transparent;
          }
          .submissions-table td {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--mist);
          }
          .submissions-table td:last-child {
            border-bottom: none;
          }
          .submissions-table td::before {
            content: attr(data-label);
            display: block;
            font-family: var(--body);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--grey);
            margin-bottom: 0.25rem;
          }
          .submissions-row-link {
            gap: 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}