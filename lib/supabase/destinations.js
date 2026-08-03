import { createClient } from "@/lib/supabase/public";

/**
 * Destination Intelligence queries (Step Y).
 *
 * Both functions return null / [] on no data rather than throwing, so the
 * calling components can degrade gracefully — there's currently zero
 * claimed stories (Step V not built yet) and comment volume is likely low
 * right after Step T, so empty results are the expected common case, not
 * an error state.
 */

// ---- Cost stats ----

const AVERAGED_FIELDS = ["flights", "stay", "food", "activities", "total_per_day", "total"];

function average(rows, field) {
  const values = rows.map((r) => r[field]).filter((v) => v != null);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Averages cost_breakdowns across published stories in a region.
 *
 * IMPORTANT: only rows with currency = 'USD' are included in the average.
 * Contributors report costs in whatever currency they used, and this site
 * has no FX conversion yet — mixing PKR/EUR/USD into one raw average would
 * produce a meaningless number. Once submission volume is high enough to
 * warrant it, this should be replaced with either (a) live FX conversion,
 * or (b) grouped per-currency stats instead of a single blended figure.
 */
export async function getDestinationCostStats(regionSlug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cost_breakdowns")
    .select(
      "flights, stay, food, activities, total_per_day, total, currency, stories!inner(region, status)"
    )
    .eq("stories.region", regionSlug)
    .eq("stories.status", "published")
    .eq("currency", "USD");

  if (error || !data || data.length === 0) return null;

  const stats = {};
  for (const field of AVERAGED_FIELDS) {
    stats[toCamel(field)] = average(data, field);
  }

  // If every field came back null (rows exist but all fields empty), treat
  // as no usable data rather than showing an all-blank stat box.
  const hasAnyValue = Object.values(stats).some((v) => v != null);
  if (!hasAnyValue) return null;

  return {
    ...stats,
    currency: "USD",
    sampleSize: data.length,
  };
}

function toCamel(snake) {
  return snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

// ---- Destination Q&A ----

/**
 * Pulls reader-question / verified-author-reply pairs for a region.
 *
 * Definition used here: any comment marked is_author_reply = true that is
 * a reply (has parent_id) to another visible comment. The parent's content
 * is treated as the "question" and the reply's content as the "answer" —
 * this doesn't check that the parent is phrased as a question, just that a
 * reader asked something and the verified author responded, which is a
 * reasonable proxy for a destination FAQ.
 */
export async function getDestinationQA(regionSlug, limit = 6) {
  const supabase = await createClient();

  const { data: replies, error } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, parent_id, stories!inner(region, status, slug, title)"
    )
    .eq("stories.region", regionSlug)
    .eq("stories.status", "published")
    .eq("is_author_reply", true)
    .eq("status", "visible")
    .not("parent_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !replies || replies.length === 0) return [];

  const parentIds = replies.map((r) => r.parent_id);
  const { data: parents, error: parentError } = await supabase
    .from("comments")
    .select("id, content")
    .in("id", parentIds)
    .eq("status", "visible");

  if (parentError || !parents) return [];

  const parentMap = new Map(parents.map((p) => [p.id, p.content]));

  return replies
    .filter((r) => parentMap.has(r.parent_id))
    .map((r) => ({
      id: r.id,
      question: parentMap.get(r.parent_id),
      answer: r.content,
      storySlug: r.stories.slug,
      storyTitle: r.stories.title,
    }));
}