import "../../styles/luxury-theme.css";

const STEPS = [
  {
    n: "01",
    title: "Write to us",
    text: "Send dates, a question, or a flight number.",
  },
  {
    n: "02",
    title: "We answer",
    text: "Within a business day you get timing and who you'll meet.",
  },
  {
    n: "03",
    title: "Book if you want",
    text: "The first conversation is free. You pay when you book.",
  },
];

/** Conversion-oriented process strip, same luxury language as the rest of the site. */
const ConversionHowItWorks = () => (
  <section className="luxury-section luxury-how" aria-label="How it works">
    <div className="luxury-section__header">
      <p className="luxury-hero__eyebrow">Three steps</p>
      <h2 className="luxury-section__title">
        How It <em>Works</em>
      </h2>
    </div>
    <ol className="luxury-how__grid" data-motion="nums">
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
