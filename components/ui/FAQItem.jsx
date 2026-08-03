import styles from "./FAQItem.module.css";

/**
 * Usage: <FAQItem question="Do you pay for stories?" answer="Not yet — but every..." />
 *
 * On a page with several of these, assemble a matching FAQPage JSON-LD
 * block from the same question/answer list (see lib/seo/schema.js, Step N)
 * rather than duplicating schema logic per item.
 */
export default function FAQItem({ question, answer, defaultOpen = false }) {
  return (
    <details className={styles.item} open={defaultOpen}>
      <summary className={styles.summary}>
        <span className={styles.question}>{question}</span>
        <span className={styles.marker} aria-hidden="true" />
      </summary>
      <div className={styles.answer}>
        {typeof answer === "string" ? <p>{answer}</p> : answer}
      </div>
    </details>
  );
}
