// Category list. `name` must match story.category exactly (case-sensitive)
// in lib/data/stories.js, since filtering is done by that field.
// Build Guide Step H reference list: Solo Travel, Budget, etc.

export const categories = [
  {
    slug: "solo-travel",
    name: "Solo Travel",
    blurb: "Going alone doesn't mean going it alone. Stories from the road, solo.",
  },
  {
    slug: "adventure",
    name: "Adventure",
    blurb: "Ridges, rapids, and the moments your legs stopped shaking too late to matter.",
  },
  {
    slug: "budget-travel",
    name: "Budget Travel",
    blurb: "Proof that the best trips rarely cost what you think.",
  },
  {
    slug: "family-travel",
    name: "Family Travel",
    blurb: "Kids, chaos, and the trips that somehow still worked out.",
  },
  {
    slug: "food-culture",
    name: "Food & Culture",
    blurb: "The meals, the strangers, the customs that changed how you see a place.",
  },
  {
    slug: "mishaps-miracles",
    name: "Mishaps & miracles",
    blurb: "The cancelled plans and wrong turns that ended up being the whole point.",
  },
];

export function getAllCategories() {
  return categories;
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export function getAllCategorySlugs() {
  return categories.map((c) => c.slug);
}
