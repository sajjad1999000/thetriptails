import Link from "next/link";
import Image from "next/image";
import Kicker from "./Kicker";
import styles from "./StoryCard.module.css";

/**
 * Usage:
 *   <StoryCard story={{
 *     slug: "monsoon-in-hoi-an",
 *     title: "Monsoon in Hoi An",
 *     excerpt: "The lanterns didn't stop glowing, even soaked through.",
 *     coverImage: "/images/stories/hoi-an.jpg",
 *     category: "Solo Travel",
 *     location: "Vietnam",
 *     author: "Amara Reyes",
 *     tale: "3rd tale",
 *     readTime: 6,
 *   }} />
 *
 * Add `.rv` (scroll-reveal, Style Reference §6) to each StoryCard's parent
 * grid item or rely on this component's own `.rv` class — just make sure
 * the page sets up the shared IntersectionObserver once (not per card).
 */
export default function StoryCard({ story, className = "" }) {
  const { slug, title, excerpt, coverImage, category, location, author, tale, readTime } = story;

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
        </div>
      </Link>
      <div className={styles.body}>
        <Kicker className={styles.kicker}>
          {category}
          {location ? ` · ${location}` : ""}
        </Kicker>
        <h3 className={styles.title}>
          <Link href={`/stories/${slug}`}>{title}</Link>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <p className={styles.byline}>
          By <strong>{author}</strong>
          {tale ? ` · ${tale}` : ""}
          {readTime ? ` · ${readTime} min read` : ""}
        </p>
      </div>
    </article>
  );
}
