import Kicker from "@/components/ui/Kicker";
import StoryCard from "@/components/ui/StoryCard";
import { toCardProps } from "@/lib/data/toCardProps";

/**
 * Extracted from the inline "Related" section that already existed in
 * app/stories/[slug]/page.jsx (Step Y and earlier) — same behavior, just
 * pulled into its own component per the Step AA folder structure so it
 * can be reused/adjusted independently of the story page's other markup.
 *
 * `related` is expected to already be fetched (getRelatedStories()) and
 * passed in — this component doesn't fetch anything itself.
 */
export default function RelatedStories({ related }) {
  if (!related || related.length === 0) return null;

  return (
    <section style={{ background: "var(--cloud)", padding: "4rem 6vw" }}>
      <div className="inner">
        <Kicker>More Tales</Kicker>
        <h2>Where this reader went next</h2>
        <div
          style={{
            display: "grid",
            gap: "1.75rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            marginTop: "2rem",
          }}
        >
          {related.map((r) => (
            <StoryCard key={r.slug} story={toCardProps(r)} className="rv" />
          ))}
        </div>
      </div>
    </section>
  );
}
