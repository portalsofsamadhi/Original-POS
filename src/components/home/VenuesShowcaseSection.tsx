import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import "../../styles/luxury-theme.css";

/**
 * Shared stage for tours and events - supports both paths without re-selling them.
 */
const venues = [
  {
    id: "blue-mountain",
    name: "Blue Mountain Sanctuaries",
    region: "Blue Mountains · Strawberry Hill corridor",
    vibe: "Cloud-line dining · Mist & birdsong · Private terraces",
    description:
      "Eco-lodges and mountain estates where the air thins and the mind clears - slow mornings, small retreats, and quiet nights above the canopy.",
    image: "/images - Copy/Phone/IMG-20250629-WA0045.webp",
    imageAlt: "Blue Mountains view from a hillside retreat in Jamaica",
  },
  {
    id: "portland-rainforest",
    name: "Portland Rainforest Retreats",
    region: "Portland Parish · Eastern Jamaica",
    vibe: "Lush canopy · River light · Cultural estates",
    description:
      "Rainforest grounds and private places near living rural communities - bush walks, rest, and gatherings that honor the land’s quiet power.",
    image: "/images - Copy/Phone/IMG-20250629-WA0046.webp",
    imageAlt: "Lush Jamaican hillside and evening light for a rainforest retreat",
  },
  {
    id: "ocho-rios-villas",
    name: "Ocho Rios Boutique Villas",
    region: "Ocho Rios · North Coast",
    vibe: "Private pools · Ocean breeze · Refined ease",
    description:
      "Hand-chosen villas for multi-day stays and small group events - privacy without sterility, hospitality without the hotel script.",
    image:
      "/images - Copy/Site Files/pexels-portals-of-samadhi-luxury-travel-retreats-1039102407-20435172.jpg",
    imageAlt: "Luxury tropical villa setting suitable for intimate Jamaica gatherings",
  },
  {
    id: "cultural-estates",
    name: "Cultural Farms & Heritage Estates",
    region: "Island-wide · Off the beaten path",
    vibe: "Working farms · Ital kitchens · Living history",
    description:
      "Where culture is practiced daily - meals from the soil, stories from elders, and grounds mass tourism never reaches.",
    image: "/images - Copy/Phone/IMG_20250619_144254560_HDR.webp",
    imageAlt: "Jamaican estate and cultural landscape for immersive tours",
  },
];

const VenuesShowcaseSection = () => (
  <section
    className="luxury-section luxury-section--venues"
    id="venues"
    aria-label="Places we host tours and events"
  >
    <div className="luxury-section__header">
      <p className="luxury-hero__eyebrow">Where You Stay</p>
      <h2 className="luxury-section__title">
        Rest in Places That <em>Feel Like Jamaica</em>
      </h2>
      <p className="luxury-section__lead">
        Boutique villas, eco-lodges, cultural estates, and private hillsides across Portland,
        Ocho Rios, and the mountains - chosen for atmosphere and quiet, whether you’re here for
        a tour or a multi-day retreat with your group.
      </p>
    </div>

    <div className="luxury-venues-grid">
      {venues.map((venue) => (
        <article key={venue.id} className="luxury-venue-card">
          <div className="luxury-venue-card__media">
            <img
              src={venue.image}
              alt={venue.imageAlt}
              className="luxury-venue-card__image"
              loading="lazy"
              decoding="async"
            />
            <div className="luxury-venue-card__shade" />
            <span className="luxury-venue-card__region">
              <MapPin size={12} aria-hidden="true" />
              {venue.region}
            </span>
          </div>
          <div className="luxury-venue-card__body">
            <h3 className="luxury-venue-card__name">{venue.name}</h3>
            <p className="luxury-venue-card__vibe">{venue.vibe}</p>
            <p className="luxury-venue-card__text">{venue.description}</p>
          </div>
        </article>
      ))}
    </div>

    <div className="luxury-venues-cta">
      <p className="luxury-venues-cta__text">
        Share your dates and who’s coming. We’ll help you find a place that fits - and the kind
        of days you actually want to live there.
      </p>
      <div className="luxury-hero__actions">
        <Link to="/plan-retreat" className="luxury-btn luxury-btn--gold">
          Plan Your Stay &amp; Event
          <ArrowRight size={14} />
        </Link>
        <Link to="/experiences" className="luxury-btn luxury-btn--outline">
          Start With a Tour
        </Link>
      </div>
    </div>
  </section>
);

export default VenuesShowcaseSection;
