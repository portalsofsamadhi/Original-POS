import { Link } from "react-router-dom";
import { ArrowRight, Plane, Users } from "lucide-react";
import "../../styles/luxury-theme.css";

/**
 * Homepage dual feature: Explore Tours + Airport Transfers (primary).
 */
const FeaturedServicesSection = () => (
  <section
    className="luxury-section luxury-featured-services"
    aria-label="Tours and Airport Transfers"
    id="featured-services"
    style={{
      background:
        "radial-gradient(ellipse at 50% 0%, rgba(201, 169, 98, 0.1) 0%, transparent 55%), linear-gradient(135deg, var(--luxury-charcoal) 0%, var(--luxury-surface) 100%)",
      border: "1px solid var(--luxury-gold-muted)",
    }}
  >
    <div className="luxury-section__header luxury-featured-services__header">
      <p className="luxury-hero__eyebrow">Start Planning</p>
      <h2 className="luxury-section__title">
        Tours &amp; <em>Airport Transfers</em>
      </h2>
      <p className="luxury-section__lead">
        Two ways to begin: days out with our family hosts, or a private airport transfer with a
        warm welcome waiting when you land.
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
          Hills, valleys, and working farms our families actively tend. Pull up a chair and
          we&apos;ll build your days together.
        </p>
        <ul className="luxury-featured-card__list">
          <li>Nature, culture &amp; healing options</li>
          <li>Simple retreats &amp; custom journeys</li>
          <li>Unique Jamaican experiences</li>
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
        <p className="luxury-featured-card__eyebrow">Private Transfer · From $95</p>
        <h3 className="luxury-featured-card__title">Airport Transfers</h3>
        <p className="luxury-featured-card__text">
          Private pickup, drop-off, or round trip from Sangster (MBJ) or Norman Manley (KIN), with
          a friendly face waiting when you land. Same family hosts, never a random cab.
        </p>
        <ul className="luxury-featured-card__list">
          <li>One-way from $95</li>
          <li>Round trip $180</li>
          <li>Flight details confirmed after booking</li>
        </ul>
        <Link to="/airport-transfers" className="luxury-btn luxury-btn--gold">
          Book an Airport Transfer
          <ArrowRight size={14} />
        </Link>
      </article>
    </div>
  </section>
);

export default FeaturedServicesSection;
