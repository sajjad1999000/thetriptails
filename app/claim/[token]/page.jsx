import { notFound } from "next/navigation";
import Kicker from "@/components/ui/Kicker";
import { createClient } from "@/lib/supabase/server";
import ClaimAction from "@/components/claim/ClaimAction";
import styles from "@/components/claim/ClaimFlow.module.css";

export default async function ClaimPage({ params }) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select("id, title, excerpt, cover_image_url, author_name, claim_status")
    .eq("claim_token", token)
    .maybeSingle();

  if (error || !story) notFound();

  if (story.claim_status === "claimed") {
    return (
      <main className={styles.wrap}>
        <div className="inner" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Kicker>Claim a tale</Kicker>
          <h1>This tale's already been claimed</h1>
          <p>
            If this should be yours, reach out at hello@thetriptails.com and we'll sort it out.
          </p>
        </div>
      </main>
    );
  }

  // No server-side session check needed here — ClaimAction handles the
  // logged-out state itself (via useAuth + LoginModal) and the claim
  // action re-verifies the session server-side anyway.
  return (
    <main className={styles.wrap}>
      <div className="inner" style={{ maxWidth: 560, margin: "0 auto" }}>
        <Kicker>Claim a tale</Kicker>
        <h1>Is this your story?</h1>

        <div className={styles.preview}>
          {story.cover_image_url && (
            <img src={story.cover_image_url} alt="" className={styles.previewImage} />
          )}
          <div>
            <h2 className={styles.previewTitle}>{story.title}</h2>
            {story.excerpt && <p className={styles.previewExcerpt}>{story.excerpt}</p>}
            <p className={styles.previewByline}>By {story.author_name}</p>
          </div>
        </div>

        <ClaimAction token={token} />
      </div>
    </main>
  );
}