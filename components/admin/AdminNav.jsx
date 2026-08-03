// components/admin/AdminNav.jsx
// Top nav for every /admin/(protected) page. Shows which section
// is active and lets the admin log out.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Submissions', href: '/admin/submissions' },
  { label: 'New Story', href: '/admin/stories/new' },
  { label: 'All Stories', href: '/admin/stories' },
  { label: 'Locals Notes', href: '/admin/locals-notes' },
  { label: 'New Locals Note', href: '/admin/locals-notes/new' },
  { label: 'All Locals Notes', href: '/admin/locals-notes/library' },
  { label: 'Authors', href: '/admin/authors' },
  { label: 'Comments', href: '/admin/comments' },
  { label: 'Story of Week', href: '/admin/story-of-week' },
  { label: 'Note of Month', href: '/admin/note-of-month' },
];

export default function AdminNav({ adminEmail }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="admin-nav">
      <div className="admin-nav-inner">
        <div className="admin-nav-brand">
          <span className="admin-nav-kicker">— The Trip Tales</span>
          <span className="admin-nav-title">Admin</span>
        </div>

        <nav className="admin-nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-nav-account">
          <span className="admin-nav-email">{adminEmail}</span>
          <button onClick={handleLogout} className="admin-nav-logout">
            Log out
          </button>
        </div>

        <button
          className="admin-nav-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="admin-nav-mobile-panel">
          <nav className="admin-nav-mobile-links">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-mobile-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="admin-nav-mobile-account">
            <span className="admin-nav-email">{adminEmail}</span>
            <button onClick={handleLogout} className="admin-nav-logout">
              Log out
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-nav {
          background: var(--pine);
          border-bottom: 1px solid var(--line);
        }
        .admin-nav-inner {
          max-width: 1150px;
          margin: 0 auto;
          padding: 1.1rem 6vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-nav-brand {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .admin-nav-kicker {
          font-family: var(--body);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--sun);
        }
        .admin-nav-title {
          font-family: var(--display);
          font-size: 1.3rem;
          color: var(--cloud);
        }
        .admin-nav-links {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
        }
        :global(.admin-nav-link) {
          font-family: var(--body);
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        :global(.admin-nav-link:hover) {
          color: var(--cloud);
        }
        :global(.admin-nav-link.active) {
          color: var(--sun);
          border-bottom-color: var(--sun);
        }
        .admin-nav-account {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-nav-email {
          font-family: var(--body);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .admin-nav-logout {
          font-family: var(--body);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--cloud);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .admin-nav-logout:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .admin-nav-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .admin-nav-toggle span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--cloud);
          border-radius: 2px;
        }

        .admin-nav-mobile-panel {
          display: none;
        }

        @media (max-width: 640px) {
          .admin-nav-inner {
            flex-wrap: nowrap;
            padding: 0.9rem 5vw;
          }
          .admin-nav-links,
          .admin-nav-account {
            display: none;
          }
          .admin-nav-toggle {
            display: flex;
          }
          .admin-nav-mobile-panel {
            display: block;
            padding: 1rem 5vw 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
          }
          .admin-nav-mobile-links {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
            margin-bottom: 1rem;
          }
          :global(.admin-nav-mobile-link) {
            font-family: var(--body);
            font-size: 1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.75);
            text-decoration: none;
          }
          :global(.admin-nav-mobile-link.active) {
            color: var(--sun);
          }
          .admin-nav-mobile-account {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </header>
  );
}