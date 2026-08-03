import { getAllStories } from "@/lib/data/stories";
import { SITE_URL as BASE_URL } from "@/lib/config";

/**
 * Place this file at app/feed.xml/route.js — Next.js Route Handlers
 * support non-.js extensions in the folder name, so the folder is
 * literally named "feed.xml" and served at /feed.xml.
 *
 * Single global feed for all stories (not split per-category/region) —
 * per discussion, per-category feeds would be near-empty at your current
 * 10-12 seed-story stage and are better revisited once each category has
 * enough volume to justify its own feed.
 */

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const stories = [...getAllStories()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  const items = stories
    .map(
      (s) => `
    <item>
      <title>${escapeXml(s.title)}</title>
      <link>${BASE_URL}/stories/${s.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/stories/${s.slug}</guid>
      <pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(s.excerpt)}</description>
      <author>${escapeXml(s.author?.name || "The Trip Tales")}</author>
      <category>${escapeXml(s.category || "")}</category>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Trip Tales</title>
    <link>${BASE_URL}</link>
    <description>True stories, told by travellers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}