import Kicker from "@/components/ui/Kicker";
import styles from "./page.module.css";

export const metadata = {
  title: "Terms of Service — The Trip Tails",
  description: "The terms that govern use of The Trip Tails.",
};

export default function TermsPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`inner ${styles.heroInner}`}>
          <Kicker>Legal</Kicker>
          <h1>Terms of Service</h1>
          <p className="lede">Last updated: [DATE — set before launch]</p>
        </div>
      </section>

      <section className={styles.body}>
        <article className={`inner ${styles.article}`}>
          <p className={styles.note}>
            This is general guidance, not legal advice — have a lawyer review this before
            launch, especially the liability and governing-law sections, which vary
            significantly by jurisdiction.
          </p>

          <p>
            By using The Trip Tails ("the site"), you agree to these terms. If you don't agree,
            please don't use the site.
          </p>

          <h2>1. What The Trip Tails is</h2>
          <p>
            A magazine of true, first-person travel stories written by real travellers. We are
            not a booking site, travel agency, or tour operator, and nothing published here
            constitutes travel advice, safety guarantees, or professional recommendations —
            see our{" "}
            <a href="/disclaimer" className={styles.link}>
              Disclaimer
            </a>{" "}
            for more.
          </p>

          <h2>2. Submitting a story</h2>
          <ul>
            <li>Your story must be true and something that actually happened to you.</li>
            <li>You confirm you have the right to submit any photos included.</li>
            <li>
              You retain ownership of your story. By submitting, you grant us a license to
              edit, publish, and display it on The Trip Tails with your byline. You can request
              removal at any time.
            </li>
            <li>We reserve the right to decline, edit, or request changes to any submission.</li>
          </ul>

          <h2>3. Reader accounts</h2>
          <p>
            Creating an account requires a valid email address. You're responsible for keeping
            access to that email secure, since our sign-in links are sent there. One account per
            person — don't create multiple accounts to evade a block or manipulate votes.
          </p>

          <h2>4. Comments</h2>
          <p>When you comment on a story, you agree not to:</p>
          <ul>
            <li>Post anything false, defamatory, harassing, hateful, or illegal</li>
            <li>Impersonate the story's author or any other person</li>
            <li>Post spam, advertising, or unrelated promotional content</li>
            <li>Attempt to circumvent a block placed by a story's author or by our moderators</li>
          </ul>
          <p>
            We may hide, remove, or restrict comments that violate these terms, and may suspend
            accounts that repeatedly do so. A story's verified author may block individual
            readers from commenting on their own story's thread — that's their call to make.
          </p>

          <h2>5. Claiming authorship</h2>
          <p>
            If your submitted story is published, we may send a one-time invitation link to
            claim it and link it to a reader account. This lets you reply to comments on your
            own story as a verified author. Claim links are personal to you and shouldn't be
            shared — if you believe someone else has claimed your story in error, contact us
            immediately.
          </p>

          <h2>6. Verified badges</h2>
          <p>
            Verified/Top Storyteller badges are awarded at our editorial discretion based on
            factors like story quality, engagement, and community standing. We reserve the
            right to award, withhold, or remove a badge at any time.
          </p>

          <h2>7. Story of the Week / Month / Year</h2>
          <p>
            Story of the Week and Story of the Month are selected editorially. Story of the Year
            includes a reader vote — one vote per account, and we reserve the right to
            invalidate votes we believe are fraudulent (e.g. bot activity, vote manipulation).
          </p>

          <h2>8. Trip cost information</h2>
          <p>
            Cost breakdowns submitted alongside stories (flights, accommodation, food, daily
            spend) are self-reported by the traveller at the time of their trip. Prices change —
            treat these figures as a snapshot of one person's experience, not a current quote or
            guarantee.
          </p>

          <h2>9. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Scrape, republish, or bulk-download site content without permission</li>
            <li>Attempt to bypass rate limits, moderation, or security measures</li>
            <li>Use the site to distribute malware or attack other users or our infrastructure</li>
          </ul>

          <h2>10. Content ownership</h2>
          <p>
            Site design, branding, and editorial content we produce are owned by The Trip
            Tails. Contributor stories remain owned by their authors under the license described
            in Section 2. Reader comments remain owned by their authors, who grant us a license
            to display them alongside the relevant story.
          </p>

          <h2>11. Disclaimers and limitation of liability</h2>
          <p>
            The site and its content are provided "as is." We don't guarantee the accuracy,
            completeness, or current relevance of any story, cost figure, or destination
            information. To the fullest extent permitted by law, The Trip Tails isn't liable for
            any decisions made or losses incurred based on content published here.
          </p>

          <h2>12. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after a
            change means you accept the updated terms.
          </p>

          <h2>13. Contact</h2>
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
