import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Partners.module.css";

export default function Partners({ kicker, heading, body, ctaLabel, ctaHref }) {
  return (
    <section className={styles.partners} id="partners">
      <div className={`inner ${styles.inner}`}>
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className={`${styles.heading} rv`}>{heading}</h2>
        <p className={`${styles.body} rv`}>{body}</p>
        <Button variant="pine" href={ctaHref} className="rv">
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
