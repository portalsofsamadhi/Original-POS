import { Link } from "react-router-dom";
import { ArrowRight, Plane, Users } from "lucide-react";
import "../../styles/luxury-theme.css";

/**
 * Homepage dual feature: Explore Tours + Airport Runs (primary).
 * Plan a Retreat + Realignment sit smaller underneath.
 */
const FeaturedServicesSection = () => (
  <section
    className="luxury-section luxury-featured-services"
    aria-label="Tours and Airport Runs"
    id="featured-services"
  >
    <div className="luxury-section__header luxury-featured-services__header">
      <p className="luxury-hero__eyebrow">Start here</p>
      <h2 className="luxury-section__title">
        Tours &amp; <em>Airport Runs</em>
      </h2>
      <p className="luxury-section__lead">
        Two primary doors: countryside tours with our family hosts, and private Airport Runs so
        you arrive with care — not a random cab.
      </p>
    </div>

    <div className="luxury-featured-services__grid">
      <article className="luxury-featured-card">
        <div className="luxury-featured-card__icon" aria-hidden>
          <Users size={22} strokeWidth={1.5} />
        </div>
        <p className="luxury-featured-card__eyebrow">Countryside · Farms · Forests</p>
        <h3 className="luxury-featured-card__title">Explore Tours</h3>
        <p className="luxury-featured-card__text">
          Hills, valleys, working farms, and forests our families still tend. Build your days from
          real experiences — not a fixed tourist loop.
        </p>
        <ul className="luxury-featured-card__list">
          <li>Nature, culture &amp; healing options</li>
          <li>Simple retreats &amp; custom journeys</li>
          <li>Small groups · real hosts</li>
        </ul>
        <Link to="/experiences" className="luxury-btn luxury-btn--gold">
          Explore Tours
          <ArrowRight size={14} />
        </Link>
      </article>

      <article className="luxury-featured-card luxury-featured-card--accent">
        <div className="luxury-featured-card__icon" aria-hidden>
          <Plane size={22} strokeWidth={1.5} />
        </div>
        <p className="luxury-featured-card__eyebrow">Private transfer · From $95</p>
        <h3 className="luxury-featured-card__title">Airport Runs</h3>
        <p className="luxury-featured-card__text">
          Private pickup, drop-off, or round trip. Meet-and-greet when possible — same family hosts
          who walk the land with you, not a random cab queue.
        </p>
        <ul className="luxury-featured-card__list">
          <li>One-way from $95</li>
          <li>Round trip $180</li>
          <li>Flight details confirmed after booking</li>
        </ul>
        <Link to="/airport-runs" className="luxury-btn luxury-btn--gold">
          Book an Airport Run
          <ArrowRight size={14} />
        </Link>
      </article>
    </div>

    <div className="luxury-hero__actions luxury-hero__actions--secondary luxury-featured-services__secondary">
      <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline luxury-btn--sm">
        Plan a Retreat
      </Link>
      <Link to="/courses" className="luxury-btn luxury-btn--outline luxury-btn--sm">
        Realignment Program
      </Link>
    </div>
  </section>
);

export default FeaturedServicesSection;
