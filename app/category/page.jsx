import Kicker from "@/components/ui/Kicker";
import CategoryCard from "@/components/ui/CategoryCard";
import { getAllCategories } from "@/lib/data/categories";
import { getStoriesByCategory } from "@/lib/data/stories";

export const metadata = {
  title: "Browse by Category — The Trip Tales",
  description: "True travel stories sorted by category — solo travel, adventure, budget wins, and more.",
};

export default function CategoryHubPage() {
  const categories = getAllCategories();

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Kicker>Categories</Kicker>
          <h1>
            Find the kind of story <em>you're in the mood for.</em>
          </h1>
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 5rem" }}>
        <div
          className="inner"
          style={{
            display: "grid",
            gap: "1.75rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              count={getStoriesByCategory(category.name).length}
            />
          ))}
        </div>
      </section>
    </main>
  );
}