import Kicker from "@/components/ui/Kicker";
import styles from "./DestinationQA.module.css";

/**
 * qa: array from getDestinationQA() in lib/supabase/destinations.js —
 * [{ id, question, answer, storySlug, storyTitle }], or [] when no
 * author-reply threads exist yet for this region.
 *
 * Uses native <details>/<summary> per Style Reference §5 (same pattern as
 * FAQItem) rather than importing components/ui/FAQItem.jsx directly, since
 * that file's exact prop API wasn't available while building this —
 * swap this markup for <FAQItem /> later if you want a single shared
 * implementation.
 */
export default function DestinationQA({ qa, regionName }) {
  return (
    <section className={styles.wrap}>
      <div className="inner">
        <Kicker>Ask The Travelers</Kicker>
        <h2 className={styles.heading}>Questions readers asked about {regionName}</h2>

        {qa.length === 0 ? (
          <p className={styles.placeholder}>
            No verified answers yet — once travelers claim their tales and reply to reader
            questions, the best ones show up here.
          </p>
        ) : (
          <div className={styles.list}>
            {qa.map((item) => (
              <details key={item.id} className={styles.item}>
                <summary className={styles.summary}>
                  <span>{item.question}</span>
                  <span className={styles.marker} aria-hidden="true" />
                </summary>
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                  <a href={`/stories/${item.storySlug}`} className={styles.source}>
                    From "{item.storyTitle}"
                  </a>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
