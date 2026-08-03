'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'

const bellStyles =
  '.bell-wrap{position:relative;}' +
  '.bell{position:relative;background:none;border:none;cursor:pointer;font-size:0.85rem;font-weight:500;color:#fff;min-height:48px;min-width:40px;text-shadow:0 1px 6px rgba(0,0,0,0.3);}' +
  '.bell.solid{color:var(--pine);text-shadow:none;}' +
  '.dot{position:absolute;top:4px;right:-4px;background:#b3391f;color:#fff;font-size:0.62rem;font-weight:700;min-width:16px;height:16px;border-radius:100px;display:flex;align-items:center;justify-content:center;padding:0 3px;}' +
  '.bell-menu{position:absolute;top:100%;right:0;margin-top:0.5rem;background:var(--cloud);border-radius:12px;box-shadow:var(--shadow);width:300px;max-height:360px;overflow-y:auto;padding:0.4rem;z-index:100;}' +
  '.bell-empty{padding:1rem;color:var(--grey);font-size:0.88rem;text-align:center;margin:0;}' +
  '.bell-item{display:block;text-decoration:none;padding:0.7rem 0.8rem;border-radius:8px;}' +
  '.bell-item:hover{background:var(--mist);}' +
  '.bell-item.unread{background:rgba(230,168,63,0.12);}' +
  '.bell-msg{margin:0 0 0.2rem;font-size:0.88rem;color:var(--ink);}' +
  '.bell-date{font-size:0.75rem;color:var(--grey);}'

export default function NotificationBell(props) {
  const solid = props.solid
  const auth = useAuth()
  const user = auth.user
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    if (!user) return

    function load() {
      setLoading(true)
      supabase
        .from('notifications')
        .select('id, type, read, created_at, comment_id, story_id, actor:actor_id(display_name), stories(slug)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(function (result) {
          if (!result.error && result.data) {
            setNotifications(result.data)
          }
          setLoading(false)
        })
    }

    load()
    const interval = setInterval(load, 30000)
    return function () {
      clearInterval(interval)
    }
  }, [user, supabase])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return function () {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  if (!user) {
    return null
  }

  let unreadCount = 0
  for (let i = 0; i < notifications.length; i++) {
    if (!notifications[i].read) {
      unreadCount = unreadCount + 1
    }
  }

  function handleOpen() {
    const next = !open
    setOpen(next)

    if (next && unreadCount > 0) {
      const unreadIds = []
      for (let i = 0; i < notifications.length; i++) {
        if (!notifications[i].read) {
          unreadIds.push(notifications[i].id)
        }
      }
      supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds)
        .then(function () {
          const updated = notifications.map(function (n) {
            const copy = Object.assign({}, n)
            copy.read = true
            return copy
          })
          setNotifications(updated)
        })
    }
  }

  function messageFor(n) {
    let actorName = 'Someone'
    if (n.actor && n.actor.display_name) {
      actorName = n.actor.display_name
    }
    if (n.type === 'like') {
      return actorName + ' liked your comment'
    }
    if (n.type === 'reply') {
      return actorName + ' replied to your comment'
    }
    return actorName + ' interacted with your comment'
  }

  let badgeText = String(unreadCount)
  if (unreadCount > 9) {
    badgeText = '9+'
  }

  let bellClass = 'bell'
  if (solid) {
    bellClass = 'bell solid'
  }

  return (
    <div className="bell-wrap" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: bellStyles }} />

      <button className={bellClass} onClick={handleOpen} aria-label="Notifications">
        <span>Notifications</span>
        {unreadCount > 0 ? <span className="dot">{badgeText}</span> : null}
      </button>

      {open ? (
        <div className="bell-menu">
          {loading ? <p className="bell-empty">Loading...</p> : null}
          {!loading && notifications.length === 0 ? (
            <p className="bell-empty">No notifications yet.</p>
          ) : null}
          {!loading
            ? notifications.map(function (n) {
                let href = '#'
                if (n.stories && n.stories.slug) {
                  href = '/stories/' + n.stories.slug
                }
                let itemClass = 'bell-item'
                if (!n.read) {
                  itemClass = 'bell-item unread'
                }
                return (
                  <a key={n.id} href={href} className={itemClass}>
                    <p className="bell-msg">{messageFor(n)}</p>
                    <span className="bell-date">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </a>
                )
              })
            : null}
        </div>
      ) : null}
    </div>
  )
}