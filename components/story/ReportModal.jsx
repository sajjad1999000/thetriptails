'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const REASONS = [
  'Spam',
  'Harassment or abuse',
  'Off-topic',
  'Inappropriate content',
  'Other',
]

export default function ReportModal(props) {
  const commentId = props.commentId
  const onClose = props.onClose
  const supabase = createClient()

  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason) return

    setSubmitting(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSubmitting(false)
      setError('You need to be signed in to report a comment.')
      return
    }

    const result = await supabase.from('comment_reports').insert({
      comment_id: commentId,
      reporter_id: user.id,
      reason: reason,
    })

    setSubmitting(false)

    if (result.error) {
      setError('Could not submit report — try again.')
      return
    }

    setDone(true)
  }

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-modal" onClick={function (e) { e.stopPropagation() }}>
        <button className="report-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        {done ? (
          <div>
            <h3>Thanks for letting us know</h3>
            <p className="report-sub">We&rsquo;ll review this comment shortly.</p>
            <button className="report-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Report this comment</h3>
            <p className="report-sub">Tell us what&rsquo;s wrong with it.</p>

            <div className="report-options">
              {REASONS.map(function (r) {
                return (
                  <label key={r} className="report-option">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={function () { setReason(r) }}
                    />
                    <span>{r}</span>
                  </label>
                )
              })}
            </div>

            {error ? <p className="report-error">{error}</p> : null}

            <button
              type="submit"
              className="report-btn"
              disabled={!reason || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit report'}
            </button>
          </form>
        )}

        <style dangerouslySetInnerHTML={{ __html:
          '.report-overlay{position:fixed;inset:0;z-index:250;background:rgba(23,59,46,0.55);display:flex;align-items:center;justify-content:center;padding:5vw;}' +
          '.report-modal{position:relative;background:var(--cloud);border-radius:16px;box-shadow:var(--shadow);padding:2.2rem 1.8rem;max-width:380px;width:100%;}' +
          '.report-close{position:absolute;top:0.7rem;right:0.7rem;width:36px;height:36px;border:none;background:none;font-size:1.4rem;color:var(--grey);cursor:pointer;border-radius:100px;}' +
          '.report-close:hover{background:var(--mist);color:var(--ink);}' +
          '.report-modal h3{font-family:var(--display);color:var(--pine);font-size:1.25rem;margin:0 0 0.4rem;}' +
          '.report-sub{color:var(--grey);font-size:0.9rem;margin:0 0 1.2rem;}' +
          '.report-options{display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1.2rem;}' +
          '.report-option{display:flex;align-items:center;gap:0.6rem;font-size:0.9rem;color:var(--ink);cursor:pointer;}' +
          '.report-error{color:#b3391f;font-size:0.85rem;margin:0 0 1rem;}' +
          '.report-btn{width:100%;min-height:48px;border-radius:100px;background:var(--sun);color:var(--pine);border:none;font-weight:600;cursor:pointer;}' +
          '.report-btn:disabled{opacity:0.6;cursor:default;}'
        }} />
      </div>
    </div>
  )
}