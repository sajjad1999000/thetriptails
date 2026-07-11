"use client";

import { useEffect } from "react";

/**
 * Mount once — e.g. in app/layout.jsx (site-wide) or at the top of
 * app/page.jsx (homepage-only). Renders nothing; just wires up the
 * observer described in the Style Reference, section 6.
 *
 * Requires .rv / .rv.in to exist as GLOBAL classes in app/globals.css
 * (not CSS Modules — the section components below reference the plain
 * string "rv" on purpose, same as StoryCard from Step D). If Step B's
 * globals.css doesn't have these yet, add:
 *
 *   .rv{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
 *   .rv.in{opacity:1;transform:none}
 *   @media (prefers-reduced-motion: reduce){
 *     .rv{opacity:1;transform:none;transition:none}
 *   }
 */
export default function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".rv").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
