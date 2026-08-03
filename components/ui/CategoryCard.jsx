import Link from "next/link";
import styles from "./CategoryCard.module.css";

// Crossfading photo stack. 1 image = static. 2 or 3 images = auto-cycle,
// pauses on hover so people can actually look before clicking through.
export default function CategoryCard({ category, count }) {
  const images = category.images || [];
  const n = images.length;
  const slotSeconds = 4.5;
  const duration = n > 1 ? n * slotSeconds : 0;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`rv ${styles.card}`}
    >
      <div className={styles.photoStack}>
        {images.map((src, i) => (
          <div
            key={src}
            className={`${styles.photoLayer} ${n === 2 ? styles.fade2 : n === 3 ? styles.fade3 : ""}`}
            style={{
              backgroundImage: `url(${src})`,
              animationDuration: n > 1 ? `${duration}s` : undefined,
              animationDelay: n > 1 ? `${i * slotSeconds}s` : undefined,
              opacity: n === 1 ? 1 : undefined,
              zIndex: n === 1 ? 1 : undefined,
            }}
          />
        ))}
        <div className={styles.scrim} />
      </div>

      <div className={styles.body}>
        <span className={styles.count}>
          {count} {count === 1 ? "tale" : "tales"}
        </span>
        <h3 className={styles.title}>{category.name}</h3>
        <p className={styles.blurb}>{category.blurb}</p>
      </div>
    </Link>
  );
}