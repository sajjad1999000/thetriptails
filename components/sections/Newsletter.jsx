"use client";

import { useState } from "react";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Newsletter.module.css";
import { subscribeNewsletter } from "@/lib/actions/subscribeNewsletter";

export default function Newsletter({ kicker, heading, body, fineprint }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const result = await subscribeNewsletter(email);

    if (result.success) {
      setStatus("sent");
    } else {
      setStatus("idle");
      setError(result.error || "Something went wrong. Try again.");
    }
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
          <Button variant="forest" type="submit" disabled={status === "sending" || status === "sent"}>
            {status === "sent" ? "You're in — see you Sunday ✓" : status === "sending" ? "Sending…" : "Send me postcards"}
          </Button>
        </form>
        {error && <small className={styles.error}>{error}</small>}
        <small className={`${styles.fine} rv`}>{fineprint}</small>
      </div>
    </section>
  );
}