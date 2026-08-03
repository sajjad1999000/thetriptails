import Partners from "@/components/sections/Partners";
import styles from "./page.module.css";

export const metadata = {
  title: "Partnerships — The Trip Tales",
  description: "Story-led partnerships for destinations and travel brands.",
};

export default function PartnersPage() {
  return (
    <main className={styles.pageWrap}>
      <Partners
        kicker="For brands & tourism boards"
        heading="Stories readers actually finish."
        body="We partner with destinations and travel brands on authentic, story-led features — no banner ads, no pop-ups, no pretending. If your place or product belongs inside a true traveller's tale, let's talk."
        ctaLabel="Start a conversation"
        ctaHref="mailto:partnerships@thetriptails.com"
      />
    </main>
  );
}
