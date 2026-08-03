import Kicker from "@/components/ui/Kicker";
import styles from "./Solution.module.css";

export default function Solution({ kicker, heading, lede }) {
  return (
    <section className={styles.solution}>
      <div className="inner">
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className="rv">{heading}</h2>
        <p className={`lede rv`}>{lede}</p>
      </div>
    </section>
  );
}
