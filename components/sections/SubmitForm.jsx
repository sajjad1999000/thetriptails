"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./SubmitForm.module.css";

/**
 * NOT WIRED TO SUPABASE YET — this is intentional at this build stage.
 * Per the Build Guide, Step J ("Submit Story form + Supabase wiring")
 * is where this component's handleSubmit gets replaced with a real
 * insert into the `submissions` table, plus the Part 3 security
 * checklist (server-side validation, rate limiting, honeypot, etc).
 *
 * Per Style Reference §8 ("Forms must be functionally wired — no fake
 * placeholders in final build"), do not ship this handler as-is to
 * production. It only exists so the homepage renders and behaves
 * reasonably in the meantime.
 */
export default function SubmitForm() {
  const [form, setForm] = useState({ name: "", email: "", where: "", tale: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    // TODO (Step J): replace with a real Supabase insert into `submissions`
    // (name, email, country/location, story text) + server-side validation.
    setTimeout(() => setStatus("sent"), 400);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.heading}>Start your tale</h3>
      <span className={styles.hand}>we read every single one ✍</span>

      <div className={styles.field}>
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" autoComplete="name" placeholder="Sara Khan" value={form.name} onChange={handleChange} required />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
      </div>
      <div className={styles.field}>
        <label htmlFor="where">Where did it happen?</label>
        <input id="where" type="text" placeholder="Hunza, Pakistan" value={form.where} onChange={handleChange} required />
      </div>
      <div className={styles.field}>
        <label htmlFor="tale">Your tale, in a few lines</label>
        <textarea id="tale" placeholder="It started when our bus broke down outside..." value={form.tale} onChange={handleChange} required />
      </div>

      <Button variant="sun" type="submit" className={styles.submitBtn} disabled={status === "sending"}>
        {status === "sent" ? "Sent! We reply within 48 hours ✓" : status === "sending" ? "Sending…" : "Send my story — free"}
      </Button>
      <small className={styles.fine}>No account needed · You keep full ownership of your story</small>
    </form>
  );
}
