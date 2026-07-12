import Link from "next/link";
import Kicker from "@/components/ui/Kicker";
import { getAllCategories } from "@/lib/data/categories";
import styles from "./CategoryTeaser.module.css";

export default function CategoryTeaser() {
  const categories = getAllCategories();

  return (
    <section className={styles.section}>
      <div className={`inner ${styles.inner}`}>
        <div className={`rv ${styles.intro}`}>
          <Kicker>Browse by mood</Kicker>
          <h2>
            Not sure where to start? <em>Pick a kind of story.</em>
          </h2>
        </div>

        <div className={`rv ${styles.pillRow}`}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`btn btn-pine ${styles.pill}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
