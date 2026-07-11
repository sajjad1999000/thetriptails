"use client";

import { useState } from "react";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Newsletter.module.css";

/**
 * Same placeholder-handler caveat as SubmitForm.jsx: this posts nowhere
 * yet. Wire it to your actual list provider (or the Supabase table from
 * Step J) before launch — see Style Reference §8.
 */
export default function Newsletter({ kicker, heading, body, fineprint }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to real newsletter/list provider or Supabase.
    setTimeout(() => setStatus("sent"), 400);
  }

  return (
    <section className={styles.news} id="newsletter">
      <div className="inner">
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className={`${styles.heading} rv`}>{heading}</h2>
        <p className={`${styles.body} rv`}>{body}</p>
        <form className={`${styles.form} rv`} onSubmit={handleSubmit}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button variant="forest" type="submit" disabled={status === "sending"}>
            {status === "sent" ? "You're in — see you Sunday ✓" : status === "sending" ? "Sending…" : "Send me postcards"}
          </Button>
        </form>
        <small className={`${styles.fine} rv`}>{fineprint}</small>
      </div>
    </section>
  );
}
