import Kicker from "@/components/ui/Kicker";
import styles from "./Contact.module.css";

export const metadata = {
  title: "Contact — The Trip Tails",
  description: "Get in touch with The Trip Tails — questions, stories, and partnership enquiries all go to one honest inbox.",
};

const REASONS = [
  {
    title: "Got a story to tell?",
    body: "Skip the inbox and send it straight in — it only takes a few minutes.",
    cta: { href: "/submit", label: "Share your tale" },
  },
  {
    title: "Brand or tourism board?",
    body: "See how story-led partnerships work before reaching out.",
    cta: { href: "/advertise", label: "Read about partnerships" },
  },
  {
    title: "Everything else",
    body: "Questions, feedback, a correction, or just to say hi — this is the one inbox for all of it.",
    cta: {
      href: "mailto:info.thetriptails@gmail.com",
      label: "info.thetriptails@gmail.com",
    },
  },
];

export default function ContactPage() {
  return (
    <section className={styles.contact}>
      <div className="inner" style={{ maxWidth: "780px" }}>
        <Kicker className="rv">Get in touch</Kicker>
        <h1 className="rv">One inbox. I read all of it myself.</h1>
        <p className={`lede rv ${styles.lede}`}>
          There&apos;s no support team or ticket queue here — just me,
          reading every email that comes in. I try to reply within 48
          hours.
        </p>

        <div className={styles.cards}>
          {REASONS.map((r) => (
            <div key={r.title} className={`rv ${styles.card}`}>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <a className={styles.link} href={r.cta.href}>
                {r.cta.label} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}