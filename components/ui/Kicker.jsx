import styles from "./Kicker.module.css";

/**
 * Small eyebrow label above headings.
 * Usage: <Kicker>Solo Travel · Vietnam</Kicker>
 *        <Kicker dark>On the road</Kicker>   (for use on --pine / photo backgrounds)
 */
export default function Kicker({ children, dark = false, as: Tag = "p", className = "" }) {
  return (
    <Tag className={`${styles.kicker} ${dark ? styles.dark : ""} ${className}`.trim()}>
      — {children}
    </Tag>
  );
}
