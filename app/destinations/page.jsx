import Link from "next/link";
import Kicker from "@/components/ui/Kicker";
import { getAllRegions } from "@/lib/data/regions";
import { getStoriesByRegion } from "@/lib/data/stories";

export const metadata = {
  title: "Destinations — The Trip Tales",
  description: "Explore true travel stories by region — Europe, Asia, the Americas, Africa, Oceania.",
};

export default async function DestinationsHubPage() {
  const regions = getAllRegions();

  // Only 5 regions — a Promise.all of 5 small queries is fine at
  // this scale. Revisit with a single grouped count query if the
  // region list grows.
  const counts = await Promise.all(
    regions.map((region) => getStoriesByRegion(region.slug))
  ).then((results) => results.map((stories) => stories.length));

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Kicker>Destinations</Kicker>
          <h1>
            Pick a place. <em>Read what actually happened there.</em>
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
          {regions.map((region, i) => {
            const count = counts[i];
            return (
              <Link
                key={region.slug}
                href={`/destinations/${region.slug}`}
                className="rv"
                style={{
                  display: "block",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "var(--cloud)",
                  boxShadow: "var(--shadow)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    background: "linear-gradient(160deg,#4E7A5A,#173B2E)",
                  }}
                >
                  <img
                    src={region.coverImage}
                    alt={region.coverAlt}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1.4rem 1.5rem 1.6rem" }}>
                  <h3 style={{ marginBottom: ".4rem" }}>{region.name}</h3>
                  <p style={{ color: "var(--grey)", fontSize: ".94rem", marginBottom: ".7rem" }}>
                    {region.blurb}
                  </p>
                  <span style={{ fontSize: ".82rem", color: "var(--ocean)", fontWeight: 600 }}>
                    {count} {count === 1 ? "tale" : "tales"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}