import SubmitForm from '@/components/sections/SubmitForm'

export const metadata = {
  title: 'Share Your Tale — The Trip Tails',
  description:
    "Send us your true travel story. No writing experience needed — our editors help you shape it, and it's free to publish, forever.",
}

const steps = [
  {
    title: 'Send us your tale',
    body:
      "Rough notes, a voice-memo transcript, 300 words or 3,000 — any shape is welcome. Photos make it sing, but they aren't required.",
  },
  {
    title: 'We polish it together',
    body:
      'A real editor tightens the story with you. You approve every change before anything goes live. Your voice stays yours.',
  },
  {
    title: 'Your name in lights',
    body:
      'Your tale, your byline, your own author page with your photo and links — a permanent home for your stories. Forever free.',
  },
]

export default function SubmitPage() {
  return (
    <section className="share" id="share">
      <div className="inner share-grid">
        <div>
          <span className="kicker rv in">Your turn</span>
          <h1 className="rv in">That story you always tell at dinner? Publish it.</h1>
          <p className="lede rv in">
            You don't need to be a writer. If it happened to you on the road, someone out there
            needs to read it — and our editors will help you shape it.
          </p>
          <div className="steps">
            {steps.map((step) => (
              <div className="step rv in" key={step.title}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SubmitForm />
      </div>
    </section>
  )
}
