const BASE_URL = "https://thetriptails.com";

/**
 * Next.js App Router file convention — served at /robots.txt automatically.
 *
 * "/admin" below is a PLACEHOLDER — Build Guide Part 3 (security checklist)
 * says the admin review dashboard should sit behind real auth on a
 * non-guessable route. Whatever that route ends up being, add it here so
 * it's never crawlable/indexable, even though auth should already block
 * unauthenticated access.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
