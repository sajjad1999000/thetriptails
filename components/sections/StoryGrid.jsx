import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import StoryCard from "@/components/ui/StoryCard";
import styles from "./StoryGrid.module.css";

/**
 * Usage:
 *   <StoryGrid
 *     kicker="Fresh from the road"
 *     heading="Tales worth missing your stop for."
 *     stories={stories}            // array of StoryCard `story` objects
 *     moreLabel="Browse all 120+ tales"
 *     moreHref="/stories"
 *   />
 */
export default function StoryGrid({ kicker, heading, stories = [], moreLabel, moreHref }) {
  return (
    <section className={styles.gridSec} id="stories">
      <div className="inner">
        <Kicker className="rv">{kicker}</Kicker>
        <h2 className="rv">{heading}</h2>
        <div className={styles.stories}>
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
        {moreHref && (
          <div className={`${styles.more} rv`}>
            <Button variant="pine" href={moreHref}>
              {moreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
