const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 3

const hits = new Map()

/**
 * Minimal in-memory rate limiter, keyed by whatever identifier you pass in
 * (we use the requester's IP in submitStory.js).
 *
 * Known limitation: this resets whenever the server process restarts, and
 * does not share state across multiple instances — which matters on
 * serverless platforms (Vercel) or any load-balanced deployment, since
 * each instance keeps its own Map. It's enough to stop naive single-shot
 * bot floods on a small MVP deployment, but it is NOT the final answer.
 *
 * Before real launch traffic (Build Guide Step P — Security Hardening),
 * replace this with a persistent, shared store such as Upstash Redis or
 * Vercel KV, and consider moving enforcement into middleware.js so it
 * covers the route before it even reaches this action.
 */
export function isRateLimited(identifier) {
  const now = Date.now()
  const timestamps = (hits.get(identifier) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(identifier, timestamps)
    return true
  }

  timestamps.push(now)
  hits.set(identifier, timestamps)
  return false
}
