import Kicker from "@/components/ui/Kicker";
import FAQSection from "@/components/sections/FAQSection";
import styles from "./page.module.css";

export const metadata = {
  title: "FAQ — The Trip Tales",
  description:
    "Everything travellers want to know about reading, submitting, publishing, accounts, comments, and more on The Trip Tales.",
};

export default function FAQPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`inner ${styles.heroInner}`}>
          <Kicker>Before you ask</Kicker>
          <h1>Frequently Asked Questions</h1>
          <p className="lede" style={{ margin: "0 auto" }}>
            Everything travellers, contributors, and readers want to know — grouped by topic
            below.
          </p>
        </div>
      </section>

      <FAQSection
        kicker="Reading & the site"
        heading="General"
        items={[
          {
            question: "What is The Trip Tales?",
            answer:
              "A magazine of true, first-person travel stories written by real travellers — not a booking site, not a listicle factory, and not AI-generated content. Every story has a real byline.",
          },
          {
            question: "Is it free to read?",
            answer:
              "Completely free, no account or paywall required to read any story on the site.",
          },
          {
            question: "What kind of stories do you publish?",
            answer:
              "True ones. Solo trips, family chaos, budget triumphs, glorious disasters, tiny kindnesses from strangers — from any country, any budget, any style of travel. The only thing we don't publish is fiction or promotional content dressed up as a story.",
          },
        ]}
      />

      <FAQSection
        kicker="Sharing your tale"
        heading="Submitting a Story"
        items={[
          {
            question: "Do I need to be a good writer?",
            answer:
              "No. You need a true story. Rough notes and voice-memo transcripts are welcome — our editors shape the piece with you, and you approve every change before it goes live. Half of our published contributors had never written anything before.",
          },
          {
            question: "Is publishing my story free?",
            answer:
              "Completely. Publishing a tale costs nothing, and it always will.",
          },
          {
            question: "Who owns my story?",
            answer:
              "You do — full stop. You grant us permission to publish it here with your byline; you're free to share it, republish it, or print it on your wall. If you ever want it taken down, one email does it.",
          },
          {
            question: "How long until my tale is published?",
            answer:
              "We reply to every submission within 48 hours. From first reply to publication is typically one to two weeks, depending on how much shaping the story needs and how quickly you approve the edits.",
          },
          {
            question: "Can I include a trip cost breakdown?",
            answer:
              "Yes — if you'd like, you can add what your flights, stay, food, and average daily spend looked like. It's optional, self-reported, and shown as a snapshot of your trip rather than a live quote.",
          },
        ]}
      />

      <FAQSection
        kicker="Your profile"
        heading="Accounts & Comments"
        items={[
          {
            question: "Do I need an account to comment?",
            answer:
              "Yes — a free account keeps comment threads real and accountable. Sign-in is passwordless: we email you a one-time link, no password to remember.",
          },
          {
            question: "Can I reply to comments on my own published story?",
            answer:
              "Yes, once you claim your story. If your tale is published, we send a one-time claim link to the email you submitted with, which links your account to your byline so you can reply as the verified author.",
          },
          {
            question: "Can I block someone from commenting on my story?",
            answer:
              "Verified authors can block individual readers from their own story's comment thread — it's your story and your space to protect.",
          },
          {
            question: "What happens if I report a comment?",
            answer:
              "Our moderation team reviews it against our Editorial Guidelines and removes anything that violates them. Reports aren't shown publicly.",
          },
        ]}
      />

      <FAQSection
        kicker="Recognition"
        heading="Verification & Story of the Year"
        items={[
          {
            question: "What does a 'Verified' badge mean?",
            answer:
              "Verified and Top Storyteller badges are awarded editorially, based on story quality, consistency, and positive engagement with the community — not on how many stories you've submitted.",
          },
          {
            question: "How is Story of the Week/Month/Year chosen?",
            answer:
              "Story of the Week and Story of the Month are picked editorially. Story of the Year combines editorial judgment with a reader vote — one vote per account.",
          },
        ]}
      />

      <FAQSection
        kicker="Working together"
        heading="Advertising & Partnerships"
        items={[
          {
            question: "Do you work with brands or tourism boards?",
            answer:
              "Yes — see our Partnerships page. We do story-led features, not banner ads or pop-ups.",
          },
          {
            question: "Can I include my Instagram or blog on my author page?",
            answer:
              "Yes, please. Every contributor gets an author page with a photo, a short bio, and links to your socials or website.",
          },
        ]}
      />

      <FAQSection
        kicker="The fine print"
        heading="Privacy & Legal"
        items={[
          {
            question: "Where can I read the full Privacy Policy or Terms?",
            answer:
              "Linked in the footer of every page — Privacy Policy, Terms of Service, Editorial Guidelines, and Disclaimer each cover a different part of how the site works.",
          },
          {
            question: "Can I delete my account and data?",
            answer:
              "Yes — email privacy@thetriptails.com and we'll action it. Note that deleting your account doesn't automatically unpublish an already-live story; let us know separately if you'd like that removed too.",
          },
        ]}
      />
    </main>
  );
}
