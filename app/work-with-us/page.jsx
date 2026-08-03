import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./WorkWithUs.module.css";

export const metadata = {
  title: "Work With Us — The Trip Tales",
  description:
    "Real stories, real reach, never banner ads. Partner story features, newsletter sponsorships, and what's coming next for brands and tourism boards working with The Trip Tales.",
};

const AVAILABLE_NOW = [
  {
    title: "Partner Stories",
    body: "A real traveller's tale about your destination or product — same byline, same editorial care as every organic story. Clearly disclosed as a partnership, never disguised as organic content.",
  },
  {
    title: "Newsletter sponsorship",
    body: "A single sponsor line in The Sunday Postcard — reaches people who already read every issue, not scroll-past inbox noise.",
  },
];

const COMING_SOON = [
  {
    title: "Destination intelligence reports",
    body: "Aggregated, anonymized traveller data — real costs, real questions — pulled from destination pages. Insight tourism boards can't get anywhere else.",
  },
  {
    title: "Verified contributor program",
    body: "A recognized tier for trusted travel writers, with priority review and expanded author pages.",
  },
  {
    title: "Trip Essentials (disclosed affiliate)",
    body: "A narrow, curated set of gear, insurance, and eSIM recommendations, traveller-to-traveller — never wall-to-wall booking links.",
  },
  {
    title: "Reader membership",
    body: "A way for loyal readers to directly support independent, human-written travel journalism.",
  },
];

export default function WorkWithUsPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className="inner" style={{ maxWidth: "740px" }}>
          <Kicker className="rv">Work with The Trip Tales</Kicker>
          <h1 className="rv">Real stories. Real reach. Never banner ads.</h1>
          <p className={`lede rv ${styles.lede}`}>
            Every partnership on this site follows the same disclosure-first
            approach used across every published story — real travellers,
            real bylines, and a clear label whenever a brand is involved.
            Nothing here is dressed up to look like something it isn&apos;t.
          </p>
        </div>
      </section>

      <section className={styles.cardsSection}>
        <div className="inner">
          <Kicker className="rv">Available now</Kicker>
          <h2 className="rv">Ways to work together today.</h2>
          <div className={styles.cardGrid}>
            {AVAILABLE_NOW.map((item) => (
              <div className={`${styles.card} rv`} key={item.title}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.cardsSection} ${styles.comingSoonSection}`}>
        <div className="inner">
          <Kicker className="rv">On the roadmap</Kicker>
          <h2 className="rv">Coming soon.</h2>
          <div className={styles.cardGrid}>
            {COMING_SOON.map((item) => (
              <div className={`${styles.card} ${styles.cardSoon} rv`} key={item.title}>
                <span className={styles.soonTag}>Phase 3</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={`inner ${styles.ctaInner}`}>
          <h2 className="rv">Have something in mind already?</h2>
          <p className={`rv ${styles.ctaLede}`}>
            Reply to every inquiry personally — no account managers, no
            templated responses. Tell me what you&apos;re thinking and
            I&apos;ll get back to you directly.
          </p>
          <Button
            variant="sun"
            href="mailto:partnerships@thetriptails.com"
            className="rv"
          >
            Start a conversation
          </Button>
        </div>
      </section>
    </>
  );
}