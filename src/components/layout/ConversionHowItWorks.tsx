import "../../styles/luxury-theme.css";

const STEPS = [
  {
    n: "01",
    title: "Tell us where you're headed",
    text: "Share your pickup times, flight details, or tour dates. A quick message is all it takes to get the ball rolling.",
  },
  {
    n: "02",
    title: "We confirm everything with you",
    text: "You'll get a clear confirmation with your route, timing, and host details. No surprises, no guesswork. Just a plan that works.",
  },
  {
    n: "03",
    title: "Pay securely, and we pick you up",
    text: "Complete your booking through our secure payment portal. Then sit back and relax — we'll be there with a warm face and a ready car.",
  },
];

/** Conversion-oriented process strip, same luxury language as the rest of the site. */
const ConversionHowItWorks = () => (
  <section className="luxury-section luxury-how" aria-label="How it works">
    <div className="luxury-section__header">
      <p className="luxury-hero__eyebrow">Getting there is simple</p>
      <h2 className="luxury-section__title">
        How It <em>Works</em>
      </h2>
    </div>
    <ol className="luxury-how__grid">
      {STEPS.map((step) => (
        <li key={step.n} className="luxury-how__card">
          <span className="luxury-how__num">{step.n}</span>
          <h3 className="luxury-how__title">{step.title}</h3>
          <p className="luxury-how__text">{step.text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default ConversionHowItWorks;
