// components/admin/AuthorsTable.jsx
// AD8 — Tabs + table + tier control + revoke flow, all in one
// component (the tree only has AuthorsTable.jsx, not a separate
// header file like Submissions has SubmissionsHeader — kept to the
// existing file structure rather than inventing a new file).
//
// verified_tier is edited via a native <select> — simplest control
// that skips ConfirmDialog (tier changes are non-destructive,
// low-stakes, same logic as why comment hide/unhide skips
// ConfirmDialog). Revoke IS destructive, so it goes through
// ConfirmDialog per the Part-AD6 rule.

'use client';

import { useState, useTransition } from 'react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import VerifiedBadge from '@/components/story-extras/VerifiedBadge';
import { updateVerifiedTierAction, revokeClaimAction } from '@/app/admin/(protected)/authors/actions';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'claimed', label: 'Claimed' },
  { key: 'verified', label: 'Verified' },
  { key: 'top_storyteller', label: 'Top Storyteller' },
];

const TIER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'verified', label: 'Verified' },
  { value: 'top_storyteller', label: 'Top Storyteller' },
];

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AuthorsTable({ profiles, storyCounts, activeFilter, counts, error }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null); // profile object or null

  function handleTierChange(profileId, tier) {
    setActionError(null);
    setPendingId(profileId);
    startTransition(async () => {
      const result = await updateVerifiedTierAction(profileId, tier);
      if (result?.error) setActionError(result.error);
      setPendingId(null);
    });
  }

  function handleRevokeConfirm() {
    if (!revokeTarget) return;
    const profileId = revokeTarget.id;
    setActionError(null);
    setPendingId(profileId);
    setRevokeTarget(null);
    startTransition(async () => {
      const result = await revokeClaimAction(profileId);
      if (result?.error) setActionError(result.error);
      setPendingId(null);
    });
  }

  return (
    <div className="authors-page">
      <h1 className="authors-title">Authors</h1>

      <div className="authors-tabs">
        {TABS.map((tab) => (
          
            <a key={tab.key}
            href={`/admin/authors?filter=${tab.key}`}
            className={`authors-tab${activeFilter === tab.key ? ' active' : ''}`}
          >
            {tab.label}
            <span className="authors-tab-count">{counts[tab.key]}</span>
          </a>
        ))}
      </div>

      {error && (
        <p className="authors-error">Couldn&apos;t load authors right now. Try refreshing.</p>
      )}
      {actionError && <p className="authors-error">{actionError}</p>}

      {!error && profiles.length === 0 && (
        <div className="authors-empty">
          <p>
            {activeFilter === 'all'
              ? 'No profiles yet.'
              : `No profiles match "${TABS.find((t) => t.key === activeFilter)?.label}" right now.`}
          </p>
        </div>
      )}

      {!error && profiles.length > 0 && (
        <div className="authors-table-wrap">
          <table className="authors-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Stories</th>
                <th>Claimed</th>
                <th>Verified Tier</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const rowBusy = isPending && pendingId === profile.id;
                return (
                  <tr key={profile.id}>
                    <td>
                      <div className="authors-row-author">
                        <span className="authors-row-name">
                          {profile.display_name || 'Unnamed'}
                          <VerifiedBadge tier={profile.verified_tier} />
                        </span>
                        <span className="authors-row-email">{profile.email}</span>
                      </div>
                    </td>
                    <td>{storyCounts[profile.id] ?? 0}</td>
                    <td>
                      <span className={`claimed-badge${profile.is_claimed_author ? ' yes' : ''}`}>
                        {profile.is_claimed_author ? 'Claimed' : 'Unclaimed'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={profile.verified_tier}
                        disabled={rowBusy}
                        onChange={(e) => handleTierChange(profile.id, e.target.value)}
                        className="authors-tier-select"
                      >
                        {TIER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDate(profile.created_at)}</td>
                    <td>
                      {profile.is_claimed_author && (
                        <button
                          type="button"
                          className="authors-revoke-btn"
                          disabled={rowBusy}
                          onClick={() => setRevokeTarget(profile)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke claimed status?"
        message={
          revokeTarget
            ? `This clears "${revokeTarget.display_name || revokeTarget.email}"'s claimed-author status. Their verified tier and already-published stories are not affected.`
            : ''
        }
        confirmLabel="Revoke"
        destructive
        onConfirm={handleRevokeConfirm}
        onCancel={() => setRevokeTarget(null)}
      />

      <style jsx>{`
        .authors-page {
          padding: 2.5rem 6vw;
        }
        .authors-title {
          font-family: var(--display);
          font-size: 2rem;
          color: var(--pine);
          margin: 0 0 1.5rem;
        }
        .authors-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--line);
          flex-wrap: wrap;
        }
        .authors-tab {
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
        .authors-tab:hover {
          color: var(--ocean);
        }
        .authors-tab.active {
          color: var(--pine);
          border-bottom-color: var(--sun);
        }
        .authors-tab-count {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--mist);
          color: var(--ink);
          border-radius: 100px;
          padding: 0.1rem 0.5rem;
          min-width: 1.4rem;
          text-align: center;
        }
        .authors-tab.active .authors-tab-count {
          background: var(--sun);
          color: var(--pine);
        }
        .authors-error {
          font-family: var(--body);
          color: #b3261e;
          margin-bottom: 1rem;
        }
        .authors-empty {
          font-family: var(--body);
          color: var(--grey);
          text-align: center;
          padding: 3rem 1rem;
          background: var(--cloud);
          border-radius: 12px;
          border: 1px solid var(--line);
        }
        .authors-table-wrap {
          background: var(--cloud);
          border-radius: 12px;
          border: 1px solid var(--line);
          overflow: hidden;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .authors-table {
          width: 100%;
          border-collapse: collapse;
        }
        .authors-table th {
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
          white-space: nowrap;
        }
        .authors-table td {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--line);
          font-family: var(--body);
          font-size: 0.9rem;
          color: var(--ink);
          vertical-align: middle;
          white-space: nowrap;
        }
        .authors-table tr:last-child td {
          border-bottom: none;
        }
        .authors-table tr:hover td {
          background: var(--mist);
        }
        .authors-row-author {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .authors-row-name {
          color: var(--pine);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
        }
        .authors-row-email {
          color: var(--grey);
          font-size: 0.8rem;
        }
        .claimed-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.7rem;
          border-radius: 100px;
          background: var(--mist);
          color: var(--grey);
        }
        .claimed-badge.yes {
          background: #e2f3e6;
          color: #1e7a37;
        }
        .authors-tier-select {
          font-family: var(--body);
          font-size: 0.85rem;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          background: var(--cloud);
          color: var(--ink);
        }
        .authors-tier-select:disabled {
          opacity: 0.6;
        }
        .authors-revoke-btn {
          font-family: var(--body);
          font-size: 0.8rem;
          font-weight: 600;
          color: #b3261e;
          background: none;
          border: 1px solid #b3261e;
          border-radius: 100px;
          padding: 0.35rem 0.9rem;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .authors-revoke-btn:hover:not(:disabled) {
          background: #fbe6e4;
        }
        .authors-revoke-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .authors-page {
            padding: 1.75rem 5vw;
          }
          .authors-title {
            font-size: 1.6rem;
            margin-bottom: 1.25rem;
          }
          .authors-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 2px;
          }
          .authors-tab {
            flex-shrink: 0;
            padding: 0.55rem 0.8rem;
            font-size: 0.85rem;
          }
          .authors-table th,
          .authors-table td {
            padding: 0.75rem 0.9rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}