import "../../styles/luxury-theme.css";

const STEPS = [
  {
    n: "01",
    title: "Choose your path",
    text: "Tours on the land, a sacred gathering for your people, a private healing session, or The Realignment Program.",
  },
  {
    n: "02",
    title: "Tell us what you need",
    text: "Dates, group size, and intention. We reply with a clear next step, not a pressure pitch.",
  },
  {
    n: "03",
    title: "We walk it with you",
    text: "From first reply to the last day on the land, real hosts stay close so you never feel left to figure it out alone.",
  },
];

/** Conversion-oriented process strip, same luxury language as the rest of the site. */
const ConversionHowItWorks = () => (
  <section className="luxury-section luxury-how" aria-label="How it works">
    <div className="luxury-section__header">
      <p className="luxury-hero__eyebrow">Simple to begin</p>
      <h2 className="luxury-section__title">
        How Working With Us <em>Feels</em>
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
