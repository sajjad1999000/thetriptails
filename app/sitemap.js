import { getAllStories, getAllAuthorSlugs } from "@/lib/data/stories";
import { getAllCategorySlugs, getCategorySlugByName } from "@/lib/data/categories";
import { getAllRegionSlugs } from "@/lib/data/regions";
import { SITE_URL as BASE_URL } from "@/lib/config";
// Bump manually when you meaningfully edit static/legal pages.
const SITE_LAST_UPDATED = new Date("2026-07-14");

export default async function sitemap() {
  const stories = await getAllStories();
  const authorSlugs = await getAllAuthorSlugs();

  const staticRoutes = [
    { url: "", changeFrequency: "weekly", priority: 1.0 },
    { url: "/stories", changeFrequency: "daily", priority: 0.9 },
    { url: "/destinations", changeFrequency: "weekly", priority: 0.8 },
    { url: "/category", changeFrequency: "weekly", priority: 0.7 },
    { url: "/submit", changeFrequency: "monthly", priority: 0.6 },
    { url: "/about", changeFrequency: "yearly", priority: 0.4 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.3 },
    { url: "/write-for-us", changeFrequency: "yearly", priority: 0.4 },
    { url: "/advertise", changeFrequency: "yearly", priority: 0.3 },
    { url: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "/terms", changeFrequency: "yearly", priority: 0.2 },
    { url: "/editorial-guidelines", changeFrequency: "yearly", priority: 0.2 },
    { url: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
    { url: "/faq", changeFrequency: "monthly", priority: 0.5 },
  ].map((r) => ({
    url: `${BASE_URL}${r.url}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const storyRoutes = stories.map((s) => ({
    url: `${BASE_URL}/stories/${s.slug}`,
    lastModified: s.publishedAt ? new Date(s.publishedAt) : SITE_LAST_UPDATED,
    changeFrequency: "monthly",
    priority: s.featured ? 0.9 : 0.7,
  }));

  const latestDateFor = (matchFn) => {
    const dates = stories
      .filter(matchFn)
      .map((s) => (s.publishedAt ? new Date(s.publishedAt).getTime() : 0));
    return dates.length ? new Date(Math.max(...dates)) : SITE_LAST_UPDATED;
  };

  const categoryRoutes = getAllCategorySlugs().map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: latestDateFor((s) => getCategorySlugByName(s.category) === slug),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const regionRoutes = getAllRegionSlugs().map((slug) => ({
    url: `${BASE_URL}/destinations/${slug}`,
    lastModified: latestDateFor((s) => s.region === slug),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const authorRoutes = authorSlugs.map((slug) => ({
    url: `${BASE_URL}/authors/${slug}`,
    lastModified: latestDateFor((s) => s.author.slug === slug),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...storyRoutes,
    ...categoryRoutes,
    ...regionRoutes,
    ...authorRoutes,
  ];
}