import styles from "./Badge.module.css";

const TONES = {
  neutral: styles.neutral, // default — mist bg, grey text (e.g. "Draft")
  ocean: styles.ocean,     // e.g. category tags
  sun: styles.sun,         // e.g. "Featured", "Editor's Pick"
  pine: styles.pine,       // solid — e.g. "Published"
};

/**
 * Usage: <Badge tone="sun">Editor's Pick</Badge>
 *        <Badge tone="ocean">Budget Travel</Badge>
 */
export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span className={`${styles.badge} ${TONES[tone] || TONES.neutral} ${className}`.trim()}>
      {children}
    </span>
  );
}
