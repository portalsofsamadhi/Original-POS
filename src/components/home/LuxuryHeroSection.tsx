import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../../styles/luxury-theme.css";

const HERO_IMAGE =
  "/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp";

const LuxuryHeroSection = () => (
  <section className="luxury-hero luxury-hero--cinematic" aria-label="Portals of Samadhi hero">
    <div className="luxury-hero__media" aria-hidden="true">
      <img
        src={HERO_IMAGE}
        alt=""
        className="luxury-hero__bg-image"
        fetchPriority="high"
        decoding="async"
      />
      <div className="luxury-hero__overlay" />
      <div className="luxury-hero__glow luxury-hero__glow--left" />
      <div className="luxury-hero__glow luxury-hero__glow--right" />
    </div>

    <div className="luxury-hero__inner">
      <p className="luxury-hero__eyebrow">Jamaica · Explore - Heal - Thrive</p>
      <h1 className="luxury-hero__title">
        Walk the Land.
        <br />
        Feel the Lineage.
        <br />
        <em>Return Transformed.</em>
      </h1>
      <div className="luxury-hero__desc luxury-hero__desc--stack">
        <p>
          If you were looking for your sign to try something different, this is it. Curated
          experiences that expand the mind and take you places you never thought to look for
          (or find) are our specialty.
        </p>
        <p>
          Make your way through forests, farms, or quiet reflection as we hold a sacred moment
          for you and your beloveds, near or far.
        </p>
      </div>
      <div className="luxury-hero__actions">
        <Link to="/experiences" className="luxury-btn luxury-btn--gold">
          Explore Tours
          <ArrowRight size={14} />
        </Link>
        <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline">
          Plan an Event
        </Link>
      </div>
      <p className="luxury-hero__subcta">
        Looking for a private healing session?{" "}
        <Link to="/book-now" className="luxury-hero__subcta-link">
          Book here
        </Link>
      </p>
    </div>
  </section>
);

export default LuxuryHeroSection;
