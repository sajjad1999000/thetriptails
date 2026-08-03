import Kicker from "@/components/ui/Kicker";
import FAQItem from "@/components/ui/FAQItem";
import styles from "./FAQSection.module.css";

/**
 * Usage:
 *   <FAQSection
 *     kicker="Before you ask"
 *     heading="Everything travellers want to know."
 *     items={[{ question: "...", answer: "..." }, ...]}
 *   />
 */
export default function FAQSection({ kicker, heading, items = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className={styles.faq} id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className={`inner ${styles.inner}`}>
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className={`${styles.heading} rv`}>{heading}</h2>
        {items.map((item) => (
          <FAQItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
