// app/admin/(protected)/layout.jsx
//
// IMPORTANT — folder structure note:
// This file lives inside a route group called (protected).
// That means the real URLs are still /admin, /admin/submissions, etc.
// (route group folders in parentheses don't appear in the URL) —
// but /admin/login lives OUTSIDE this group, so it never gets gated.
//
// Folder layout should look like:
//
//   app/admin/
//   ├── login/
//   │   └── page.jsx          <- NOT gated (this is where you land if not logged in)
//   └── (protected)/
//       ├── layout.jsx        <- THIS FILE — gates everything inside it
//       ├── page.jsx          <- dashboard (was app/admin/page.jsx)
//       ├── submissions/
//       ├── authors/
//       ├── comments/
//       └── featured/
//
// This avoids a redirect loop: unauthenticated visitor hits any
// protected page -> redirected to /admin/login -> login page loads
// fine because it's outside the (protected) group.

import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/admin-auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function ProtectedAdminLayout({ children }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell">
      <AdminNav adminEmail={admin.email} />
      <main className="admin-content">{children}</main>
    </div>
  );
}