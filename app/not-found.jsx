import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page Not Found · The Trip Tales",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main className={styles.nfWrap}>
        <div className={styles.nfInner}>
          <span className={styles.nfKicker}>— Lost & Found</span>
          <h1>This trail runs cold here.</h1>
          <p>
            The page you&apos;re looking for either wandered off, changed its
            name, or never existed. Happens to the best travellers too.
          </p>

          <div className={styles.nfActions}>
            <Link className={`${styles.btn} ${styles.btnSun}`} href="/">
              Back to Home
            </Link>
            <Link className={`${styles.btn} ${styles.btnLine}`} href="/submit">
              Share your tale instead
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}