// Category list. `name` must match story.category exactly (case-sensitive)
// in lib/data/stories.js, since filtering is done by that field.
// Build Guide Step H reference list: Solo Travel, Budget, etc.
//
// `images`: used by CategoryCard for the /category hub page carousel.
// Some are borrowed from real story cover images already in stories.js;
// others are sourced placeholder photos matching the category's mood.
// Swap these for real cover images from approved stories as they come in —
// categories with only 1 image render static (no carousel) until a 2nd is added.

export const categories = [
  {
    slug: "solo-travel",
    name: "Solo Travel",
    blurb: "Going alone doesn't mean going it alone. Stories from the road, solo.",
    images: [
      "https://images.unsplash.com/photo-1502307100811-6bdc0981a85b?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "adventure",
    name: "Adventure",
    blurb: "Ridges, rapids, and the moments your legs stopped shaking too late to matter.",
    images: [
      "https://images.unsplash.com/photo-1689825422854-8e3083c2fb82?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "budget-travel",
    name: "Budget Travel",
    blurb: "Proof that the best trips rarely cost what you think.",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "family-travel",
    name: "Family Travel",
    blurb: "Kids, chaos, and the trips that somehow still worked out.",
    images: [
      "https://images.unsplash.com/photo-1425243749210-c3e3c231504d?w=900&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "food-culture",
    name: "Food & Culture",
    blurb: "The meals, the strangers, the customs that changed how you see a place.",
    images: [
      "https://images.unsplash.com/photo-1750315857352-b261c631d853?w=900&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "mishaps-miracles",
    name: "Mishaps & miracles",
    blurb: "The cancelled plans and wrong turns that ended up being the whole point.",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop",
    ],
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

export function getCategorySlugByName(name) {
  const match = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return match ? match.slug : null;
}