import Link from "next/link";

const FOOTER_GROUPS = [
  {
    heading: "Explore",
    links: [
      { href: "/stories", label: "Stories" },
      { href: "/destinations", label: "Destinations" },
      { href: "/category", label: "Categories" },
      { href: "/locals-notes", label: "Local's Notes" },
    ],
  },
  {
    heading: "Contribute",
    links: [
      { href: "/submit", label: "Share your tale" },
      { href: "/locals-notes#share-a-tip", label: "Share a local's note" },
      { href: "/write-for-us", label: "Write for Us" },
      { href: "/#newsletter", label: "Newsletter" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/work-with-us", label: "Work With Us" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/editorial-guidelines", label: "Editorial Guidelines" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
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
        <Link className="btn btn-sun" href="/submit">
          Share your tale — free
        </Link>
      </div>
      <div className="foot-grid">
        <div className="foot-columns">
          {FOOTER_GROUPS.map((group) => (
            <div className="foot-col" key={group.heading}>
              <span className="foot-col-heading">{group.heading}</span>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <small>
        © {new Date().getFullYear()} The Trip Tales · Every tale belongs to its teller
      </small>
    </footer>
  );
}