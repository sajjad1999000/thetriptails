/**
 * PLACEHOLDER DATA — dev-only.
 * Per Style Reference §9: never launch with AI-generated fake "traveler"
 * stories. Swap every entry below for a real submission (or content from
 * your personal network / explicitly CC-BY-licensed writing) before
 * going live — see Build Guide Step O ("Seed content").
 *
 * Once Step F (story template) exists, `slug` should match a real
 * app/stories/[slug] route. Until then these links won't resolve.
 */
export const homepageStories = [
  {
    slug: "shopkeeper-who-wouldnt-let-me-pay",
    title: "The shopkeeper who wouldn't let me pay",
    excerpt:
      "I came for the peaks. I left telling everyone about a cup of chai in Karimabad and the man who refused my money three times.",
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format&fit=crop",
    category: "Mountains",
    location: "Pakistan",
    author: "Sara K.",
    tale: "her 3rd tale",
    readTime: 8,
  },
  {
    slug: "our-balloon-got-cancelled",
    title: "Our balloon got cancelled. Best thing that happened.",
    excerpt:
      "Everyone chases the balloon photo. We got fog, a grumpy driver, and accidentally the most magical valley walk of our lives.",
    coverImage:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80&auto=format&fit=crop",
    category: "Mishaps & miracles",
    location: "Türkiye",
    author: "Daniyal M.",
    tale: "first tale",
    readTime: 6,
  },
  {
    slug: "atlantic-taught-me-to-slow-down",
    title: "The Atlantic taught me to slow down",
    excerpt:
      "I planned four cities in six days. A surfer in the Algarve talked me out of all of it — and into the best week of my year.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
    category: "Ocean & islands",
    location: "Portugal",
    author: "Amelia R.",
    tale: "her 5th tale",
    readTime: 5,
  },
  {
    slug: "santorini-on-48-a-day",
    title: "Santorini on €48 a day (yes, really)",
    excerpt:
      "Everyone said it couldn't be done in high season. The ferry trick, the village nobody books, and the €3 gyros that beat every rooftop dinner.",
    coverImage:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80&auto=format&fit=crop",
    category: "Budget wins",
    location: "Greece",
    author: "Lena P.",
    tale: "her 4th tale",
    readTime: 4,
  },
  {
    slug: "rice-terrace-my-scooter-breakdown-found",
    title: "The rice terrace my scooter breakdown found",
    excerpt:
      "Engine died on a back road in Ubud. A farmer, his nephew, and a view no tour bus will ever reach. Sometimes breakdowns are the itinerary.",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80&auto=format&fit=crop",
    category: "Wrong turns",
    location: "Indonesia",
    author: "Jonas B.",
    tale: "first tale",
    readTime: 7,
  },
  {
    slug: "three-days-offline-in-the-julian-alps",
    title: "Three days offline in the Julian Alps",
    excerpt:
      "No signal, no plan, one borrowed tent. What happens to your head when the forest is the only feed you can scroll.",
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop",
    category: "Forests & wild",
    location: "Slovenia",
    author: "Clara V.",
    tale: "her 2nd tale",
    readTime: 5,
  },
];

/**
 * Full story records — used by app/stories/page.jsx and
 * app/stories/[slug]/page.jsx. Shape only — swap for real submissions
 * before launch (Build Guide Step O).
 */
export const stories = [
  {
    slug: "night-train-serbia",
    title: "The Night Train Nobody Warned Me About",
    excerpt:
      "I fell asleep in Belgrade and woke up in a stranger's story — one I still tell at every dinner party.",
    body: `<p>Placeholder body copy. Replace with real submission text (rich text / markdown → HTML).</p>`,
    category: "Solo Travel",
    location: "Serbia",
    region: "europe",
    author: {
      name: "Amara Osei",
      slug: "amara-osei",
      bio: "Writes about slow travel and cheap trains.",
      avatar: "/images/authors/amara.jpg",
    },
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Green mountain range under morning light",
    readMinutes: 6,
    tale_number: 1, // "nth tale" for this author
    publishedAt: "2026-05-12",
    featured: true,
  },
  {
    slug: "skardu-arms-open",
    title: "Arms Open Above the Valley",
    excerpt:
      "Three days into Skardu, my knees stopped shaking on the ridge — and something else did instead.",
    body: `<p>Placeholder body copy.</p>`,
    category: "Adventure",
    location: "Skardu, Pakistan",
    region: "asia",
    author: {
      name: "Daniyal Raza",
      slug: "daniyal-raza",
      bio: "Mountain trips, done cheap.",
      avatar: "/images/authors/daniyal.jpg",
    },
    coverImage:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "A traveller with arms open above a misty green valley",
    readMinutes: 5,
    tale_number: 1,
    publishedAt: "2026-06-01",
    featured: false,
  },
];

export function getAllStories() {
  return stories;
}

export function getStoryBySlug(slug) {
  return stories.find((s) => s.slug === slug) || null;
}

export function getAllStorySlugs() {
  return stories.map((s) => s.slug);
}

export function getRelatedStories(story, limit = 3) {
  return stories
    .filter((s) => s.slug !== story.slug && s.region === story.region)
    .slice(0, limit);
}

export function getStoriesByRegion(region) {
  return stories.filter((s) => s.region === region);
}