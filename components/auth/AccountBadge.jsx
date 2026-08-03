'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'

export default function AccountBadge({ solid, onLoginClick }) {
  const { user, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (loading) return null

  if (!user) {
    return (
      <>
        <button className={`login-link${solid ? ' solid' : ''}`} onClick={onLoginClick}>
          Sign in
        </button>
        <style jsx>{`
          .login-link {
            background: none;
            border: none;
            cursor: pointer;
            font-family: var(--body);
            font-size: 0.9rem;
            font-weight: 500;
            color: #fff;
            opacity: 0.9;
            min-height: 48px;
            padding: 0 0.4rem;
            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
          }
          .login-link.solid {
            color: var(--pine);
            text-shadow: none;
            opacity: 1;
          }
          .login-link:hover {
            color: var(--sun);
          }
          .login-link.solid:hover {
            color: var(--ocean);
          }
        `}</style>
      </>
    )
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0]
  const avatarUrl = user.user_metadata?.avatar_url
  const initial = (user.user_metadata?.display_name || user.email || '?')
    .charAt(0)
    .toUpperCase()

  return (
    <div className="badge" ref={ref}>
      <button className={`trigger${solid ? ' solid' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
        </span>
        <span className="name">{displayName}</span>
        <span className={`caret${open ? ' up' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="menu">
          <button
            onClick={() => {
              setOpen(false)
              signOut()
            }}
          >
            Log out
          </button>
        </div>
      )}

      <style jsx>{`
        .badge {
          position: relative;
        }
        .trigger {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: none;
          border: none;
          cursor: pointer;
          min-height: 48px;
          padding: 0 0.3rem;
          font-family: var(--body);
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 100px;
          background: var(--sun);
          color: var(--pine);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          overflow: hidden;
          flex-shrink: 0;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
        }
        .trigger.solid .name {
          color: var(--pine);
          text-shadow: none;
        }
        .caret {
          font-size: 0.7rem;
          color: #fff;
          transition: 0.2s;
        }
        .trigger.solid .caret {
          color: var(--pine);
        }
        .caret.up {
          transform: rotate(180deg);
        }
        .menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--cloud);
          border-radius: 12px;
          box-shadow: var(--shadow);
          min-width: 140px;
          padding: 0.4rem;
          z-index: 100;
        }
        .menu button {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--body);
          font-size: 0.9rem;
          color: var(--ink);
        }
        .menu button:hover {
          background: var(--mist);
        }
      `}</style>
    </div>
  )
}
