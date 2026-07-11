import Image from "next/image";
import Kicker from "@/components/ui/Kicker";
import styles from "./About.module.css";

/**
 * Usage:
 *   <About
 *     kicker="Behind The Trip Tails"
 *     heading="It started with a story nobody wrote down."
 *     paragraphs={[<>On a night bus... <b>Nobody ever wrote it down.</b></>, ...]}
 *     signature="The Trip Tails team"
 *     signatureRole="Editorial · Est. 2026"
 *     image={{ src: "...", alt: "..." }}
 *   />
 *
 * Uses the signature gold frame (.ttframe, global). This is the second
 * use on the page (after Feature) — keep the running total to 1-2.
 */
export default function About({ kicker, heading, paragraphs = [], signature, signatureRole, image }) {
  return (
    <section className={styles.about} id="about">
      <div className={`inner ${styles.grid}`}>
        <div className={`${styles.photo} ttframe rv`}>
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 40vw" className={styles.photoImg} />
        </div>
        <div>
          <Kicker className="rv">{kicker}</Kicker>
          <h2 className="rv">{heading}</h2>
          {paragraphs.map((p, i) => (
            <p className={`${styles.copy} rv`} key={i}>
              {p}
            </p>
          ))}
          <span className={`${styles.sig} rv`}>
            — {signature}
            <span className={styles.sigRole}>{signatureRole}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
