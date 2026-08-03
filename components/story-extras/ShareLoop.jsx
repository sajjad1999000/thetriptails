"use client";

import { useState } from "react";
import styles from "./ShareLoop.module.css";

/**
 * Standard share row: WhatsApp, X/Twitter, email, and copy-link.
 * No account/reader data needed — pure client-side, works anywhere the
 * story URL is known.
 */
export default function ShareLoop({ url, title }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in some contexts (older browsers, non-HTTPS
      // in dev) — fail silently rather than showing an error for a
      // convenience feature.
    }
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Share this tale</span>
      <div className={styles.row}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pill}
          >
            {link.label}
          </a>
        ))}
        <button type="button" onClick={handleCopy} className={styles.pill}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
