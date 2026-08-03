'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ensureProfile, setDisplayName } from '@/lib/actions/profile'

// Uses a typed OTP code instead of a clickable magic link — same
// reasoning as the admin login (see app/admin/login/page.jsx): some
// email providers/antivirus tools prefetch links to scan them,
// which silently burns a single-use magic link before the person
// ever clicks it. A typed code has nothing for a prefetcher to
// "click," so it's immune to that failure mode.
//
// After verification, ensureProfile() auto-heals the profiles row
// (creates it if missing) and reports whether a display name still
// needs collecting. Returning users with a name already set skip
// straight past the name step — only new/incomplete profiles see it.
export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState('email') // 'email' | 'code' | 'name'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()

  if (!open) return null

  async function handleSendCode(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }

    setStatus('idle')
    setStep('code')
  }

  async function handleVerifyCode(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }

    const result = await ensureProfile()

    if (result.needsName) {
      setStatus('idle')
      setStep('name')
      return
    }

    finishAndReload()
  }

  async function handleSetName(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const result = await setDisplayName(name)

    if (!result.ok) {
      setStatus('error')
      setErrorMsg(result.error)
      return
    }

    finishAndReload()
  }

  function finishAndReload() {
    handleClose()
    // Refresh so the header/comment forms pick up the new session
    // and name immediately.
    window.location.reload()
  }

  function handleClose() {
    setStep('email')
    setEmail('')
    setCode('')
    setName('')
    setStatus('idle')
    setErrorMsg('')
    onClose()
  }

  return (
    <div className="overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" aria-label="Close" onClick={handleClose}>
          ×
        </button>

        {step === 'email' && (
          <form onSubmit={handleSendCode}>
            <p className="kicker">— Sign in</p>
            <h3>Welcome back, traveller</h3>
            <p className="sub">We&rsquo;ll email you a code — no password needed.</p>

            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'sending'}
              />
            </label>

            {status === 'error' && (
              <p className="err">{errorMsg || 'Something went wrong — try again.'}</p>
            )}

            <button type="submit" className="btn-sun" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send code'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode}>
            <p className="kicker">— Check your inbox</p>
            <h3>Enter your code</h3>
            <p className="sub">
              We sent an 8-digit code to <strong>{email}</strong>.
            </p>

            <label className="field">
              <span>Code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="12345678"
                className="code-input"
                disabled={status === 'sending'}
              />
            </label>

            {status === 'error' && (
              <p className="err">{errorMsg || 'Invalid or expired code — try again.'}</p>
            )}

            <button
              type="submit"
              className="btn-sun"
              disabled={status === 'sending' || code.length !== 8}
            >
              {status === 'sending' ? 'Verifying…' : 'Verify & sign in'}
            </button>

            <button
              type="button"
              className="back"
              onClick={() => {
                setStep('email')
                setCode('')
                setStatus('idle')
                setErrorMsg('')
              }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        {step === 'name' && (
          <form onSubmit={handleSetName}>
            <p className="kicker">— One more thing</p>
            <h3>What should we call you?</h3>
            <p className="sub">
              This is the name that&rsquo;ll show on any comments you leave.
            </p>

            <label className="field">
              <span>Your name</span>
              <input
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sana K."
                disabled={status === 'sending'}
                autoFocus
              />
            </label>

            {status === 'error' && (
              <p className="err">{errorMsg || 'Something went wrong — try again.'}</p>
            )}

            <button type="submit" className="btn-sun" disabled={status === 'sending'}>
              {status === 'sending' ? 'Saving…' : 'Continue'}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(23, 59, 46, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5vw;
        }
        .modal {
          position: relative;
          background: var(--cloud);
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 2.4rem 2rem;
          max-width: 420px;
          width: 100%;
        }
        .close {
          position: absolute;
          top: 0.9rem;
          right: 0.9rem;
          width: 40px;
          height: 40px;
          border: none;
          background: none;
          font-size: 1.6rem;
          color: var(--grey);
          cursor: pointer;
          line-height: 1;
          border-radius: 100px;
        }
        .close:hover {
          background: var(--mist);
          color: var(--ink);
        }
        .kicker {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ocean);
          margin: 0 0 0.6rem;
        }
        h3 {
          font-family: var(--display);
          color: var(--pine);
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        .sub {
          color: var(--grey);
          font-size: 0.95rem;
          margin: 0 0 1.4rem;
          line-height: 1.5;
        }
        .field {
          display: block;
          margin-bottom: 1.2rem;
        }
        .field span {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--grey);
          margin-bottom: 0.4rem;
        }
        .field input {
          width: 100%;
          min-height: 52px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--mist);
          padding: 0 1rem;
          font-family: var(--body);
          font-size: 1rem;
          color: var(--ink);
          transition: 0.2s;
        }
        .field input:focus {
          outline: none;
          border-color: var(--ocean);
          background: var(--cloud);
        }
        .code-input {
          font-size: 1.4rem;
          letter-spacing: 0.4em;
          text-align: center;
        }
        .err {
          color: #b3391f;
          font-size: 0.88rem;
          margin: -0.5rem 0 1rem;
        }
        :global(.btn-sun) {
          width: 100%;
          min-height: 52px;
          border-radius: 100px;
          background: var(--sun);
          color: var(--pine);
          border: none;
          font-family: var(--body);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.25s;
        }
        :global(.btn-sun:hover) {
          background: var(--sun-deep);
        }
        :global(.btn-sun:disabled) {
          opacity: 0.6;
          cursor: default;
        }
        .back {
          display: block;
          width: 100%;
          text-align: center;
          background: none;
          border: none;
          color: var(--ocean);
          font-family: var(--body);
          font-size: 0.85rem;
          cursor: pointer;
          margin-top: 0.8rem;
          padding: 0.4rem 0;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}