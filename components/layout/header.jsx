"use client";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";

const NAV_LINKS = [
  { href: "/stories", label: "Stories" },
  { href: "/destinations", label: "Destinations" },
  { href: "/submit", label: "Share your tale" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header className={`nav${solid ? " solid" : ""}`}>
        <a className="logo" href="/">
          <span className="logo-mark" aria-hidden="true" />
          The Trip Tails
        </a>

        <ul className="navlinks">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <button
          className={`burger${menuOpen ? " x" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </header>

      <MobileNav
        open={menuOpen}
        links={NAV_LINKS}
        onClose={() => setMenuOpen(false)}
      />

      <style jsx>{`
        .nav{
          position:fixed;top:0;left:0;right:0;z-index:90;
          display:flex;align-items:center;justify-content:space-between;
          padding:.8rem 5vw;transition:.35s;
          background:linear-gradient(rgba(23,59,46,.55),transparent);
        }
        .nav.solid{
          background:rgba(246,248,242,.95);
          backdrop-filter:blur(12px);
          box-shadow:0 1px 0 var(--line);
        }
        .logo{
          font-family:var(--display);font-size:1.22rem;text-decoration:none;
          display:flex;align-items:center;gap:.55rem;min-height:48px;
          color:#fff;transition:color .3s;
        }
        .nav.solid .logo{ color:var(--pine); }
        .logo-mark{
          width:26px;height:34px;border:2px solid var(--sun);
          display:inline-block;flex-shrink:0;
        }
        .navlinks{ display:none; list-style:none; }
        .burger{
          display:flex;flex-direction:column;justify-content:center;gap:5px;
          background:none;border:none;cursor:pointer;
          min-width:48px;min-height:48px;align-items:center;
        }
        .burger span{ width:24px;height:2px;background:#fff;transition:.3s; }
        .nav.solid .burger span{ background:var(--pine); }
        .burger.x span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
        .burger.x span:nth-child(2){ opacity:0; }
        .burger.x span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }

        @media (min-width:768px){
          .navlinks{
            display:flex;gap:2rem;align-items:center;
          }
          .navlinks a{
            text-decoration:none;font-size:.9rem;font-weight:500;
            color:#fff;opacity:.9;min-height:48px;display:inline-flex;
            align-items:center;text-shadow:0 1px 6px rgba(0,0,0,.3);
          }
          .nav.solid .navlinks a{ color:var(--pine); text-shadow:none; }
          .navlinks a:hover{ opacity:1; color:var(--sun); }
          .nav.solid .navlinks a:hover{ color:var(--ocean); }
          .burger{ display:none; }
        }
      `}</style>
    </>
  );
}