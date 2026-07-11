import Kicker from "@/components/ui/Kicker";
import styles from "./ProofStats.module.css";

/**
 * Usage:
 *   <ProofStats
 *     kicker="Why travellers trust us"
 *     heading="Real people. Real roads. Real names on every story."
 *     stats={[
 *       { value: "120+", label: "true tales published" },
 *       { value: "38", label: "countries written from" },
 *       { value: "100%", label: "human-edited, zero AI-spun filler" },
 *       { value: "48h", label: "average reply to every submission" },
 *     ]}
 *     quotes={[
 *       { text: `"I'm not a writer..."`, who: "Daniyal M. · Published contributor" },
 *       { text: `"I read the Sunday Postcard..."`, who: "Ellie W. · Reader since 2026" },
 *     ]}
 *   />
 *
 * NOTE: stats above (120+, 38, 100%, 48h) are placeholder figures carried
 * over from the design reference — per Style Reference §9, replace with
 * real numbers (or softened copy) before launch.
 */
export default function ProofStats({ kicker, heading, stats = [], quotes = [] }) {
  return (
    <section className={styles.proof}>
      <div className="inner">
        <Kicker dark className="rv">
          {kicker}
        </Kicker>
        <h2 className={`${styles.heading} rv`}>{heading}</h2>

        <div className={styles.stats}>
          {stats.map((stat) => (
            <div className={`${styles.stat} rv`} key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.quotes}>
          {quotes.map((quote) => (
            <div className={`${styles.quote} rv`} key={quote.who}>
              <p>{quote.text}</p>
              <span className={styles.who}>{quote.who}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
