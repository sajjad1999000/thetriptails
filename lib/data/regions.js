// Region list. Slugs match the `region` field used in lib/data/stories.js
// so story filtering + related-stories logic stay consistent.
// Swap coverImage placeholders for real photography before launch (Style Reference §7).

export const regions = [
  {
    slug: "europe",
    name: "Europe",
    blurb: "Night trains, cheap flights, and stories that start in a hostel kitchen.",
    coverImage:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "White houses and blue domes above the Aegean sea",
  },
  {
    slug: "asia",
    name: "Asia",
    blurb: "Mountains, monsoons, and the kind of hospitality that ruins you for home.",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Green rice terraces stepping down a Balinese hillside",
  },
  {
    slug: "americas",
    name: "The Americas",
    blurb: "From border crossings to backcountry trails, north to south.",
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Sunlight streaming through a tall green forest",
  },
  {
    slug: "africa",
    name: "Africa",
    blurb: "Deserts, coastlines, and journeys that rewrite the itinerary daily.",
    coverImage:
      "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Golden savanna landscape at sunset",
  },
  {
    slug: "oceania",
    name: "Oceania",
    blurb: "Islands, reefs, and the long way round.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop",
    coverAlt: "Clear turquoise waves rolling onto a sandy beach",
  },
];

export function getAllRegions() {
  return regions;
}

export function getRegionBySlug(slug) {
  return regions.find((r) => r.slug === slug) || null;
}

export function getAllRegionSlugs() {
  return regions.map((r) => r.slug);
}
