"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Style Reference §6 — Scroll-reveal pattern.
// Watches every .rv element on the page and adds .in when it enters viewport.
// Must run on every route change since Next swaps page content in place
// without remounting this component — usePathname() forces that rerun.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const els = document.querySelectorAll(".rv:not(.in)");
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}