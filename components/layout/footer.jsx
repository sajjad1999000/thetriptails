const FOOTER_LINKS = [
  { href: "/stories", label: "Stories" },
  { href: "/submit", label: "Share your tale" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/partners", label: "Partnerships" },
  { href: "/newsletter", label: "Newsletter" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-cta">
        <h2>
          Every trip leaves a tale.
          <br />
          Don&apos;t let yours end at the dinner table.
        </h2>
        <p>It takes five minutes to start. It stays published forever.</p>
        <a className="btn btn-sun" href="/submit">
          Share your tale — free
        </a>
      </div>

      <div className="foot-grid">
        <a className="logo foot-logo" href="/">
          <span className="logo-mark" aria-hidden="true" />
          The Trip Tails
        </a>
        <ul className="foot-links">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>

      <small>
        © {new Date().getFullYear()} The Trip Tails · Every tale belongs to its teller
      </small>
    </footer>
  );
}