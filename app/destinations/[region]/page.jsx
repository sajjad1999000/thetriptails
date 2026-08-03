import { notFound } from "next/navigation";
import Kicker from "@/components/ui/Kicker";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StoryCard from "@/components/ui/StoryCard";
import LocalsNoteCard from "@/components/ui/LocalsNoteCard";
import Newsletter from "@/components/sections/Newsletter";
import DestinationStatsGrid from "@/components/destinations/DestinationStatsGrid";
import DestinationQA from "@/components/destinations/DestinationQA";
import { getAllRegionSlugs, getRegionBySlug } from "@/lib/data/regions";
import { getStoriesByRegion } from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";
import { getDestinationCostStats, getDestinationQA } from "@/lib/supabase/destinations";
import { SITE_URL } from "@/lib/config";

export function generateStaticParams() {
  return getAllRegionSlugs().map((region) => ({ region }));
}

export async function generateMetadata({ params }) {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);
  if (!region) return {};
  return {
    title: `${region.name} Travel Stories — The Trip Tales`,
    description: region.blurb,
  };
}

export default async function RegionPage({ params }) {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);
  if (!region) notFound();

  // Now real Supabase data — matches the live cost/QA stats below
  // instead of showing placeholder cards next to real numbers.
  const stories = await getStoriesByRegion(region.slug);

  const [costStats, qa] = await Promise.all([
    getDestinationCostStats(region.slug),
    getDestinationQA(region.slug),
  ]);

  const crumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Destinations", href: `${SITE_URL}/destinations` },
    { label: region.name },
  ];

  return (
    <main>
      <section
        style={{
          position: "relative",
          aspectRatio: "21/9",
          background: `linear-gradient(180deg, rgba(23,59,46,.1), rgba(23,59,46,.75)), url(${region.coverImage}) center/cover`,
          display: "flex",
          alignItems: "flex-end",
          padding: "5rem 6vw 3rem",
        }}
      >
        <div className="inner hero-crumbs">
          <Breadcrumbs items={crumbs} />
          <Kicker style={{ color: "var(--sun)" }}>Destinations</Kicker>
          <h1 style={{ color: "#fff" }}>{region.name}</h1>
          <p className="lede" style={{ color: "rgba(255,255,255,.85)" }}>
            {region.blurb}
          </p>
        </div>
      </section>

      {costStats && <DestinationStatsGrid stats={costStats} />}

      <section style={{ background: "var(--cloud)", padding: "5rem 6vw" }}>
        <div className="inner">
          {stories.length === 0 ? (
            <p style={{ color: "var(--grey)" }}>
              No tales from {region.name} yet — be the first to{" "}
              <a href="/submit" style={{ color: "var(--ocean)" }}>
                share yours
              </a>
              .
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "1.75rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {stories.map((story) =>
                // STEP AB: Locals' Notes render with their own card —
                // shorter byline, badge instead of a "tale" ordinal.
                // Everything else (Tales, and anything with no
                // story_type set yet on still-unmigrated placeholder
                // data) falls back to the existing StoryCard.
                story.story_type === "locals_note" ? (
                  <LocalsNoteCard key={story.slug} story={toCardProps(story)} className="rv" />
                ) : (
                  <StoryCard key={story.slug} story={toCardProps(story)} className="rv" />
                )
              )}
            </div>
          )}
        </div>
      </section>

      <DestinationQA qa={qa} regionName={region.name} />

      <Newsletter />
    </main>
  );
}