import Image from "next/image";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Feature.module.css";

/**
 * Usage:
 *   <Feature
 *     kicker="Story of the week · Skardu, Pakistan"
 *     title="Snowed in at Shigar Fort with eleven strangers"
 *     quote={`"The road closed behind us at 4pm..."`}
 *     initials="HT"
 *     bylineText={<>Written by <b>Hamza T.</b> · his 2nd tale · 9 min read</>}
 *     ctaLabel="Read the full tale"
 *     ctaHref="/stories/shigar-fort"
 *     image={{ src: "...", alt: "..." }}
 *   />
 *
 * Uses the signature gold frame (.ttframe, global) — keep to 1-2 per page.
 */
export default function Feature({ kicker, title, quote, initials, bylineText, ctaLabel, ctaHref, image }) {
  return (
    <section className={`${styles.feature} ttframe`} id="feature">
      <div className={styles.media}>
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className={styles.mediaImg} />
      </div>
      <div className={styles.content}>
        <Kicker dark>{kicker}</Kicker>
        <h2 className={styles.title}>{title}</h2>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <div className={styles.byline}>
          <span className={styles.avatar}>{initials}</span>
          <span>{bylineText}</span>
        </div>
        <Button variant="sun" href={ctaHref}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
