import { notFound } from "next/navigation";
import Kicker from "@/components/ui/Kicker";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StoryCard from "@/components/ui/StoryCard";
import Newsletter from "@/components/sections/Newsletter";
import {
  getAllAuthorSlugs,
  getAuthorBySlug,
  getStoriesByAuthor,
} from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";

const SITE_URL = "https://thetriptails.com";

export function generateStaticParams() {
  return getAllAuthorSlugs().map((author) => ({ author }));
}

export async function generateMetadata({ params }) {
  const { author: authorSlug } = await params;
  const author = getAuthorBySlug(authorSlug);
  if (!author) return {};
  return {
    title: `${author.name} — The Trip Tails`,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }) {
  const { author: authorSlug } = await params;
  const author = getAuthorBySlug(authorSlug);
  if (!author) notFound();

  const stories = getStoriesByAuthor(authorSlug);

  const crumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Stories", href: `${SITE_URL}/stories` },
    { label: author.name },
  ];

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Breadcrumbs items={crumbs} />
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginTop: "1rem" }}>
            <img
              src={author.avatar}
              alt={author.name}
              width={88}
              height={88}
              style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div>
              <Kicker>Contributor</Kicker>
              <h1>{author.name}</h1>
              <p className="lede" style={{ marginTop: ".3rem" }}>
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 5rem" }}>
        <div className="inner">
          <Kicker>
            {stories.length} {stories.length === 1 ? "Tale" : "Tales"}
          </Kicker>
          <div
            style={{
              display: "grid",
              gap: "1.75rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              marginTop: "1.5rem",
            }}
          >
            {stories.map((story) => (
              <StoryCard key={story.slug} story={toCardProps(story)} className="rv" />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
