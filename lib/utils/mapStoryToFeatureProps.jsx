/**
 * lib/utils/mapStoryToFeatureProps.js
 *
 * Converts a `stories` row into the prop shape the existing
 * <Feature /> component expects, so the Story of the Week slot on
 * the homepage can be driven by data instead of hardcoded copy.
 */

function getInitials(name) {
  if (!name) return '??'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function mapStoryToFeatureProps(story) {
  if (!story) return null

  const location = story.location || story.region || null
  const kicker = location ? `Story of the week · ${location}` : 'Story of the week'

  return {
    kicker,
    title: story.title,
    quote: story.excerpt ? `\u201C${story.excerpt}\u201D` : null,
    initials: getInitials(story.author_name),
    bylineText: (
      <>
        Written by <b>{story.author_name}</b>
        {story.read_time_minutes ? ` · ${story.read_time_minutes} min read` : ''}
      </>
    ),
    ctaLabel: 'Read the full tale',
    ctaHref: `/stories/${story.slug}`,
    image: {
      src: story.cover_image_url || 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1800&q=80&auto=format&fit=crop',
      alt: story.title,
    },
  }
}
