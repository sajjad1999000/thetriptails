"use client";

import { useEffect, useState } from "react";
import styles from "./DestinationStats.module.css";

const FIELDS = [
  { key: "totalPerDay", label: "Avg. per day", highlight: true },
  { key: "total", label: "Avg. total trip", highlight: true },
  { key: "flights", label: "Avg. flights" },
  { key: "stay", label: "Avg. stay / night" },
  { key: "food", label: "Avg. food / day" },
  { key: "activities", label: "Avg. activities" },
];

const CACHE_KEY = "tt-currency-cache-v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — avoids re-hitting both free
// APIs on every region page visit within the same session.

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(currency, rate) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ currency, rate, savedAt: Date.now() })
    );
  } catch {
    // sessionStorage can throw in private/incognito modes with strict
    // settings — conversion still works for this page load, just won't
    // be cached for the next one. Not worth surfacing to the visitor.
  }
}

/**
 * All averages arrive from the server in USD (see
 * lib/supabase/destinations.js — only USD submissions are averaged).
 * This component is the display-only layer that converts those USD
 * figures into the visitor's likely local currency, best-effort.
 *
 * Both ipapi.co (currency detection) and open.er-api.com (exchange
 * rates) are free, keyless, third-party services with no uptime
 * guarantee — any failure here just leaves the numbers in USD rather
 * than showing an error, since this is a convenience layer, not core
 * functionality.
 */
export default function DestinationStatsGrid({ stats }) {
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [rate, setRate] = useState(1);
  const [converting, setConverting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function detectAndConvert() {
      const cached = readCache();
      if (cached) {
        if (!cancelled) {
          setDisplayCurrency(cached.currency);
          setRate(cached.rate);
          setConverting(false);
        }
        return;
      }

      try {
        const currencyRes = await fetch("https://ipapi.co/currency/");
        if (!currencyRes.ok) throw new Error("currency lookup failed");
        const visitorCurrency = (await currencyRes.text()).trim();

        if (!visitorCurrency || visitorCurrency === "USD") {
          writeCache("USD", 1);
          if (!cancelled) setConverting(false);
          return;
        }

        const ratesRes = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!ratesRes.ok) throw new Error("rates fetch failed");
        const ratesData = await ratesRes.json();
        const foundRate = ratesData?.rates?.[visitorCurrency];

        if (foundRate) {
          writeCache(visitorCurrency, foundRate);
          if (!cancelled) {
            setDisplayCurrency(visitorCurrency);
            setRate(foundRate);
          }
        }
      } catch {
        // Silent fallback to USD — see file-level comment.
      } finally {
        if (!cancelled) setConverting(false);
      }
    }

    detectAndConvert();
    return () => {
      cancelled = true;
    };
  }, []);

  function formatValue(usdValue) {
    const converted = usdValue * rate;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: displayCurrency,
        maximumFractionDigits: 0,
      }).format(converted);
    } catch {
      return `${displayCurrency} ${Math.round(converted)}`;
    }
  }

  return (
    <>
      <div className={styles.grid}>
        {FIELDS.map(
          ({ key, label, highlight }) =>
            stats[key] != null && (
              <div
                key={key}
                className={highlight ? styles.statCardHighlight : styles.statCard}
              >
                <span className={highlight ? styles.statValueHighlight : styles.statValue}>
                  {formatValue(stats[key])}
                </span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            )
        )}
      </div>
      <p className={styles.caveat}>
        Based on {stats.sampleSize} traveler-reported{" "}
        {stats.sampleSize === 1 ? "budget" : "budgets"}, originally in USD
        {!converting && displayCurrency !== "USD" && (
          <> · converted to {displayCurrency} at today's rate, for reference only</>
        )}
        .
      </p>
    </>
  );
}
