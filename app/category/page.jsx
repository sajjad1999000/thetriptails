import Link from "next/link";
import Kicker from "@/components/ui/Kicker";
import { getAllCategories } from "@/lib/data/categories";
import { getStoriesByCategory } from "@/lib/data/stories";

export const metadata = {
  title: "Browse by Category — The Trip Tails",
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
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {categories.map((category) => {
            const count = getStoriesByCategory(category.name).length;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rv"
                style={{
                  display: "block",
                  padding: "1.75rem 1.5rem",
                  borderRadius: "16px",
                  background: "var(--mist)",
                  border: "1px solid var(--line)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                <h3 style={{ marginBottom: ".4rem" }}>{category.name}</h3>
                <p style={{ color: "var(--grey)", fontSize: ".94rem", marginBottom: ".7rem" }}>
                  {category.blurb}
                </p>
                <span style={{ fontSize: ".82rem", color: "var(--ocean)", fontWeight: 600 }}>
                  {count} {count === 1 ? "tale" : "tales"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
