import Image from "next/image";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

/**
 * Usage:
 *   <Hero
 *     kicker="True stories · told by travellers"
 *     titleLines={[
 *       [{ text: "You came back " }, { text: "different.", em: true }],
 *       [{ text: "That's the story." }],
 *     ]}
 *     subtitle={<>Every week, real travellers publish the tales they used to
 *       tell only at dinner. <b>This week's tale begins in a snowstorm in Skardu.</b></>}
 *     ctaLabel="Read this week's tale"
 *     ctaHref="#feature"
 *     image={{ src: "...", alt: "..." }}
 *   />
 *
 * titleLines is an array of lines; each line is an array of {text, em?}
 * segments, rendered with a <br> between lines (matches the reference's
 * "You came back <em>different.</em><br>That's the story.").
 */
export default function Hero({ kicker, titleLines = [], subtitle, ctaLabel, ctaHref, image }) {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.media}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className={styles.mediaImg}
        />
      </div>
      <div className={styles.content}>
        <Kicker dark>{kicker}</Kicker>
        <h1 className={styles.title}>
          {titleLines.map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line.map((seg, segIndex) =>
                seg.em ? <em key={segIndex}>{seg.text}</em> : <span key={segIndex}>{seg.text}</span>
              )}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <Button variant="sun" href={ctaHref}>
          {ctaLabel}
        </Button>
      </div>
      <span className={styles.scrollcue} aria-hidden="true">
        Scroll ↓
      </span>
    </section>
  );
}
