import Link from "next/link";
import Kicker from "@/components/ui/Kicker";
import LocalsNoteCard from "@/components/ui/LocalsNoteCard";
import LocalsNoteSubmitForm from "@/components/sections/LocalsNoteSubmitForm";
import Newsletter from "@/components/sections/Newsletter";
import { getAllRegions } from "@/lib/data/regions";
import { getLocalsNotes } from "@/lib/data/stories";
import { toCardProps } from "@/lib/data/toCardProps";

export const metadata = {
  title: "Locals' Notes — The Trip Tales",
  description: "Real tips from the people who actually live there — not a listicle.",
};

export default async function LocalsNotesPage({ searchParams }) {
  const params = await searchParams;
  const activeRegion = params?.region || null;

  const regions = getAllRegions();
  const notes = await getLocalsNotes(activeRegion ? { region: activeRegion } : {});

  return (
    <main>
      <section style={{ background: "var(--mist)", padding: "5rem 6vw 3rem" }}>
        <div className="inner">
          <Kicker>From the people who live there</Kicker>
          <h1>
            Notes from a local, <em>not a listicle.</em>
          </h1>
          <p className="lede">
            A resident&rsquo;s tip, warning, or favourite spot — in their own words, about the
            place they actually call home.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 2rem" }}>
        <div className="inner" style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <Link
            href="/locals-notes"
            className="rv"
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "100px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              background: !activeRegion ? "var(--pine)" : "var(--mist)",
              color: !activeRegion ? "#fff" : "var(--ink)",
            }}
          >
            All regions
          </Link>
          {regions.map((r) => (
            <Link
              key={r.slug}
              href={`/locals-notes?region=${r.slug}`}
              className="rv"
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "100px",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                background: activeRegion === r.slug ? "var(--pine)" : "var(--mist)",
                color: activeRegion === r.slug ? "#fff" : "var(--ink)",
              }}
            >
              {r.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--cloud)", padding: "0 6vw 5rem" }}>
        <div className="inner">
          {notes.length === 0 ? (
            <p style={{ color: "var(--grey)" }}>
              No local tips here yet — be the first to{" "}
              <a href="#share-a-tip" style={{ color: "var(--ocean)" }}>
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
              {notes.map((note) => (
                <LocalsNoteCard key={note.slug} story={toCardProps(note)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="share-a-tip" style={{ background: "var(--mist)", padding: "5rem 6vw" }}>
        <div className="inner" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <LocalsNoteSubmitForm />
        </div>
      </section>

      <Newsletter />
    </main>
  );
}