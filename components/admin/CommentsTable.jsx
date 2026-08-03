// components/admin/CommentsTable.jsx
// AD9 — Renders comment rows with report chips + hide/unhide toggle.
// Hide/unhide stays instant (no ConfirmDialog) per the build plan —
// lower stakes, needs fast moderation, unlike Reject/Revoke/Delete.

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  adminHideCommentAction,
  adminUnhideCommentAction,
  dismissReportAction,
} from '@/lib/actions/moderation';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CommentsTable({ comments }) {
  const [rows, setRows] = useState(comments);
  const [isPending, startTransition] = useTransition();

  function toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'hidden' ? 'visible' : 'hidden';

    // optimistic update — instant per spec, no confirm dialog
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );

    startTransition(async () => {
      const action =
        currentStatus === 'hidden' ? adminUnhideCommentAction : adminHideCommentAction;
      const res = await action(id);

      if (res?.error) {
        // revert on failure
        setRows((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c))
        );
      }
    });
  }

  function dismissReport(reportId, commentId) {
    setRows((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, reports: c.reports.filter((rep) => rep.id !== reportId) }
          : c
      )
    );

    startTransition(() => {
      dismissReportAction(reportId);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="comments-empty">
        <p>Nothing here.</p>
        <style jsx>{`
          .comments-empty {
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
    <div className="comments-list">
      {rows.map((c) => (
        <div key={c.id} className="comment-row">
          <div className="main">
            <div className="meta">
              <span className="name">{c.profiles?.display_name || 'Traveller'}</span>
              {c.stories?.slug && (
                <Link
                  href={`/stories/${c.stories.slug}`}
                  target="_blank"
                  className="story-link"
                >
                  on &ldquo;{c.stories.title}&rdquo;
                </Link>
              )}
              <span className="date">{formatDate(c.created_at)}</span>
              <span className={`status-badge status-${c.status}`}>{c.status}</span>
            </div>

            <p className="content">{c.content}</p>

            {c.reports.length > 0 && (
              <div className="reports">
                {c.reports.map((rep) => (
                  <span key={rep.id} className="report-chip">
                    {rep.reason}
                    <button
                      type="button"
                      onClick={() => dismissReport(rep.id, c.id)}
                      disabled={isPending}
                    >
                      dismiss
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={c.status === 'hidden' ? 'unhide-btn' : 'hide-btn'}
            onClick={() => toggleStatus(c.id, c.status)}
            disabled={isPending}
          >
            {c.status === 'hidden' ? 'Unhide' : 'Hide'}
          </button>

          <style jsx>{`
            .comment-row {
              display: flex;
              gap: 1rem;
              align-items: flex-start;
              padding: 1.2rem;
              background: var(--cloud);
              border: 1px solid var(--line);
              border-radius: 12px;
              margin-bottom: 0.8rem;
            }
            .main {
              flex: 1;
              min-width: 0;
            }
            .meta {
              display: flex;
              align-items: center;
              gap: 0.6rem;
              margin-bottom: 0.4rem;
              font-size: 0.85rem;
              flex-wrap: wrap;
            }
            .name {
              font-family: var(--body);
              font-weight: 700;
              color: var(--pine);
            }
            .story-link {
              color: var(--ocean);
              font-size: 0.82rem;
              text-decoration: none;
            }
            .story-link:hover {
              text-decoration: underline;
            }
            .date {
              color: var(--grey);
              font-size: 0.8rem;
            }
            .status-badge {
              margin-left: auto;
              text-transform: uppercase;
              font-size: 0.68rem;
              font-weight: 700;
              padding: 0.15rem 0.5rem;
              border-radius: 100px;
              background: var(--mist);
              color: var(--grey);
            }
            .status-hidden {
              background: #fbe6e4;
              color: #b3261e;
            }
            .status-visible {
              background: #e2f3e6;
              color: #1e7a37;
            }
            .content {
              font-family: var(--body);
              color: var(--ink);
              font-size: 0.92rem;
              line-height: 1.5;
              margin: 0 0 0.5rem;
            }
            .reports {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .report-chip {
              font-family: var(--body);
              font-size: 0.75rem;
              background: #fff4dc;
              color: #a6650a;
              padding: 0.2rem 0.6rem;
              border-radius: 100px;
              display: flex;
              align-items: center;
              gap: 0.4rem;
            }
            .report-chip button {
              background: none;
              border: none;
              color: inherit;
              text-decoration: underline;
              cursor: pointer;
              font-size: 0.72rem;
              padding: 0;
              font-family: var(--body);
            }
            .report-chip button:disabled {
              opacity: 0.6;
              cursor: default;
            }
            .hide-btn,
            .unhide-btn {
              flex-shrink: 0;
              border: none;
              border-radius: 100px;
              padding: 0.5rem 1rem;
              font-family: var(--body);
              font-size: 0.85rem;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s ease;
            }
            .hide-btn {
              background: #fbe6e4;
              color: #b3261e;
            }
            .unhide-btn {
              background: #e2f3e6;
              color: #1e7a37;
            }
            .hide-btn:disabled,
            .unhide-btn:disabled {
              opacity: 0.6;
              cursor: default;
            }

            @media (max-width: 640px) {
              .comment-row {
                flex-direction: column;
                align-items: stretch;
                padding: 1rem;
              }
              .meta {
                gap: 0.4rem;
              }
              .status-badge {
                margin-left: 0;
              }
              .hide-btn,
              .unhide-btn {
                align-self: flex-start;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}