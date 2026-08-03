// app/admin/login/page.jsx
// Sits OUTSIDE the (protected) route group — this page is never gated.
//
// Uses an 8-digit OTP CODE instead of a clickable magic link.
// Why: Gmail (and some other providers/antivirus tools) prefetch
// links in emails to scan them for safety, which silently consumes
// a single-use magic link before the person ever clicks it. A typed
// code has nothing for a prefetcher to "click," so it's immune to
// that failure mode.
//
// Flow: enter email -> Supabase sends an 8-digit code -> enter code
// here -> verified -> redirected into /admin.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleSendCode(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // only existing users (you) can log in
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('idle');
    setStep('code');
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <p className="admin-login-kicker">— The Trip Tales</p>
        <h1 className="admin-login-title">Admin Sign In</h1>

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="admin-login-form">
            <label htmlFor="email" className="admin-login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="admin-login-input"
              disabled={status === 'sending'}
            />

            {status === 'error' && (
              <p className="admin-login-error">
                {errorMsg || 'Something went wrong. Try again.'}
              </p>
            )}

            <button
              type="submit"
              className="btn-sun admin-login-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending code…' : 'Send Code'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="admin-login-form">
            <p className="admin-login-message">
              We sent an 8-digit code to <strong>{email}</strong>. Enter it below.
            </p>

            <label htmlFor="code" className="admin-login-label">
              Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              className="admin-login-input admin-login-code"
              disabled={status === 'sending'}
            />

            {status === 'error' && (
              <p className="admin-login-error">
                {errorMsg || 'Invalid or expired code. Try again.'}
              </p>
            )}

            <button
              type="submit"
              className="btn-sun admin-login-btn"
              disabled={status === 'sending' || code.length !== 8}
            >
              {status === 'sending' ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              className="admin-login-back"
              onClick={() => {
                setStep('email');
                setCode('');
                setStatus('idle');
                setErrorMsg('');
              }}
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .admin-login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mist);
          padding: 6vw;
        }
        .admin-login-card {
          background: var(--cloud);
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 3rem;
          max-width: 420px;
          width: 100%;
        }
        .admin-login-kicker {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ocean);
          margin: 0 0 0.5rem;
        }
        .admin-login-title {
          font-family: var(--display);
          font-size: 2rem;
          color: var(--pine);
          margin: 0 0 1.5rem;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .admin-login-label {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--grey);
        }
        .admin-login-input {
          min-height: 52px;
          border-radius: 10px;
          border: 1px solid var(--line);
          padding: 0 1rem;
          font-family: var(--body);
          font-size: 1rem;
          background: var(--mist);
        }
        .admin-login-input:focus {
          outline: none;
          border-color: var(--ocean);
        }
        .admin-login-code {
          font-size: 1.5rem;
          letter-spacing: 0.4em;
          text-align: center;
          font-family: var(--body);
        }
        .admin-login-btn {
          margin-top: 0.5rem;
          border: none;
          cursor: pointer;
        }
        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-login-error {
          color: #b3261e;
          font-family: var(--body);
          font-size: 0.9rem;
          margin: 0;
        }
        .admin-login-message {
          font-family: var(--body);
          color: var(--ink);
          line-height: 1.6;
          margin: 0 0 0.5rem;
        }
        .admin-login-back {
          background: none;
          border: none;
          color: var(--ocean);
          font-family: var(--body);
          font-size: 0.85rem;
          cursor: pointer;
          text-align: left;
          padding: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}