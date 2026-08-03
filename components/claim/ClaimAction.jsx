'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import LoginModal from '@/components/auth/LoginModal'
import { claimStoryAction } from '@/lib/actions/claims'

export default function ClaimAction(props) {
  const token = props.token
  const auth = useAuth()
  const user = auth.user
  const loading = auth.loading

  const [loginOpen, setLoginOpen] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [result, setResult] = useState(null)

  async function handleClaim() {
    if (!user) {
      setLoginOpen(true)
      return
    }
    setClaiming(true)
    const res = await claimStoryAction(token)
    setClaiming(false)
    setResult(res)
  }

  if (loading) {
    return null
  }

  if (result && result.ok) {
    return (
      <div>
        <p className="claim-success">Story claimed! It&rsquo;s now linked to your account.</p>
        <a href={'/stories/' + result.slug} className="claim-btn">
          View your story
        </a>
        <style jsx>{`
          .claim-success {
            color: var(--pine);
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .claim-btn {
            display: inline-block;
            min-height: 48px;
            line-height: 48px;
            padding: 0 1.6rem;
            border-radius: 100px;
            background: var(--sun);
            color: var(--pine);
            font-weight: 600;
            text-decoration: none;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      {result && result.error ? <p className="claim-error">{result.error}</p> : null}

      <button className="claim-btn" onClick={handleClaim} disabled={claiming}>
        {claiming ? 'Claiming...' : user ? 'Claim this story' : 'Sign in to claim'}
      </button>

      <LoginModal open={loginOpen} onClose={function () { setLoginOpen(false) }} />

      <style jsx>{`
        .claim-error {
          color: #b3391f;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .claim-btn {
          min-height: 48px;
          padding: 0 1.6rem;
          border-radius: 100px;
          background: var(--sun);
          color: var(--pine);
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .claim-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </div>
  )
}