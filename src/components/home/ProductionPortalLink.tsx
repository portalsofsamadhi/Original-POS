import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import "../../styles/luxury-theme.css";

export const ExperienceSection = () => (
  <section className="luxury-section luxury-promise" aria-label="The experience">
    <div className="luxury-experience" data-motion="wipe">
      <img src="/poslogo.webp" alt="Portals of Samadhi original logo" width={1024} height={1024} />
      <div>
        <h2 className="luxury-production-banner__title">Come as You Are. Leave Changed.</h2>
        <p className="luxury-production-banner__text">
          A portal to the best of both worlds awaits. We take you deep into the heart of Jamaican
          farming culture, and right to the doorstep of the island&apos;s best-loved sights.
        </p>
        <p className="luxury-production-banner__text">
          We offer tours, farm stays, and multi-day experiences, sweet getaway
          packages that ease you into the natural setting, nice and easy.
        </p>
      </div>
    </div>
  </section>
);

const ProductionPortalLink = () => (
  <section className="luxury-section luxury-close" aria-label="Book a session" id="begin">
    <div className="luxury-cta-panel">
      <span className="motion-draw" data-motion="draw" aria-hidden="true" />
      <h2 className="luxury-production-banner__title">Ready When You Are</h2>
      <p className="luxury-production-banner__text">Pick a time.</p>
      <div className="luxury-hero__actions">
        <Link to="/book-now" className="luxury-btn luxury-btn--gold">
          Book a session
          <ArrowRight size={14} />
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
