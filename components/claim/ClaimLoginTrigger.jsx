"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import LoginModal from "@/components/auth/LoginModal";

/**
 * Reuses the site's existing LoginModal (typed OTP code, not a magic
 * link — see LoginModal.jsx's own comment for why) instead of a
 * separate claim-specific login form. LoginModal already handles
 * ensureProfile() and the display-name step internally, then does a
 * full page reload on success — which is exactly what we want here:
 * the claim page is a server component, so the reload re-runs it,
 * sees the now-authenticated session, and swaps to the confirm button
 * automatically. No token/redirect plumbing needed.
 */
export default function ClaimLoginTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="sun" type="button" onClick={() => setOpen(true)}>
        Log in to claim this tale
      </Button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
