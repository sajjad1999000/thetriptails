import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import styles from "./About.module.css";

export const metadata = {
  title: "About | The Trip Tails",
  description:
    "The Trip Tails is built by one traveller who believes every trip leaves a tale worth telling. Here's why it exists.",
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.about}>
        <div className={`inner ${styles.grid}`}>
          <div className={`ttframe rv ${styles.photo}`}>
            <SafeImage
              src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop"
              alt="A traveller sitting at the end of a dock, looking out at a mountain lake"
            />
          </div>
          <div>
            <Kicker className="rv">Behind The Trip Tails</Kicker>
            <h1 className="rv">It started with a story nobody wrote down.</h1>
            <p className="lede rv">
              On a night bus winding out of the mountains, I listened to a
              stranger tell the best travel story I&apos;d ever heard,
              better than anything in any magazine. At the last stop, he
              shook hands and disappeared. So did the story.{" "}
              <b>Nobody ever wrote it down.</b>
            </p>
            <p className={`rv ${styles.p}`}>
              The Trip Tails exists so that stops happening. The internet
              has enough &ldquo;ultimate guides.&rdquo; What it&apos;s
              missing is what travellers actually remember: the strangers,
              the mistakes, the meals, the moments that don&apos;t fit a
              top-ten list. I publish those, carefully edited, beautifully
              presented, with the traveller&apos;s name on every one.
            </p>
            <p className={`rv ${styles.p}`}>
              I&apos;m building this one story at a time, with readers and
              contributors across Europe, Asia and beyond, and an inbox
              that&apos;s open to every traveller on earth. If you&apos;ve
              got a tale, I&apos;d genuinely love to read it.
            </p>
            <div className={`rv ${styles.sig}`}>
              <span className={styles.sigName}>Salman Ahmad, Founder</span>
              <span className={styles.sigRole}>
                The Trip Tails · Est. 2026
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.how}>
        <div className="inner" style={{ maxWidth: "780px" }}>
          <Kicker className="rv">How it actually works</Kicker>
          <h2 className="rv">One person, reading every single word.</h2>
          <p className={`lede rv ${styles.p}`}>
            Right now, it&apos;s just me, reading every submission, doing
            every edit, replying to every email. That won&apos;t stay true
            forever; as more travellers send in tales, I hope this grows
            into a small editorial team. But I&apos;d rather tell you
            honestly what it is today than dress it up as something bigger.
          </p>
          <Button variant="sun" href="/submit" className="rv">
            Share your tale, free
          </Button>
        </div>
      </section>
    </>
  );
}