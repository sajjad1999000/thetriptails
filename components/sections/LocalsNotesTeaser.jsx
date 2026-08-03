import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import LocalsNoteCard from "@/components/ui/LocalsNoteCard";
import styles from "./LocalsNotesTeaser.module.css";

/**
 * Homepage teaser for Locals' Notes. Mirrors StoryGrid.jsx's layout
 * (same grid rhythm) but uses its own CSS module with a --cloud
 * background — deliberately different from StoryGrid's --mist so
 * the two sections never sit adjacent with the same background,
 * per Style Reference §4 ("never two adjacent sections with
 * identical background"), regardless of where this section is
 * placed in the homepage order.
 *
 * Renders nothing if there are no notes yet — same "real content
 * before promotion" rule already applied to homepage stats.
 */
export default function LocalsNotesTeaser({ kicker, heading, notes = [], moreLabel, moreHref }) {
  if (notes.length === 0) return null;

  return (
    <section className={styles.gridSec} id="locals-notes">
      <div className="inner">
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className="rv">{heading}</h2>
        <div className={styles.stories}>
          {notes.map((note) => (
            <LocalsNoteCard key={note.slug} story={note} />
          ))}
        </div>
        {moreHref && (
          <div className={`${styles.more} rv`}>
            <Button variant="pine" href={moreHref}>
              {moreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}