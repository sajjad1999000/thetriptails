'use client'

// components/story-extras/VerifiedBadge.jsx
//
// Small inline badge shown next to an author's name wherever a
// verified_tier is meaningful (byline, comments, author page).
// Renders nothing for 'none' — pass profile.verified_tier as `tier`.

export default function VerifiedBadge({ tier }) {
  if (!tier || tier === 'none') return null

  const config = {
    verified: { label: 'Verified', bg: 'var(--mist)', color: 'var(--ocean)' },
    top_storyteller: { label: 'Top Storyteller', bg: 'var(--sun)', color: 'var(--pine)' },
  }[tier]

  if (!config) return null

  return (
    <span className="verified-badge">
      {config.label}
      <style jsx>{`
        .verified-badge {
          display: inline-flex;
          align-items: center;
          margin-left: 0.5rem;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          background: ${config.bg};
          color: ${config.color};
        }
      `}</style>
    </span>
  )
}
