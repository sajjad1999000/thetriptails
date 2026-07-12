import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Kicker from "@/components/ui/Kicker";
import StoryCard from "@/components/ui/StoryCard";
import Newsletter from "@/components/sections/Newsletter";
import {
  getAllStorySlugs,
  getStoryBySlug,
  getRelatedStories,
} from "@/lib/data/stories";
import { articleSchema } from "@/lib/seo/schema";
import { toCardProps } from "@/lib/data/toCardProps";

const SITE_URL = "https://thetriptails.com";

export function generateStaticParams() {
  return getAllStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: `${story.title} — The Trip Tails`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.coverImage],
      type: "article",
    },
  };
}

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const url = `${SITE_URL}/stories/${story.slug}`;
  const related = getRelatedStories(story);

  const crumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Tales", href: `${SITE_URL}/stories` },
    { label: story.title, href: url },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema(story, url)),
        }}
      />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: `linear-gradient(180deg, rgba(23,59,46,.1), rgba(23,59,46,.75)), url(${story.coverImage}) center/cover`,
          display: "flex",
          alignItems: "flex-end",
          padding: "5rem 6vw 3rem",
        }}
      >
        <div className="inner" style={{ color: "#fff" }}>
          <div className="hero-crumbs">
            <Breadcrumbs items={crumbs} />
          </div>
          <Kicker style={{ color: "var(--sun)" }}>
            {story.category} · {story.location}
          </Kicker>
          <h1 style={{ color: "#fff" }}>{story.title}</h1>
          <span className="who" style={{ color: "#fff" }}>
            By <b>{story.author.name}</b> · {story.author.name.split(" ")[0]}
            's {ordinal(story.tale_number)} tale · {story.readMinutes} min read
          </span>
        </div>
      </section>

      {/* Body */}
      <section style={{ background: "var(--cloud)", padding: "4rem 6vw" }}>
        <article
          className="inner"
          style={{ maxWidth: "740px", margin: "0 auto" }}
          dangerouslySetInnerHTML={{ __html: story.body }}
        />
      </section>

      {/* Author bio */}
      <section style={{ background: "var(--mist)", padding: "3rem 6vw" }}>
        <div
          className="inner"
          style={{ maxWidth: "740px", margin: "0 auto", display: "flex", gap: "1.25rem", alignItems: "center" }}
        >
          <img
            src={story.author.avatar}
            alt={story.author.name}
            width={64}
            height={64}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <p style={{ margin: 0, fontFamily: "var(--display)", fontSize: "1.1rem" }}>
              <Link href={`/authors/${story.author.slug}`} style={{ color: "var(--pine)" }}>
                {story.author.name}
              </Link>
            </p>
            <p style={{ margin: 0, color: "var(--grey)" }}>{story.author.bio}</p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
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
      )}

      <Newsletter />
    </main>
  );
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
