// Single source of truth for the site's canonical base URL.
// Import this everywhere instead of redefining SITE_URL/BASE_URL locally —
// that duplication is exactly what caused thetriptails.com (wrong) to spread
// across sitemap.js, robots.js, feed-route.js, schema.js, and 11 page files.
export const SITE_URL = "https://thetriptales.com";