import styles from "./NewReplyFlag.module.css";

/**
 * Purely presentational — sits on a StoryCard, shown or hidden based on
 * the `show` prop. The consuming page decides that via
 * useUnreadAuthorReplyStoryIds() (lib/hooks/useUnreadAuthorReplyStoryIds.js),
 * fetched once for the whole listing rather than per-card.
 *
 * Not absolutely positioned by default, since StoryCard's internal DOM
 * structure wasn't available while building this — drop it wherever
 * makes sense inside the card (e.g. next to the kicker), or wrap it in
 * `position: absolute` at the call site if you want it overlaid on the
 * image instead.
 */
export default function NewReplyFlag({ show }) {
  if (!show) return null;
  return <span className={styles.flag}>Author replied</span>;
}
