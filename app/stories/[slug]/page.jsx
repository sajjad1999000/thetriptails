import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Kicker from "@/components/ui/Kicker";
import StoryCard from "@/components/ui/StoryCard";
import Newsletter from "@/components/sections/Newsletter";
import CommentSection from "@/components/story/CommentSection";
import VerifiedBadge from "@/components/story-extras/VerifiedBadge";
import ImageCarousel from "@/components/story-extras/ImageCarousel";
import {
  getAllStorySlugs,
  getStoryBySlug,
  getRelatedStories,
} from "@/lib/data/stories";
import { articleSchema } from "@/lib/seo/schema";
import { toCardProps } from "@/lib/data/toCardProps";
import { SITE_URL } from "@/lib/config";

export async function generateStaticParams() {
  const slugs = await getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: `${story.title} — The Trip Tales`,
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
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const url = `${SITE_URL}/stories/${story.slug}`;
  const related = await getRelatedStories(story);

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
            {story.taleNo ? ` · Tale No. ${story.taleNo}` : ""}
          </Kicker>
          <h1 style={{ color: "#fff" }}>{story.title}</h1>
          <span className="who" style={{ color: "#fff" }}>
            By <b>{story.author.name}</b> · {story.readMinutes} min read
          </span>
        </div>
      </section>

      {/* Body + Gallery */}
      <section className="story-body-section" style={{ background: "var(--cloud)", padding: "4rem 6vw" }}>
        <div className="inner story-body-grid">
          <article
            className="story-body-text"
            dangerouslySetInnerHTML={{ __html: story.body }}
          />
          <aside className="story-body-gallery">
            <ImageCarousel images={story.images} alt={story.title} />
          </aside>
        </div>
      </section>

      {/* Author line (no bio/avatar until profile data is added) */}
      <section style={{ background: "var(--mist)", padding: "3rem 6vw" }}>
        <div className="inner" style={{ maxWidth: "740px", margin: "0 auto" }}>
          <p style={{ margin: 0, fontFamily: "var(--display)", fontSize: "1.1rem", color: "var(--pine)" }}>
            {story.author.name}
            {story.author.country ? ` · ${story.author.country}` : ""}
            <VerifiedBadge tier={story.author.verifiedTier} />
          </p>
        </div>
      </section>

      {/* Comments */}
      <section style={{ background: "var(--cloud)", padding: "3rem 6vw 4rem" }}>
        <CommentSection storyId={story.id} claimedBy={story.claimedBy} />
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

      <style>{`
        .story-body-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        .story-body-gallery {
          order: -1;
        }
        @media (min-width: 900px) {
          .story-body-grid {
            grid-template-columns: 1fr 420px;
            align-items: start;
          }
          .story-body-gallery {
            order: 0;
            position: sticky;
            top: 2rem;
          }
        }
        .story-body-text {
          font-family: var(--display);
          font-size: 1.22rem;
          line-height: 1.85;
          color: var(--ink);
          letter-spacing: 0.001em;
        }
        .story-body-text p {
          margin-bottom: 1.6rem;
        }
        .story-body-text p:last-child {
          margin-bottom: 0;
        }
        .story-body-text p:first-of-type::first-letter {
          font-family: var(--display);
          font-size: 3.8rem;
          font-weight: 400;
          color: var(--sun-deep);
          float: left;
          line-height: 0.8;
          padding-right: 0.5rem;
          padding-top: 0.4rem;
        }
        .story-body-text h2,
        .story-body-text h3 {
          font-family: var(--display);
          margin-top: 2.4rem;
          margin-bottom: 0.9rem;
        }
        .story-body-text blockquote {
          font-family: var(--display);
          font-style: italic;
          font-size: 1.4rem;
          color: var(--pine);
          border-left: 3px solid var(--sun);
          padding-left: 1.4rem;
          margin: 2rem 0;
          line-height: 1.5;
        }
        .story-body-text a {
          color: var(--ocean);
          text-decoration: underline;
        }
        .story-body-text ul,
        .story-body-text ol {
          margin: 1rem 0 1.4rem 1.4rem;
          font-family: var(--body);
          font-size: 1.05rem;
        }
        .story-body-text li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </main>
  );
}