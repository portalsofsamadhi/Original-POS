import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import "../../styles/luxury-theme.css";

const ProductionPortalLink = () => (
  <section className="luxury-section" aria-label="Begin with us" id="begin">
    <div className="luxury-cta-panel">
      <p className="luxury-production-banner__label">Ready When You Are</p>
      <h2 className="luxury-production-banner__title">
        Come as You Are. Leave Changed.
      </h2>
      <p className="luxury-production-banner__text">
        Whether you want days on the land, a retreat or workshop for your people, or a quiet
        place to begin healing - including our six-week Realignment Program - we’re here to welcome
        you. Small groups. Real roots. Reach out and tell us what you’re hoping for.
      </p>
      <div className="luxury-path-close">
        <Link to="/experiences" className="luxury-path-close__item">
          <span className="luxury-path-close__label">Travel with us</span>
          <span className="luxury-path-close__title">Tours</span>
          <span className="luxury-path-close__cta">Explore →</span>
        </Link>
        <Link to="/airport-runs" className="luxury-path-close__item">
          <span className="luxury-path-close__label">Land well</span>
          <span className="luxury-path-close__title">Airport Runs</span>
          <span className="luxury-path-close__cta">Book →</span>
        </Link>
      </div>
      <div className="luxury-hero__actions luxury-hero__actions--secondary" style={{ marginTop: "1.25rem" }}>
        <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline luxury-btn--sm">
          Plan a Retreat
        </Link>
        <Link to="/courses" className="luxury-btn luxury-btn--outline luxury-btn--sm">
          Realignment Program
        </Link>
        <Link to="/book-now" className="luxury-btn luxury-btn--outline luxury-btn--sm">
          Book a session
        </Link>
      </div>
    </div>

    <div className="luxury-production-banner" style={{ marginTop: "2.5rem" }}>
      <p className="luxury-production-banner__label">Also From Our Family</p>
      <h2 className="luxury-production-banner__title">Samadhi Productions</h2>
      <p className="luxury-production-banner__text">
        If you work with film, music, or visual storytelling, our sister studio creates
        short-form series, music visuals, and digital craft with the same intentional spirit.
      </p>
      <a
        href="https://www.samadhiproductions.com"
        target="_blank"
        rel="noopener noreferrer"
        className="luxury-btn luxury-btn--outline"
      >
        Visit Samadhi Productions
        <ExternalLink size={14} />
      </a>
    </div>
  </section>
);

export default ProductionPortalLink;
