import StoryCard from "@/components/ui/StoryCard";
import Kicker from "@/components/ui/Kicker";
import { getAllStories } from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";

export const metadata = {
  title: "All Tales — The Trip Tails",
  description: "True, first-person travel stories from real travellers. No AI filler, real bylines only.",
};

export default function StoriesIndexPage() {
  const stories = getAllStories();

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Kicker>All Tales</Kicker>
          <h1>
            Every story here happened <em>to someone real.</em>
          </h1>
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 5rem" }}>
        <div
          className="inner"
          style={{
            display: "grid",
            gap: "1.75rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {stories.map((story) => (
            <StoryCard key={story.slug} story={toCardProps(story)} className="rv" />
          ))}
        </div>
      </section>
    </main>
  );
}
