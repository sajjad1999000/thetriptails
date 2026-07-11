import Button from "@/components/ui/Button";
import styles from "./FinalCTA.module.css";

/**
 * In the design reference this banner ("Every trip leaves a tale...")
 * lives inside the <footer> tag. Since Footer.jsx is FIXED (Step C —
 * "build once, same on every page"), this is a separate homepage-only
 * section instead. Render it as the last thing in app/page.jsx, directly
 * before the site-wide <Footer /> from layout.jsx — same pine background,
 * same visual seam, no changes to the shared Footer component.
 */
export default function FinalCTA({ heading, body, ctaLabel, ctaHref }) {
  return (
    <div className={styles.cta}>
      <h2 className={styles.heading}>{heading}</h2>
      <p className={styles.body}>{body}</p>
      <Button variant="sun" href={ctaHref}>
        {ctaLabel}
      </Button>
    </div>
  );
}
