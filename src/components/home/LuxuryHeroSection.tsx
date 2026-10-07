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
      <p className="luxury-hero__eyebrow">Jamaica · Explore · Heal · Thrive</p>
      <h1 className="luxury-hero__title">
        Walk Ancient Maroon <span className="luxury-hero__title-nowrap">land</span>.
        <br />
        <em>Come as a guest. Leave as family.</em>
      </h1>
      <div className="luxury-hero__desc luxury-hero__desc--stack">
        <p>
          You&apos;re officially invited to join us in Jamaica! Portals of Samadhi is excited to
          welcome you to our home, and introduce you to some of the family as well.
        </p>
      </div>
      <p className="luxury-hero__eyebrow" style={{ marginTop: "1.5rem" }}>Experiences</p>
      <div className="luxury-hero__actions">
        <Link to="/experiences" className="luxury-btn luxury-btn--gold">
          Explore Tours
          <ArrowRight size={14} />
        </Link>
        <Link to="/airport-transfers" className="luxury-btn luxury-btn--gold">
          Airport Transfers
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </section>
);

export default LuxuryHeroSection;
