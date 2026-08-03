"use client";
import AccountBadge from "../auth/AccountBadge";
export default function MobileNav({ open, links, onClose, onLoginClick }) {
  return (
    <div className={`sheet${open ? " open" : ""}`}>
      <span className="kicker">Menu</span>
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </a>
      ))}
      <div className="account-row">
        <AccountBadge onLoginClick={onLoginClick} />
      </div>
      <style jsx>{`
        .sheet{
          position:fixed;inset:0;background:var(--pine);z-index:80;
          display:flex;flex-direction:column;justify-content:center;
          padding:0 8vw;gap:.4rem;opacity:0;pointer-events:none;
          transition:opacity .3s;color:#fff;
        }
        .sheet.open{ opacity:1;pointer-events:auto; }
        .sheet a{
          font-family:var(--display);font-size:2rem;text-decoration:none;
          padding:.8rem 0;border-bottom:1px solid rgba(255,255,255,.12);
          display:block;color:#fff;
        }
        .sheet a:hover{ color:var(--sun); }
        .sheet .kicker{ color:var(--sun);margin-bottom:1.4rem; }
        .account-row{
          margin-top:1.4rem;padding-top:1rem;
          border-top:1px solid rgba(255,255,255,.12);
        }
      `}</style>
    </div>
  );
}