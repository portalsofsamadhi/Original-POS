import { ExternalLink } from "lucide-react";
import "../../styles/luxury-theme.css";

const ProductionPortalLink = () => (
  <section className="luxury-section" aria-label="Samadhi Productions link">
    <div className="luxury-production-banner">
      <p className="luxury-production-banner__label">Our Cinematic Studio</p>
      <h2 className="luxury-production-banner__title">Samadhi Productions</h2>
      <p className="luxury-production-banner__text">
        Discover our Afro-futurist cinematic studio — thoughtful short-form series, music videos,
        and immersive digital experiences crafted with spiritual depth and refined artistry.
      </p>
      <a
        href="https://www.samadhiproductions.com"
        target="_blank"
        rel="noopener noreferrer"
        className="luxury-btn luxury-btn--gold"
      >
        Visit Samadhi Productions
        <ExternalLink size={14} />
      </a>
    </div>
  </section>
);

export default ProductionPortalLink;