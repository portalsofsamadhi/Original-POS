import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../../styles/luxury-theme.css";

const LuxuryHeroSection = () => (
  <section className="luxury-hero" aria-label="Portals of Samadhi hero">
    <div className="luxury-hero__inner">
      <p className="luxury-hero__eyebrow">Portals of Samadhi</p>
      <h1 className="luxury-hero__title">
        Sacred <em>Healing</em> &amp; Transformative Journeys
      </h1>
      <p className="luxury-hero__desc">
        A sanctuary for energy work, virtual assistance, retreat tours, and immersive wellness
        experiences rooted in indigenous wisdom and spiritual intention.
      </p>
      <div className="luxury-hero__actions">
        <Link to="/experiences" className="luxury-btn luxury-btn--gold">
          Explore Experiences
          <ArrowRight size={14} />
        </Link>
        <Link to="/book-now" className="luxury-btn luxury-btn--outline">
          Book a Session
        </Link>
      </div>
    </div>
  </section>
);

export default LuxuryHeroSection;