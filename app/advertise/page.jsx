import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import styles from "./Advertise.module.css";

export const metadata = {
  title: "Advertise — The Trip Tails",
  description: "Story-led partnerships with The Trip Tails — no banner ads, no pop-ups, just true tales that mention your destination or brand honestly.",
};

export default function AdvertisePage() {
  return (
    <section className={styles.advertise}>
      <div className="inner" style={{ maxWidth: "740px" }}>
        <Kicker className="rv">For brands &amp; tourism boards</Kicker>
        <h1 className="rv">Stories readers actually finish.</h1>
        <p className={`lede rv ${styles.lede}`}>
          No banner ads. No pop-ups. No pretending. If your destination or
          product genuinely belongs inside a true traveller&apos;s tale,
          that&apos;s the kind of partnership I&apos;m open to.
        </p>

        <div className={styles.block}>
          <h2 className="rv">What this looks like</h2>
          <p className={`rv ${styles.p}`}>
            A traveller writes about a real trip that happens to feature
            your destination, stay, or product — edited to the same
            standard as every other tale on the site, and clearly labelled
            as a partnership. Nothing is ghost-written to look like an
            organic story that isn&apos;t.
          </p>
        </div>

        <div className={styles.block}>
          <h2 className="rv">Where things stand</h2>
          <p className={`rv ${styles.p}`}>
            The Trip Tails is early — I&apos;m not going to hand you
            inflated traffic numbers to make a case that isn&apos;t there
            yet. What I can offer is a genuinely different read from
            typical sponsored content, and a direct line to the person
            actually running the site.
          </p>
        </div>

        <Button
          variant="pine"
          href="mailto:info.thetriptails@gmail.com?subject=Partnership%20enquiry"
          className={`rv ${styles.cta}`}
        >
          Start a conversation
        </Button>
      </div>
    </section>
  );
}