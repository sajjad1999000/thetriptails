import { notFound } from "next/navigation";
import Kicker from "@/components/ui/Kicker";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StoryCard from "@/components/ui/StoryCard";
import Newsletter from "@/components/sections/Newsletter";
import { getAllCategorySlugs, getCategoryBySlug } from "@/lib/data/categories";
import { getStoriesByCategory } from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";

const SITE_URL = "https://thetriptails.com";

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} Stories — The Trip Tails`,
    description: category.blurb,
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const stories = getStoriesByCategory(category.name);

  const crumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Stories", href: `${SITE_URL}/stories` },
    { label: category.name },
  ];

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Breadcrumbs items={crumbs} />
          <Kicker>{category.name}</Kicker>
          <h1>{category.name}</h1>
          <p className="lede">{category.blurb}</p>
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 5rem" }}>
        <div className="inner">
          {stories.length === 0 ? (
            <p style={{ color: "var(--grey)" }}>
              No {category.name.toLowerCase()} tales yet — be the first to{" "}
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
              {stories.map((story) => (
                <StoryCard key={story.slug} story={toCardProps(story)} className="rv" />
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
