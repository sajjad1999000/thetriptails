'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import LoginModal from '@/components/auth/LoginModal'
import ReportModal from './ReportModal'
import { blockUserAction } from '@/lib/actions/moderation'
import VerifiedBadge from '@/components/story-extras/VerifiedBadge'

export default function CommentSection({ storyId, claimedBy }) {
  const { user } = useAuth()
  const supabase = createClient()

  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState({})
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [reportingId, setReportingId] = useState(null)
  const [blockingId, setBlockingId] = useState(null)
  const [blockError, setBlockError] = useState(null) // { commentUserId, message } | null

  const isClaimedAuthor = !!(user && claimedBy && user.id === claimedBy)

  const loadComments = useCallback(async () => {
    setLoading(true)

    const { data: commentRows, error } = await supabase
      .from('comments')
      .select(
        'id, content, created_at, parent_id, user_id, is_author_reply, profiles(display_name, avatar_url, verified_tier)'
      )
      .eq('story_id', storyId)
      .eq('status', 'visible')
      .order('created_at', { ascending: true })

    if (error || !commentRows) {
      setComments([])
      setLikes({})
      setLoading(false)
      return
    }

    setComments(commentRows)

    const ids = commentRows.map((c) => c.id)
    if (ids.length > 0) {
      const { data: likeRows } = await supabase
        .from('comment_likes')
        .select('comment_id, user_id')
        .in('comment_id', ids)

      const map = {}
      ;(likeRows || []).forEach((r) => {
        if (!map[r.comment_id]) map[r.comment_id] = new Set()
        map[r.comment_id].add(r.user_id)
      })
      setLikes(map)
    } else {
      setLikes({})
    }

    setLoading(false)
  }, [storyId, supabase])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  async function handlePostComment(e) {
    e.preventDefault()
    if (!user) {
      setLoginOpen(true)
      return
    }
    const trimmed = newComment.trim()
    if (!trimmed) return

    setSubmitting(true)
    const { error } = await supabase.from('comments').insert({
      story_id: storyId,
      user_id: user.id,
      content: trimmed,
      status: 'visible',
      is_author_reply: !!(claimedBy && user.id === claimedBy),
    })
    setSubmitting(false)

    if (!error) {
      setNewComment('')
      loadComments()
    }
  }

  async function handlePostReply(parentId) {
    if (!user) {
      setLoginOpen(true)
      return
    }
    const trimmed = replyText.trim()
    if (!trimmed) return

    setSubmitting(true)
    const { error } = await supabase.from('comments').insert({
      story_id: storyId,
      user_id: user.id,
      parent_id: parentId,
      content: trimmed,
      status: 'visible',
      is_author_reply: !!(claimedBy && user.id === claimedBy),
    })
    setSubmitting(false)

    if (!error) {
      setReplyText('')
      setReplyingTo(null)
      loadComments()
    }
  }

  async function toggleLike(commentId) {
    if (!user) {
      setLoginOpen(true)
      return
    }
    const likedSet = likes[commentId]
    const iLiked = likedSet && likedSet.has(user.id)

    if (iLiked) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
    } else {
      await supabase.from('comment_likes').insert({
        comment_id: commentId,
        user_id: user.id,
      })
    }
    loadComments()
  }

  async function hideComment(commentId) {
    const confirmed = window.confirm('Hide this comment from the thread?')
    if (!confirmed) return

    await supabase
      .from('comments')
      .update({ status: 'hidden' })
      .eq('id', commentId)

    loadComments()
  }

  async function handleBlock(commentUserId) {
    const confirmed = window.confirm(
      'Block this reader from commenting on this story? They will no longer be able to post here.'
    )
    if (!confirmed) return

    setBlockingId(commentUserId)
    setBlockError(null)

    const res = await blockUserAction(storyId, commentUserId)

    setBlockingId(null)

    if (res?.error) {
      setBlockError({ commentUserId, message: res.error })
      return
    }

    // Blocking doesn't retroactively hide their past comments —
    // that's a separate action (Hide) the author can still take.
  }

  const topLevel = comments.filter((c) => !c.parent_id)
  const repliesFor = (id) => comments.filter((c) => c.parent_id === id)

  function renderComment(comment, isReply) {
    const likedSet = likes[comment.id]
    const likeCount = likedSet ? likedSet.size : 0
    const iLiked = user && likedSet && likedSet.has(user.id)
    const name = comment.profiles?.display_name || 'Traveller'

    return (
      <div key={comment.id} className={`comment${isReply ? ' reply' : ''}`}>
        <div className="head">
          <span className="avatar">
            {comment.profiles?.avatar_url ? (
              <img src={comment.profiles.avatar_url} alt="" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </span>
          <span className="name">
            {name}
            {comment.is_author_reply && <span className="badge">Author</span>}
            <VerifiedBadge tier={comment.profiles?.verified_tier} />
          </span>
          <span className="date">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="content">{comment.content}</p>
        <div className="actions">
          <button
            className={`like${iLiked ? ' liked' : ''}`}
            onClick={() => toggleLike(comment.id)}
          >
            ♥ {likeCount > 0 ? likeCount : ''}
          </button>
          {!isReply && (
            <button
              className="reply-btn"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              Reply
            </button>
          )}
          {user && user.id !== comment.user_id && (
            <button
              className="reply-btn"
              onClick={() => setReportingId(comment.id)}
            >
              Report
            </button>
          )}
          {isClaimedAuthor && comment.user_id !== user.id && (
            <button
              className="hide-btn"
              onClick={() => hideComment(comment.id)}
            >
              Hide
            </button>
          )}
          {isClaimedAuthor && comment.user_id !== user.id && (
            <button
              className="block-btn"
              disabled={blockingId === comment.user_id}
              onClick={() => handleBlock(comment.user_id)}
            >
              {blockingId === comment.user_id ? 'Blocking…' : 'Block'}
            </button>
          )}
        </div>

        {blockError && blockError.commentUserId === comment.user_id && (
          <p className="block-error">{blockError.message}</p>
        )}

        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${name}...`}
              rows={2}
            />
            <button
              className="btn-sun"
              disabled={submitting}
              onClick={() => handlePostReply(comment.id)}
            >
              {submitting ? 'Posting…' : 'Post reply'}
            </button>
          </div>
        )}

        {!isReply &&
          repliesFor(comment.id).map((r) => renderComment(r, true))}

        <style jsx>{`
          .comment {
            padding: 1.2rem 0;
            border-bottom: 1px solid var(--line);
          }
          .comment.reply {
            margin-left: 2.5rem;
            border-bottom: none;
            padding: 0.9rem 0 0;
          }
          .head {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            margin-bottom: 0.4rem;
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
            font-weight: 600;
            color: var(--pine);
            font-size: 0.92rem;
          }
          .badge {
            margin-left: 0.5rem;
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            background: var(--mist);
            color: var(--ocean);
            padding: 0.15rem 0.45rem;
            border-radius: 100px;
          }
          .date {
            font-size: 0.78rem;
            color: var(--grey);
            margin-left: auto;
          }
          .content {
            margin: 0 0 0.5rem;
            color: var(--ink);
            font-size: 0.95rem;
            line-height: 1.5;
          }
          .actions {
            display: flex;
            gap: 1rem;
          }
          .like {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            color: var(--grey);
            padding: 0.2rem 0;
          }
          .reply-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.85rem;
            color: var(--grey);
            padding: 0.2rem 0;
          }
          .hide-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.85rem;
            color: #b3391f;
            padding: 0.2rem 0;
          }
          .hide-btn:hover {
            text-decoration: underline;
          }
          .block-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.85rem;
            color: #b3391f;
            padding: 0.2rem 0;
          }
          .block-btn:hover {
            text-decoration: underline;
          }
          .block-btn:disabled {
            opacity: 0.6;
            cursor: default;
          }
          .block-error {
            color: #b3391f;
            font-size: 0.82rem;
            margin: 0.4rem 0 0;
          }
          .like.liked {
            color: #b3391f;
          }
          .reply-btn:hover {
            color: var(--ocean);
          }
          .reply-form {
            margin-top: 0.7rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 480px;
          }
          .reply-form textarea {
            border-radius: 10px;
            border: 1px solid var(--line);
            background: var(--mist);
            padding: 0.6rem;
            font-family: var(--body);
            font-size: 0.9rem;
            resize: vertical;
          }
          :global(.reply-form .btn-sun) {
            align-self: flex-start;
            min-height: 40px;
            padding: 0 1.2rem;
            border-radius: 100px;
            background: var(--sun);
            color: var(--pine);
            border: none;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  return (
    <section className="comments">
      <h2>Comments {comments.length > 0 && `(${comments.length})`}</h2>

      <form className="new-comment" onSubmit={handlePostComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? 'Add a comment...' : 'Sign in to leave a comment'}
          rows={3}
        />
        <button type="submit" className="btn-sun" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
        </button>
      </form>

      {loading && <p className="empty">Loading comments…</p>}
      {!loading && topLevel.length === 0 && (
        <p className="empty">No comments yet — be the first.</p>
      )}

      <div className="list">
        {topLevel.map((c) => renderComment(c, false))}
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {reportingId && (
        <ReportModal
          commentId={reportingId}
          onClose={() => setReportingId(null)}
        />
      )}

      <style jsx>{`
        .comments {
          max-width: 740px;
          margin: 0 auto;
        }
        h2 {
          font-family: var(--display);
          color: var(--pine);
          margin-bottom: 1.2rem;
        }
        .new-comment {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 2rem;
        }
        .new-comment textarea {
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--mist);
          padding: 0.8rem;
          font-family: var(--body);
          font-size: 0.95rem;
          resize: vertical;
        }
        :global(.new-comment .btn-sun) {
          align-self: flex-start;
          min-height: 46px;
          padding: 0 1.4rem;
          border-radius: 100px;
          background: var(--sun);
          color: var(--pine);
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .empty {
          color: var(--grey);
          font-size: 0.92rem;
        }
      `}</style>
    </section>
  )
}