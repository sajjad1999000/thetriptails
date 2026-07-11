import Kicker from "@/components/ui/Kicker";
import SubmitForm from "./SubmitForm";
import styles from "./Share.module.css";

/**
 * Usage:
 *   <Share
 *     kicker="Your turn"
 *     heading="That story you always tell at dinner? Publish it."
 *     lede="You don't need to be a writer..."
 *     steps={[
 *       { title: "Send us your tale", body: "..." },
 *       { title: "We polish it together", body: "..." },
 *       { title: "Your name in lights", body: "..." },
 *     ]}
 *   />
 */
export default function Share({ kicker, heading, lede, steps = [] }) {
  return (
    <section className={styles.share} id="share">
      <div className={`inner ${styles.grid}`}>
        <div>
          <Kicker className="rv">{kicker}</Kicker>
          <h2 className="rv">{heading}</h2>
          <p className={`lede rv`}>{lede}</p>
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div className={`${styles.step} rv`} key={step.title}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rv">
          <SubmitForm />
        </div>
      </div>
    </section>
  );
}
