import Image from "next/image";
import styles from "./NatureBand.module.css";

/**
 * Usage:
 *   <NatureBand
 *     image={{ src: "...", alt: "Turquoise ocean meeting a white sand beach" }}
 *     quote={`"The sea doesn't care about your itinerary. That's why we love it."`}
 *     attribution="from a tale sent in from the Azores"
 *   />
 */
export default function NatureBand({ image, quote, attribution }) {
  return (
    <div className={styles.band}>
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className={styles.bandImg} />
      <div className={`${styles.quoteWrap} rv`}>
        <p className={styles.quote}>{quote}</p>
        <span className={styles.attribution}>— {attribution}</span>
      </div>
    </div>
  );
}
