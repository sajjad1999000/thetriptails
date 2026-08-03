import Link from "next/link";
import Image from "next/image";
import Kicker from "./Kicker";
import NewReplyFlag from "@/components/story-extras/NewReplyFlag";
import styles from "./StoryCard.module.css";
import { getCategorySlugByName } from "@/lib/data/categories";

/**
 * Usage:
 *   <StoryCard
 *     story={{...}}
 *     showNewReplyFlag={unreadAuthorReplyStoryIds.has(story.id)}
 *   />
 *
 * showNewReplyFlag is a plain boolean, computed once per listing page
 * (see lib/supabase/notifications.js) and passed down per-card — kept
 * separate from the `story` prop shape so toCardProps() doesn't need to
 * know anything about notifications.
 *
 * Category in the kicker links to /category/[slug] when a matching
 * category exists in lib/data/categories.js — falls back to plain text
 * if there's no match, so unrecognized categories never 404.
 */
export default function StoryCard({ story, className = "", showNewReplyFlag = false }) {
  const { slug, title, excerpt, coverImage, category, location, author, authorSlug, tale, readTime } = story;
  const categorySlug = category ? getCategorySlugByName(category) : null;

  return (
    <article className={`${styles.card} rv ${className}`.trim()}>
      <Link href={`/stories/${slug}`} className={styles.imageLink} tabIndex={-1}>
        <div className={styles.imageWrap}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
              className={styles.image}
            />
          ) : null}
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
          <NewReplyFlag show={showNewReplyFlag} />
        </div>
        <h3 className={styles.title}>
          <Link href={`/stories/${slug}`}>{title}</Link>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <p className={styles.byline}>
          By{" "}
          <strong>
            {authorSlug ? <Link href={`/authors/${authorSlug}`}>{author}</Link> : author}
          </strong>
          {tale ? ` · ${tale}` : ""}
          {readTime ? ` · ${readTime} min read` : ""}
        </p>
      </div>
    </article>
  );
}