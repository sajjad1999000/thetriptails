import Kicker from "@/components/ui/Kicker";
import styles from "./Problem.module.css";

/**
 * Usage:
 *   <Problem
 *     kicker="The problem with travel content"
 *     parts={[
 *       { text: `"Top 10 things to do in Lisbon" has been written`, tone: "dim" },
 *       { text: "40,000 times." },
 *       { text: "Your night lost in Alfama with a guitarist named Rui —", tone: "dim" },
 *       { text: "exactly once.", tone: "lit" },
 *       { text: "And right now it lives only in your head.", tone: "dim" },
 *     ]}
 *   />
 */
export default function Problem({ kicker, parts = [] }) {
  return (
    <section className={styles.problem}>
      <div className="inner">
        <Kicker className="rv">{kicker}</Kicker>
        <p className={`${styles.statement} rv`}>
          {parts.map((part, i) => (
            <span
              key={i}
              className={part.tone === "dim" ? styles.dim : part.tone === "lit" ? styles.lit : undefined}
            >
              {part.text}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
