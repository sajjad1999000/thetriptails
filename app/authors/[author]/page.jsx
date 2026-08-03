import { notFound } from "next/navigation";
import Kicker from "@/components/ui/Kicker";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StoryCard from "@/components/ui/StoryCard";
import Newsletter from "@/components/sections/Newsletter";
import VerifiedBadge from "@/components/story-extras/VerifiedBadge";
import {
  getAllAuthorSlugs,
  getAuthorBySlug,
  getStoriesByAuthor,
} from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";
import { getUnreadAuthorReplyStoryIds } from "@/lib/supabase/notifications";

const SITE_URL = "https://thetriptails.com";

// Was sync against static data — now needs to be async since author
// slugs come from a real profiles query.
export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((author) => ({ author }));
}

export async function generateMetadata({ params }) {
  const { author: authorSlug } = await params;
  const author = await getAuthorBySlug(authorSlug);
  if (!author) return {};
  return {
    title: `${author.name} — The Trip Tales`,
    description: author.bio || `${author.name}'s stories on The Trip Tales.`,
  };
}

export default async function AuthorPage({ params }) {
  const { author: authorSlug } = await params;
  const author = await getAuthorBySlug(authorSlug);
  if (!author) notFound();

  // Now real Supabase data — story.id exists, so the unread-reply
  // flag actually works here too.
  const stories = await getStoriesByAuthor(authorSlug);
  const unreadAuthorReplyStoryIds = await getUnreadAuthorReplyStoryIds();

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
              <h1>
                {author.name}
                <VerifiedBadge tier={author.verifiedTier} />
              </h1>
              {author.bio && (
                <p className="lede" style={{ marginTop: ".3rem" }}>
                  {author.bio}
                </p>
              )}
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
              <StoryCard
                key={story.slug}
                story={toCardProps(story)}
                className="rv"
                showNewReplyFlag={unreadAuthorReplyStoryIds.has(story.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}