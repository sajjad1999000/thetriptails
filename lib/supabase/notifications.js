import { createClient } from '@/lib/supabase/server'

/**
 * Server-side counterpart to lib/hooks/useUnreadAuthorReplyStoryIds.js —
 * same logic (reuses the existing notifications table, "from author" is
 * determined by joining actor_id against the story's claimed_by), but
 * for use directly inside server component pages (stories index, author
 * pages) rather than a client-side hook. Avoids an extra client round
 * trip on pages that are already fetching everything else server-side.
 *
 * Returns an empty Set if nobody's logged in or on any query error —
 * this is a nice-to-have indicator, never worth failing the page over.
 */
export async function getUnreadAuthorReplyStoryIds() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new Set()

  const { data, error } = await supabase
    .from('notifications')
    .select('story_id, actor_id, stories!inner(claimed_by)')
    .eq('user_id', user.id)
    .eq('read', false)
    .eq('type', 'reply')

  if (error || !data) return new Set()

  return new Set(
    data
      .filter((row) => row.stories?.claimed_by && row.actor_id === row.stories.claimed_by)
      .map((row) => row.story_id)
  )
}
