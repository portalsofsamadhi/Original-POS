import { Heart, Globe, Sparkles } from "lucide-react";
import "../../../styles/luxury-theme.css";

const cards = [
  {
    icon: Heart,
    title: "Healing Arts",
    text: "Sound healing, meditation, energy work, and sacred gatherings shared through immersive experiences.",
  },
  {
    icon: Globe,
    title: "Retreat Tours",
    text: "Authentic Jamaican retreat experiences blending culture, indigenous wisdom, and transformative journeys.",
  },
  {
    icon: Sparkles,
    title: "Virtual Assistance",
    text: "Refined administrative support and strategic guidance from practitioners devoted to holistic excellence.",
  },
];

const LuxuryApproachSection = () => (
  <section className="luxury-section luxury-section--dark" aria-label="Our offerings">
    <div className="text-center mb-12">
      <p className="luxury-hero__eyebrow">What We Offer</p>
      <h2 className="luxury-hero__title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
        Healing, <em>Journey</em> &amp; Support
      </h2>
    </div>
    <div className="luxury-approach-grid">
      {cards.map(({ icon: Icon, title, text }) => (
        <div key={title} className="luxury-approach-card">
          <div className="luxury-approach-card__icon">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <h3 className="luxury-approach-card__title">{title}</h3>
          <p className="luxury-approach-card__text">{text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LuxuryApproachSection;