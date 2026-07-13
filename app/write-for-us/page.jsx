import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./WriteForUs.module.css";

export const metadata = {
  title: "Write for Us — The Trip Tails",
  description: "How to write for The Trip Tails: what makes a good tale, what happens after you submit, and who keeps the rights (you do).",
};

const STEPS = [
  {
    title: "Send it in",
    body: "Rough notes, a voice-memo transcript, a polished draft — whatever you've got. No account needed.",
  },
  {
    title: "We shape it together",
    body: "I'll edit for clarity and flow, then send it back for your approval. Nothing goes live without your OK.",
  },
  {
    title: "Your name in lights",
    body: "Your tale, your byline, your own author page — a permanent home for your story. Forever free.",
  },
];

export default function WriteForUsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="inner" style={{ maxWidth: "700px" }}>
          <Kicker className="rv">For travellers with a story</Kicker>
          <h1 className="rv">Every trip leaves a tale. Yours included.</h1>
          <p className={`lede rv ${styles.lede}`}>
            You don&apos;t need to be a writer. You need a true story —
            solo trips, family chaos, budget triumphs, glorious disasters,
            tiny kindnesses from strangers. Any country, any budget, any
            style of travel.
          </p>
        </div>
      </section>

      <section className={styles.guidelines}>
        <div className="inner" style={{ maxWidth: "700px" }}>
          <h2 className="rv">What I look for</h2>
          <ul className={`rv ${styles.list}`}>
            <li>A real experience — yours, first-hand, no fiction</li>
            <li>Specific details: the place, the people, what actually happened</li>
            <li>No promotional content dressed up as a story</li>
          </ul>

          <h2 className={`rv ${styles.h2spaced}`}>What happens next</h2>
          <div className="steps rv">
            {STEPS.map((s) => (
              <div className="step" key={s.title}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className={`rv ${styles.h2spaced}`}>Who owns it</h2>
          <p className={`rv ${styles.p}`}>
            You do — full stop. I publish it with your byline and
            permission; you're free to share it, republish it, or print it
            on your wall. One email takes it down if you ever want that.
          </p>

          <Button variant="sun" href="/submit" className={`rv ${styles.cta}`}>
            Share your tale — free
          </Button>
        </div>
      </section>
    </>
  );
}