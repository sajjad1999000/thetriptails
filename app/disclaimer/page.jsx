import Kicker from "@/components/ui/Kicker";
import styles from "./page.module.css";

export const metadata = {
  title: "Disclaimer — The Trip Tails",
  description: "Important context on how to read the content published on The Trip Tails.",
};

export default function DisclaimerPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`inner ${styles.heroInner}`}>
          <Kicker>Legal</Kicker>
          <h1>Disclaimer</h1>
          <p className="lede">Last updated: [DATE — set before launch]</p>
        </div>
      </section>

      <section className={styles.body}>
        <article className={`inner ${styles.article}`}>
          <h2>1. Not travel advice</h2>
          <p>
            Stories on The Trip Tails describe one traveller's real experience. They aren't
            professional travel advice, safety guarantees, or a substitute for checking current
            government travel advisories, visa requirements, or local conditions before you
            travel.
          </p>

          <h2>2. Trip cost figures</h2>
          <p>
            Cost breakdowns (flights, accommodation, food, daily spend) are self-reported by the
            traveller and reflect prices at the time of their trip, not current rates. Prices
            change — always check current pricing directly with the relevant provider before
            budgeting your own trip.
          </p>

          <h2>3. Destination statistics</h2>
          <p>
            Averaged destination stats (e.g. "average daily spend in Vietnam") are calculated
            from the pool of cost breakdowns contributors have submitted for that destination.
            They're a useful signal, not a guarantee — sample sizes vary, and your own costs may
            differ significantly.
          </p>

          <h2>4. Reader comments and Locals' Notes</h2>
          <p>
            Comments and Locals' Notes reflect the opinions of the individual readers or locals
            who posted them, not the views of The Trip Tails. We moderate for our community
            standards, but we don't verify every factual claim made in a comment.
          </p>

          <h2>5. External links</h2>
          <p>
            Stories and comments may link to external sites. We're not responsible for the
            content, accuracy, or practices of any site we don't control.
          </p>

          <h2>6. Your own judgment</h2>
          <p>
            Ultimately, travel decisions — where to go, what to book, what risks to take — are
            yours to make. Use the stories here for inspiration and insight, and verify anything
            safety- or money-critical independently before you go.
          </p>

          <h2>7. Contact</h2>
          <p>
            <a href="mailto:hello@thetriptails.com" className={styles.link}>
              hello@thetriptails.com
            </a>
          </p>
        </article>
      </section>
    </main>
  );
}
