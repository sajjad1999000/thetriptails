import Kicker from "@/components/ui/Kicker";
import styles from "./CostBreakdownBox.module.css";

/**
 * Trip Cost Breakdown — Style Reference §5/§8 compliant display box.
 *
 * Cost data is NOT collected at submission time (per decision: contributors
 * are asked for this during the Phase 2 claim flow, Step V, once they have
 * an account). Until a story is claimed and the author fills this in,
 * `costBreakdown` will be null/undefined and this component renders
 * nothing — safe to include unconditionally on every story page.
 *
 * Expects a single flattened object (see lib/data/stories.js for how the
 * raw Supabase array is reduced to this shape):
 *   { flights, stay, food, activities, totalPerDay, total, currency, notes }
 * All numeric fields are optional — only present ones are rendered.
 */
export default function CostBreakdownBox({ costBreakdown }) {
  if (!costBreakdown) return null;

  const { flights, stay, food, activities, totalPerDay, total, currency = "USD", notes } =
    costBreakdown;

  const lineItems = [
    { label: "Flights", value: flights },
    { label: "Stay / night", value: stay },
    { label: "Food / day", value: food },
    { label: "Activities", value: activities },
  ].filter((item) => item.value != null);

  const hasHeadline = totalPerDay != null || total != null;

  // Nothing at all to show (e.g. a row exists but every field is null) —
  // still bail out rather than rendering an empty shell.
  if (lineItems.length === 0 && !hasHeadline && !notes) return null;

  let formatter;
  try {
    formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  } catch {
    // Falls back gracefully if `currency` is ever an unrecognized code.
    formatter = { format: (n) => `${currency} ${n}` };
  }

  return (
    <div className={styles.box}>
      <Kicker>Trip Cost</Kicker>
      <h3 className={styles.heading}>What this trip actually cost</h3>

      {hasHeadline && (
        <div className={styles.headline}>
          {totalPerDay != null && (
            <div className={styles.headlineStat}>
              <span className={styles.headlineValue}>{formatter.format(totalPerDay)}</span>
              <span className={styles.headlineLabel}>per day</span>
            </div>
          )}
          {total != null && (
            <div className={styles.headlineStat}>
              <span className={styles.headlineValue}>{formatter.format(total)}</span>
              <span className={styles.headlineLabel}>total trip</span>
            </div>
          )}
        </div>
      )}

      {lineItems.length > 0 && (
        <ul className={styles.lineList}>
          {lineItems.map((item) => (
            <li key={item.label} className={styles.lineItem}>
              <span className={styles.lineLabel}>{item.label}</span>
              <span className={styles.lineValue}>{formatter.format(item.value)}</span>
            </li>
          ))}
        </ul>
      )}

      {notes && <p className={styles.notes}>{notes}</p>}
    </div>
  );
}
