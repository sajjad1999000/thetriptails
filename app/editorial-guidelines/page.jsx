import Kicker from "@/components/ui/Kicker";
import styles from "./page.module.css";

export const metadata = {
  title: "Editorial Guidelines — The Trip Tails",
  description: "What we publish, how we edit, and the standards every tale meets before it goes live.",
};

export default function EditorialGuidelinesPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`inner ${styles.heroInner}`}>
          <Kicker>Legal</Kicker>
          <h1>Editorial Guidelines</h1>
          <p className="lede">Last updated: [DATE — set before launch]</p>
        </div>
      </section>

      <section className={styles.body}>
        <article className={`inner ${styles.article}`}>
          <h2>1. What we publish</h2>
          <p>
            True, first-person travel stories written by the person who lived them. Solo trips,
            family chaos, budget wins, glorious disasters, small kindnesses from strangers — any
            country, any budget, any style of travel.
          </p>

          <h2>2. What we don't publish</h2>
          <ul>
            <li>Fiction, or stories embellished beyond what actually happened</li>
            <li>AI-generated writing, in whole or in significant part</li>
            <li>Promotional content dressed up as a personal story</li>
            <li>Content that endangers, exploits, or misrepresents another person or place</li>
          </ul>

          <h2>3. Locals' Notes</h2>
          <p>
            Alongside traveller tales, we publish Locals' Notes — short, practical pieces from
            people who live in or near a destination, offering the kind of insight a visitor
            wouldn't know to ask for. These are held to the same truthfulness standard as tales,
            but are typically shorter and more practical in tone.
          </p>

          <h2>4. Editing process</h2>
          <p>
            Every submission is reviewed by an editor. We tighten structure, fix clarity issues,
            and occasionally suggest cuts — but we never rewrite your voice into ours. You
            approve every substantive change before anything goes live.
          </p>

          <h2>5. Trip cost information</h2>
          <p>
            When a contributor includes a cost breakdown, we publish it as self-reported and
            time-stamped to when the trip happened. We don't verify prices against current rates
            — readers should treat these as one traveller's real experience, not a live quote.
          </p>

          <h2>6. Comment moderation standards</h2>
          <p>
            Comments are reviewed against our{" "}
            <a href="/terms" className={styles.link}>
              Terms of Service
            </a>
            . We remove comments that are false, harassing, hateful, or spam. Verified authors
            may block individual readers from their own story's comment thread — we don't
            second-guess that judgment, since it's their story and their space to protect.
          </p>

          <h2>7. Verified badges</h2>
          <p>
            "Verified" and "Top Storyteller" badges are awarded editorially, based on story
            quality, consistency, and positive engagement with the community — not on posting
            volume alone. Badges can be revoked if a contributor's conduct no longer reflects our
            standards.
          </p>

          <h2>8. Story of the Week / Month / Year</h2>
          <p>
            Story of the Week and Story of the Month are chosen by our editorial team based on
            writing quality, originality, and reader engagement. Story of the Year combines
            editorial judgment with a reader vote — see our{" "}
            <a href="/terms" className={styles.link}>
              Terms of Service
            </a>{" "}
            for voting rules.
          </p>

          <h2>9. Corrections</h2>
          <p>
            If a factual error is identified after publication, we correct it and, where
            material, note the correction. If you spot an error in a published tale, email{" "}
            <a href="mailto:editorial@thetriptails.com" className={styles.link}>
              editorial@thetriptails.com
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
