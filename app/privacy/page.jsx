import Kicker from "@/components/ui/Kicker";
import styles from "./page.module.css";

export const metadata = {
  title: "Privacy Policy — The Trip Tails",
  description: "How The Trip Tails collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`inner ${styles.heroInner}`}>
          <Kicker>Legal</Kicker>
          <h1>Privacy Policy</h1>
          <p className="lede">Last updated: [DATE — set before launch]</p>
        </div>
      </section>

      <section className={styles.body}>
        <article className={`inner ${styles.article}`}>
          <p>
            The Trip Tails ("we," "us," "our") publishes true, first-person travel stories from
            real contributors. This policy explains what information we collect, why, and what
            rights you have over it. We&apos;re a small editorial team, not a data broker — we
            collect the minimum needed to run the site and never sell your information.
          </p>

          <p className={styles.note}>
            This policy is written to comply with the EU General Data Protection Regulation
            (GDPR) and the California Consumer Privacy Act (CCPA), since our readers and
            contributors are international. This is general guidance, not legal advice —
            have a lawyer review this before launch to confirm it fits your specific setup.
          </p>

          <h2>1. Information we collect</h2>

          <h3>1.1 When you submit a story</h3>
          <p>
            Name, email address, country, your story text, and any photos you choose to upload.
            This goes into our submissions queue for editorial review and is never published
            without your approval.
          </p>

          <h3>1.2 When you subscribe to the newsletter</h3>
          <p>Your email address only. You can unsubscribe at any time via the link in every email.</p>

          <h3>1.3 If you create a reader account</h3>
          <p>
            We use passwordless "magic link" sign-in — you never create or store a password with
            us. When you sign up, we store your email address, a display name, and (optionally)
            an avatar image. If you comment on a story, choose to claim authorship of a published
            tale, or vote for a Story of the Year, those actions are tied to your account.
          </p>

          <h3>1.4 If you comment on a story</h3>
          <p>
            We store the comment content, which story it's on, your account ID, and the time
            posted. If another reader reports a comment, we log the report reason and reviewing
            admin's decision — this is kept for moderation purposes, not shown publicly.
          </p>

          <h3>1.5 If you're a published contributor</h3>
          <p>
            If your story is approved, we may send a one-time "claim your story" invitation to
            the email you submitted with. This uses a unique, randomly generated link — not
            sequential or guessable — that lets you create an account linked to your published
            tale so you can reply to comments as the verified author.
          </p>

          <h3>1.6 Automatically collected data</h3>
          <p>
            Standard technical data (IP address, browser type, pages visited) is collected for
            security purposes — for example, rate-limiting the submission form and comment
            system against spam and abuse. We don't use this for advertising or behavioral
            tracking.
          </p>

          <h2>2. How we use your information</h2>
          <ul>
            <li>To review, edit, and publish story submissions</li>
            <li>To send the newsletter, if you've opted in</li>
            <li>To operate reader accounts, comments, and the contributor claim flow</li>
            <li>To moderate comments and enforce our community guidelines</li>
            <li>To tally votes for Story of the Month / Story of the Year features</li>
            <li>
              To calculate aggregate, anonymized destination statistics (e.g. average daily
              trip cost for a region) — these are never tied back to an individual person
            </li>
            <li>To prevent spam, fraud, and abuse of the submission and comment systems</li>
          </ul>

          <h2>3. Who we share it with</h2>
          <p>
            We don't sell your data. We share it only with the service providers that make the
            site run — our hosting provider, our database provider (Supabase), and our email
            delivery provider for the newsletter and account emails. Each is bound to only use
            your data to provide that service to us.
          </p>

          <h2>4. Your rights</h2>
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Request a copy of the data we hold about you</li>
            <li>Ask us to correct inaccurate data</li>
            <li>Ask us to delete your data (including your account, comments, and any unpublished submission)</li>
            <li>Withdraw consent for the newsletter at any time</li>
            <li>Object to certain uses of your data</li>
          </ul>
          <p>
            To exercise any of these, email us at{" "}
            <a href="mailto:privacy@thetriptails.com" className={styles.link}>
              privacy@thetriptails.com
            </a>
            . Note that if you're a published contributor, deleting your account won&apos;t
            automatically unpublish your story — email us separately if you'd like your tale
            taken down, and we'll action it within a reasonable timeframe.
          </p>

          <h2>5. Comment content and blocking</h2>
          <p>
            Comments are public once posted. If a verified author blocks a reader from
            commenting on their story's thread, that block is enforced on our servers, not just
            hidden in your browser — a blocked reader's future comments on that thread won't be
            shown even if they use a different device.
          </p>

          <h2>6. Data retention</h2>
          <p>
            We keep submission and account data for as long as your account is active or your
            story remains published. If you delete your account, we remove your personal
            information within a reasonable timeframe, except where we're required to retain
            records for legal or security reasons (e.g. fraud prevention logs).
          </p>

          <h2>7. Children's privacy</h2>
          <p>
            The Trip Tails is not directed at children under 16, and we don't knowingly collect
            data from anyone under that age.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            If we make material changes to this policy, we'll update the date at the top of this
            page and, where appropriate, notify account holders by email.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about this policy or your data:{" "}
            <a href="mailto:privacy@thetriptails.com" className={styles.link}>
              privacy@thetriptails.com
            </a>
          </p>
        </article>
      </section>
    </main>
  );
}
