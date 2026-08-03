import Newsletter from "@/components/sections/Newsletter";
import styles from "./page.module.css";

export const metadata = {
  title: "Newsletter — The Trip Tales",
  description: "One great true travel story in your inbox, every Sunday.",
};

export default function NewsletterPage() {
  return (
    <main className={styles.pageWrap}>
      <Newsletter
        kicker="The Sunday Postcard"
        heading="One great tale in your inbox, every Sunday."
        body="The week's best story, one place you've never heard of, and one tip from the community. Reads in four minutes with your coffee."
        fineprint="no spam, ever — just tales. unsubscribe anytime ♡"
      />
    </main>
  );
}
