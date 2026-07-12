import ScrollReveal from "@/components/root/ScrollReveal";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import NatureBand from "@/components/sections/NatureBand";
import Solution from "@/components/sections/Solution";
import Feature from "@/components/sections/Feature";
import StoryGrid from "@/components/sections/StoryGrid";
import CategoryTeaser from "@/components/sections/CategoryTeaser";
import ProofStats from "@/components/sections/ProofStats";
import Share from "@/components/sections/Share";
import About from "@/components/sections/About";
import FAQSection from "@/components/sections/FAQSection";
import Partners from "@/components/sections/Partners";
import Newsletter from "@/components/sections/Newsletter";
import FinalCTA from "@/components/sections/FinalCTA";
import { homepageStories } from "@/lib/data/stories";

export const metadata = {
  title: "The Trip Tails — True stories, told by travellers",
  description:
    "The Trip Tails is a magazine of true travel stories written by the people who were actually there. Read real tales from the road — then publish your own, free.",
};

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      <Hero
        kicker="True stories · told by travellers"
        titleLines={[
          [{ text: "You came back " }, { text: "different.", em: true }],
          [{ text: "That's the story." }],
        ]}
        subtitle={
          <>
            Every week, real travellers publish the tales they used to tell only at dinner — the wrong
            turns, the kind strangers, the sunrises that rearranged them.{" "}
            <b>This week&apos;s tale begins in a snowstorm in Skardu.</b>
          </>
        }
        ctaLabel="Read this week's tale"
        ctaHref="#feature"
        image={{
          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80&auto=format&fit=crop",
          alt: "Snow-capped mountains rising above a green alpine valley",
        }}
      />

      <Problem
        kicker="The problem with travel content"
        parts={[
          { text: '"Top 10 things to do in Lisbon" has been written', tone: "dim" },
          { text: "40,000 times." },
          { text: "Your night lost in Alfama with a guitarist named Rui —", tone: "dim" },
          { text: "exactly once.", tone: "lit" },
          { text: "And right now it lives only in your head.", tone: "dim" },
        ]}
      />

      <NatureBand
        image={{
          src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1800&q=80&auto=format&fit=crop",
          alt: "Turquoise ocean meeting a white sand beach",
        }}
        quote="The sea doesn't care about your itinerary. That's why we love it."
        attribution="from a tale sent in from the Azores"
      />

      <Solution
        kicker="The Trip Tails"
        heading="A magazine written by the people who were actually there."
        lede="No listicles. No sponsored “hidden gems.” Just true stories from the road, sent in by travellers across Europe, Asia and beyond — edited with care, published with your name on them, free forever. Read one below. Then think about the tale you'd tell."
      />

      <Feature
        kicker="Story of the week · Skardu, Pakistan"
        title="Snowed in at Shigar Fort with eleven strangers"
        quote="“The road closed behind us at 4pm. By midnight, a Japanese photographer was teaching a Karachi banker card tricks by the fire. Nobody wanted the road to open.”"
        initials="HT"
        bylineText={
          <>
            Written by <b>Hamza T.</b> · his 2nd tale · 9 min read
          </>
        }
        ctaLabel="Read the full tale"
        ctaHref="#share"
        image={{
          src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1800&q=80&auto=format&fit=crop",
          alt: "Snow-covered Karakoram peaks under a heavy sky",
        }}
      />

      <StoryGrid
        kicker="Fresh from the road"
        heading="Tales worth missing your stop for."
        stories={homepageStories}
        moreLabel="Browse all 120+ tales"
        moreHref="/stories"
      />

      <CategoryTeaser />

      <ProofStats
        kicker="Why travellers trust us"
        heading="Real people. Real roads. Real names on every story."
        stats={[
          { value: "120+", label: "true tales published" },
          { value: "38", label: "countries written from" },
          { value: "100%", label: "human-edited, zero AI-spun filler" },
          { value: "48h", label: "average reply to every submission" },
        ]}
        quotes={[
          {
            text: "“I'm not a writer. I sent a rough voice-note transcript about a night train in Serbia, and two weeks later my story was live — sounding like me, only better. My mum cried.”",
            who: "Daniyal M. · Published contributor",
          },
          {
            text: "“I read the Sunday Postcard on my commute out of Manchester. It's the only travel email I actually finish — it feels like a friend telling you about their trip, not a brand selling you one.”",
            who: "Ellie W. · Reader since 2026",
          },
        ]}
      />

      <NatureBand
        image={{
          src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1800&q=80&auto=format&fit=crop",
          alt: "Sunrays breaking over a green mountain valley",
        }}
        quote="We didn't get lost. We just found three valleys we weren't looking for."
        attribution="from a tale sent in from Hunza"
      />

      <Share
        kicker="Your turn"
        heading="That story you always tell at dinner? Publish it."
        lede="You don't need to be a writer. If it happened to you on the road, someone out there needs to read it — and our editors will help you shape it."
        steps={[
          {
            title: "Send us your tale",
            body: "Rough notes, a voice-memo transcript, 300 words or 3,000 — any shape is welcome. Photos make it sing, but they aren't required.",
          },
          {
            title: "We polish it together",
            body: "A real editor tightens the story with you. You approve every change before anything goes live. Your voice stays yours.",
          },
          {
            title: "Your name in lights",
            body: "Your tale, your byline, your own author page with your photo and links — a permanent home for your stories. Forever free.",
          },
        ]}
      />

      <About
        kicker="Behind The Trip Tails"
        heading="It started with a story nobody wrote down."
        paragraphs={[
          <>
            On a night bus winding out of the mountains, one of us listened to a stranger tell the best
            travel story we&apos;d ever heard — better than anything in any magazine. At the last stop, he
            shook hands and disappeared. So did the story. <b>Nobody ever wrote it down.</b>
          </>,
          <>
            The Trip Tails exists so that stops happening. The internet has enough &ldquo;ultimate
            guides.&rdquo; What it&apos;s missing is what travellers actually remember: the strangers, the
            mistakes, the meals, the moments that don&apos;t fit a top-ten list. We publish those —
            carefully edited, beautifully presented, with the traveller&apos;s name on every one.
          </>,
          <>
            We&apos;re a small editorial team with readers and contributors across Europe, Asia and beyond
            — and an inbox that&apos;s open to every traveller on earth. If you&apos;ve got a tale,
            we&apos;d genuinely love to read it.
          </>,
        ]}
        signature="The Trip Tails team"
        signatureRole="Editorial · Est. 2026"
        image={{
          src: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop",
          alt: "A traveller walking a mountain trail with a backpack",
        }}
      />

      <FAQSection
        kicker="Before you ask"
        heading="Everything travellers want to know."
        items={[
          {
            question: "Do I need to be a good writer?",
            answer:
              "No. You need a true story. Rough notes and voice-memo transcripts are welcome — our editors shape the piece with you, and you approve every change before it goes live. Half of our published contributors had never written anything before.",
          },
          {
            question: "Is it really free?",
            answer:
              "Completely. Publishing a tale costs nothing, and it always will. We believe the stories belong to the community — the site earns its keep in other ways that never involve charging travellers to be heard.",
          },
          {
            question: "Who owns my story?",
            answer:
              "You do — full stop. You grant us permission to publish it here with your byline; you're free to share it, republish it, or print it on your wall. If you ever want it taken down, one email does it.",
          },
          {
            question: "Can I include my Instagram or blog?",
            answer:
              "Yes, please. Every contributor gets an author page with a photo, a short bio, and links to your socials or website. Many of our writers gain followers every time their tale gets shared.",
          },
          {
            question: "What kind of stories do you publish?",
            answer:
              "True ones. Solo trips, family chaos, budget triumphs, glorious disasters, tiny kindnesses from strangers — from any country, any budget, any style of travel. The only thing we don't publish is fiction or promotional content dressed up as a story.",
          },
          {
            question: "How long until my tale is published?",
            answer:
              "We reply to every submission within 48 hours. From first reply to publication is typically one to two weeks, depending on how much shaping the story needs and how quickly you approve the edits.",
          },
        ]}
      />

      <Partners
        kicker="For brands & tourism boards"
        heading="Stories readers actually finish."
        body="We partner with destinations and travel brands on authentic, story-led features — no banner ads, no pop-ups, no pretending. If your place or product belongs inside a true traveller's tale, let's talk."
        ctaLabel="Start a conversation"
        ctaHref="mailto:partnerships@thetriptails.com"
      />

      <Newsletter
        kicker="The Sunday Postcard"
        heading="One great tale in your inbox, every Sunday."
        body="The week's best story, one place you've never heard of, and one tip from the community. Reads in four minutes with your coffee."
        fineprint="no spam, ever — just tales. unsubscribe anytime ♡"
      />

      <FinalCTA
        heading={
          <>
            Every trip leaves a tale.
            <br />
            Don&apos;t let yours end at the dinner table.
          </>
        }
        body="It takes five minutes to start. It stays published forever."
        ctaLabel="Share your tale — free"
        ctaHref="#share"
      />
    </>
  );
}