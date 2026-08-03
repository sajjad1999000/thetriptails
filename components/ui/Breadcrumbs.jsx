import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

/**
 * Usage:
 *   <Breadcrumbs items={[
 *     { label: "Home", href: "/" },
 *     { label: "Destinations", href: "/destinations" },
 *     { label: "Vietnam" }, // current page — no href
 *   ]} />
 *
 * Emits BreadcrumbList JSON-LD alongside the visible trail. Once
 * lib/seo/schema.js exists (Step N), this can call a shared
 * buildBreadcrumbSchema() helper instead of building it inline.
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: item.href }),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={styles.wrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href || item.label} className={styles.item}>
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className={styles.current}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
