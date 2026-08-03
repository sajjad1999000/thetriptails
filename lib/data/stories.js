import { createClient } from "@/lib/supabase/public";
import { formatStoryBody } from "@/lib/utils/formatStoryBody";

// ---- Ordinal helper for "her 3rd tale" style labels ----
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function attachTaleOrdinals(rows) {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.published_at) - new Date(b.published_at)
  );
  const counts = {};
  const ordinalById = new Map();
  sorted.forEach((r) => {
    const key = r.claimed_by || r.author_name;
    counts[key] = (counts[key] || 0) + 1;
    ordinalById.set(r.id, counts[key]);
  });
  return rows.map((r) => ({ ...r, tale_number: ordinalById.get(r.id) }));
}

function mapStoryRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image_url,
    category: row.category,
    location: row.location,
    region: row.region,
    readMinutes: row.read_time_minutes,
    publishedAt: row.published_at,
    tale_number: row.tale_number,
    story_type: row.story_type ?? "tale",
    author: {
      name: row.author_name,
      slug: row.profiles?.slug ?? null,
      country: row.author_country,
      avatar: row.profiles?.avatar_url ?? null,
      verifiedTier: row.profiles?.verified_tier ?? "none",
    },
  };
}

const CARD_SELECT = `*, profiles!stories_claimed_by_fkey ( slug, avatar_url, verified_tier )`;

export async function getAllStories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) console.error("getAllStories error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

export async function getStoriesByRegion(region) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("region", region)
    .order("published_at", { ascending: false });

  if (error) console.error("getStoriesByRegion error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

export async function getStoriesByCategory(category) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("category", category)
    .order("published_at", { ascending: false });

  if (error) console.error("getStoriesByCategory error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

export async function getLocalsNotes({ region } = {}) {
  const supabase = createClient();
  let query = supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("story_type", "locals_note")
    .order("published_at", { ascending: false });

  if (region) {
    query = query.eq("region", region);
  }

  const { data, error } = await query;
  if (error) console.error("getLocalsNotes error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

export async function getAuthorBySlug(authorSlug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, slug, display_name, avatar_url, bio, verified_tier")
    .eq("slug", authorSlug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.display_name || "Traveller",
    slug: data.slug,
    avatar: data.avatar_url || "/images/authors/default.jpg",
    bio: data.bio || "",
    verifiedTier: data.verified_tier ?? "none",
  };
}

export async function getStoriesByAuthor(authorSlug) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("slug", authorSlug)
    .maybeSingle();

  if (!profile) return [];

  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("claimed_by", profile.id)
    .order("published_at", { ascending: false });

  if (error) console.error("getStoriesByAuthor error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

export async function getAllAuthorSlugs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("slug")
    .not("slug", "is", null);

  if (error || !data) return [];
  return data.map((p) => p.slug).filter(Boolean);
}

export async function getStoryBySlug(slug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(
      `
      *,
      profiles!stories_claimed_by_fkey ( verified_tier ),
      cost_breakdowns ( flights, stay, food, activities, total_per_day, total, currency, notes ),
      story_images ( url, sort_order )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) console.error("getStoryBySlug error:", error);
  if (error || !data) return null;

  const rawCost = Array.isArray(data.cost_breakdowns)
    ? data.cost_breakdowns[0]
    : data.cost_breakdowns;

  const costBreakdown = rawCost
    ? {
        flights: rawCost.flights,
        stay: rawCost.stay,
        food: rawCost.food,
        activities: rawCost.activities,
        totalPerDay: rawCost.total_per_day,
        total: rawCost.total,
        currency: rawCost.currency,
        notes: rawCost.notes,
      }
    : null;

  const galleryImages = (data.story_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    body: formatStoryBody(data.content),
    category: data.category,
    location: data.location,
    region: data.region,
    coverImage: data.cover_image_url,
    images: galleryImages.length ? galleryImages : [data.cover_image_url].filter(Boolean),
    readMinutes: data.read_time_minutes,
    publishedAt: data.published_at,
    claimedBy: data.claimed_by,
    taleNo: data.tale_no,
    story_type: data.story_type ?? "tale",
    costBreakdown,
    author: {
      name: data.author_name,
      country: data.author_country,
      verifiedTier: data.profiles?.verified_tier ?? "none",
    },
  };
}

export async function getAllStorySlugs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((s) => s.slug);
}

export async function getRelatedStories(story, limit = 3) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("region", story.region)
    .neq("slug", story.slug)
    .limit(limit);

  if (error) console.error("getRelatedStories error:", error);
  if (error || !data) return [];
  return attachTaleOrdinals(data).map(mapStoryRow);
}

// Live homepage stats — used by ProofStats on the homepage in place
// of the old hardcoded "120+" / "38" figures. storyCount = total
// published stories. countryCount = distinct author_country values
// among published stories (case/whitespace-normalized so "Pakistan "
// and "pakistan" don't count as two different countries).
export async function getSiteStats() {
  const supabase = createClient();

  const { count: storyCount, error: countError } = await supabase
    .from("stories")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (countError) console.error("getSiteStats storyCount error:", countError);

  const { data: countryRows, error: countryError } = await supabase
    .from("stories")
    .select("author_country")
    .eq("status", "published")
    .not("author_country", "is", null);

  if (countryError) console.error("getSiteStats countryCount error:", countryError);

  const countries = new Set(
    (countryRows ?? [])
      .map((r) => r.author_country?.trim().toLowerCase())
      .filter(Boolean)
  );

  return {
    storyCount: storyCount ?? 0,
    countryCount: countries.size,
  };
}