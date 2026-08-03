import Link from "next/link";
import Image from "next/image";
import Kicker from "./Kicker";
import styles from "./StoryCard.module.css";
import { getCategorySlugByName } from "@/lib/data/categories";

/**
 * Usage:
 *   <LocalsNoteCard story={toCardProps(story)} />
 *
 * Same story shape as StoryCard — this is the story_type='locals_note'
 * counterpart, rendered instead of StoryCard wherever a listing checks
 * story.story_type (see app/destinations/[region]/page.jsx). Shares
 * StoryCard's base card/image/title/excerpt styles from
 * StoryCard.module.css so the two stay visually consistent, but adds
 * its own badge + byline treatment: a Local's Note isn't "someone's
 * Nth tale" the way a Tale is, so it drops that ordinal and instead
 * reads "Local tip from **Name**".
 */
export default function LocalsNoteCard({ story, className = "" }) {
  const { slug, title, excerpt, coverImage, category, location, author, authorSlug, readTime } = story;
  const categorySlug = category ? getCategorySlugByName(category) : null;

  return (
    <article className={`${styles.card} rv ${className}`.trim()}>
      <Link href={`/stories/${slug}`} className={styles.imageLink} tabIndex={-1}>
        <div className={styles.imageWrap}>
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
            className={styles.image}
          />
          <span className={styles.badge}>Local&rsquo;s Note</span>
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <Kicker className={styles.kicker}>
            {categorySlug ? (
              <Link href={`/category/${categorySlug}`}>{category}</Link>
            ) : (
              category
            )}
            {location ? ` · ${location}` : ""}
          </Kicker>
        </div>
        <h3 className={styles.title}>
          <Link href={`/stories/${slug}`}>{title}</Link>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <p className={styles.byline}>
          Local tip from{" "}
          <strong>
            {authorSlug ? <Link href={`/authors/${authorSlug}`}>{author}</Link> : author}
          </strong>
          {readTime ? ` · ${readTime} min read` : ""}
        </p>
      </div>
    </article>
  );
}