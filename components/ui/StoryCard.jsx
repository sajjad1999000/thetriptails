import Link from "next/link";
import Image from "next/image";
import Kicker from "./Kicker";
import styles from "./StoryCard.module.css";
import { getCategorySlugByName } from "@/lib/data/categories";

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
 * Emits BreadcrumbList JSON-LD alongside the visible trail. Once
 * lib/seo/schema.js exists (Step N), this can call a shared
 * buildBreadcrumbSchema() helper instead of building it inline.
 *
 * Category in the kicker links to /category/[slug] when a matching
 * category exists in lib/data/categories.js — falls back to plain text
 * if there's no match, so unrecognized categories never 404.
 */
export default function StoryCard({ story, className = "" }) {
  const { slug, title, excerpt, coverImage, category, location, author, authorSlug, tale, readTime } = story;
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
        </div>
      </Link>
      <div className={styles.body}>
        <Kicker className={styles.kicker}>
          {categorySlug ? (
            <Link href={`/category/${categorySlug}`}>{category}</Link>
          ) : (
            category
          )}
          {location ? ` · ${location}` : ""}
        </Kicker>
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
