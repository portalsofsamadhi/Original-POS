import { Link } from "react-router-dom";
import { ArrowRight, Plane, Users } from "lucide-react";
import "../../styles/luxury-theme.css";

const FeaturedServicesSection = () => (
  <section
    className="luxury-section luxury-featured-services"
    aria-label="Available services"
    id="featured-services"
    style={{
      background:
        "radial-gradient(ellipse at 50% 0%, rgba(201, 169, 98, 0.1) 0%, transparent 55%), linear-gradient(135deg, var(--luxury-charcoal) 0%, var(--luxury-surface) 100%)",
      border: "1px solid var(--luxury-gold-muted)",
    }}
  >
    <div className="luxury-section__header luxury-featured-services__header">
      <h2 className="luxury-section__title">
        What Will You <em>Come For?</em>
      </h2>
    </div>

    <div className="luxury-featured-services__grid" data-motion="turn">
      <article className="luxury-featured-card">
        <div className="luxury-featured-card__icon" aria-hidden>
          <Users size={22} strokeWidth={1.5} />
        </div>
        <p className="luxury-featured-card__eyebrow">Countryside</p>
        <h3 className="luxury-featured-card__title">Explore Tours</h3>
        <p className="luxury-featured-card__text">
          Farms and Forests, the famous sights, or the three cities you want to see.
        </p>
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

      <article className="luxury-featured-card luxury-featured-card--soon">
        <p className="luxury-featured-card__eyebrow">Coming Soon</p>
        <h3 className="luxury-featured-card__title">Farm stays</h3>
        <p className="luxury-featured-card__text">
          Off-the-beaten-path farm stays are opening soon. Until a bed is ready, begin with a tour
          or a conversation.
        </p>
        <Link
          to="/accommodations"
          className="luxury-btn luxury-btn--outline luxury-status"
          aria-label="Accommodations, coming soon"
        >
          <span className="luxury-status__book">Book</span>
          <span className="luxury-status__soon">Coming Soon</span>
        </Link>
      </article>
    </div>
  </section>
);

export default FeaturedServicesSection;
