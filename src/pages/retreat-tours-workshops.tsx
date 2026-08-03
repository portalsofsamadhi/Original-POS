import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Leaf,
  MapPin,
  Plane,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import { SIMPLE_RETREAT } from "../data/customRetreat";
import "../styles/luxury-theme.css";

const AIRPORT_PICKUP = {
  id: "airport-pickup",
  name: "Airport Pickup",
  price: 95,
  duration: "One-way transfer",
  notes: [
    "Airport Pickup — Jamaica",
    "One-way private transfer from airport to your stay",
    "Meet-and-greet style welcome when possible",
    "Confirm flight details after booking",
  ].join("\n"),
};

const BUSH_MEDICINE = {
  id: "bush-medicine-session",
  name: "Bush Medicine Experience",
  price: 120,
  duration: "Half-day immersion",
  notes: [
    "Bush Medicine — traditional Jamaican herbal wisdom",
    "Mucus-removing lifestyle framework",
    "Plant introduction & tea preparation basics",
    "Outlook on health rooted in traditional medicine",
  ].join("\n"),
};

const ExperiencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeContact, setWelcomeContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const goToPayment = (opts: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    serviceDuration: string;
    notes: string;
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
  }) => {
    const params = new URLSearchParams({
      serviceId: opts.serviceId,
      serviceName: opts.serviceName,
      servicePrice: String(opts.servicePrice),
      serviceDuration: opts.serviceDuration,
      practitionerName: "Portals of Samadhi",
      date: opts.date || "To be confirmed",
      name: opts.name || "Guest",
      email: opts.email || "",
      phone: opts.phone || "",
      notes: opts.notes,
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleAirportBook = () => {
    goToPayment({
      serviceId: AIRPORT_PICKUP.id,
      serviceName: AIRPORT_PICKUP.name,
      servicePrice: AIRPORT_PICKUP.price,
      serviceDuration: AIRPORT_PICKUP.duration,
      notes: AIRPORT_PICKUP.notes,
    });
  };

  const handleBushMedicineBook = () => {
    goToPayment({
      serviceId: BUSH_MEDICINE.id,
      serviceName: BUSH_MEDICINE.name,
      servicePrice: BUSH_MEDICINE.price,
      serviceDuration: BUSH_MEDICINE.duration,
      notes: BUSH_MEDICINE.notes,
    });
  };

  const handleWelcomeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!welcomeContact.name.trim() || !welcomeContact.email.trim()) {
      alert("Please share your name and email so we can respond.");
      return;
    }
    const notes = [
      "Welcome Home — by request only",
      "Interest: family farms visit, glamping & retreat at family estate",
      welcomeContact.message ? `Message: ${welcomeContact.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams({
      serviceId: "welcome-home",
      serviceName: "Welcome Home (By Request)",
      intent: "inquiry",
      name: welcomeContact.name,
      email: welcomeContact.email,
      phone: welcomeContact.phone,
      notes,
    });
    navigate(`/book-now?${params.toString()}`);
  };

  return (
    <>
      <SEO
        title={PAGE_SEO["/experiences"].title}
        description={PAGE_SEO["/experiences"].description}
        image={PAGE_SEO["/experiences"].image}
        imageAlt={PAGE_SEO["/experiences"].imageAlt}
        url="/experiences"
        keywords={PAGE_SEO["/experiences"].keywords}
      />

      <div className="luxury-page">
        <PageHeader
          variant="tours"
          eyebrow="Portals of Samadhi · Experiences"
          title={
            <>
              Experiences Money <em>Can&apos;t Buy</em>
            </>
          }
          description="Jamaica tours and sacred family experiences rooted in land and lineage — airport pickup, farm stays, simple beach retreats, fully custom journeys, and traditional bush medicine. Small groups. Real hosts. Never mass tourism."
          actions={
            <>
              <a href="#packages" className="luxury-btn luxury-btn--gold">
                View Packages
                <ArrowRight size={14} />
              </a>
              <Link to="/book-now" className="luxury-btn luxury-btn--outline">
                Book a free session
              </Link>
            </>
          }
          meta={
            <>
              <span>
                <MapPin size={14} /> Jamaica · island-wide
              </span>
              <span>
                <Users size={14} /> Families &amp; small groups
              </span>
              <span>
                <Calendar size={14} /> Clear packages · custom on request
              </span>
            </>
          }
        />

        <div className="luxury-page-body" id="packages">
          <section className="luxury-section" style={{ paddingTop: "2.5rem", paddingBottom: "0.5rem" }}>
            <div className="luxury-section__header" style={{ marginBottom: "1.75rem" }}>
              <p className="luxury-hero__eyebrow">Tour Packages</p>
              <h2 className="luxury-section__title">
                Choose How You <em>Arrive</em>
              </h2>
              <p className="luxury-section__lead">
                Five clear paths — from a simple airport transfer to a fully custom sacred
                retreat. Every option is personal, high-touch, and designed so you feel like a
                guest of the land, not a passenger on an itinerary.
              </p>
            </div>

            {/* Top row: three equal entry packages */}
            <div className="luxury-exp-grid">
              <article className="luxury-exp-card" id="airport-pickup" aria-labelledby="pkg-airport">
                <span className="luxury-exp-card__badge">
                  <Plane size={12} style={{ marginRight: 6, display: "inline" }} />
                  Transfer
                </span>
                <h3 className="luxury-exp-card__title" id="pkg-airport">
                  Airport Runs
                </h3>
                <p className="luxury-exp-card__desc">
                  Land well. Private pickup, drop-off, or round trip — host-driven, not a random
                  cab. Full options and clear prices on our Airport Runs page.
                </p>
                <p className="luxury-exp-card__meta">
                  From ${AIRPORT_PICKUP.price} one-way · Round trip available
                </p>
                <div className="luxury-exp-card__actions">
                  <Link to="/airport-runs" className="luxury-btn luxury-btn--gold">
                    Airport Runs page
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    className="luxury-btn luxury-btn--outline"
                    onClick={handleAirportBook}
                  >
                    Quick-book pickup
                  </button>
                </div>
              </article>

              <article className="luxury-exp-card" id="welcome-home" aria-labelledby="pkg-welcome">
                <span className="luxury-exp-card__badge luxury-exp-card__badge--soft">
                  By request only
                </span>
                <h3 className="luxury-exp-card__title" id="pkg-welcome">
                  Welcome Home
                </h3>
                <p className="luxury-exp-card__desc">
                  Visit our collection of family farms. Glamp and retreat at our humble family
                  estate — hospitality rooted in lineage, not a resort brochure.
                </p>
                <p className="luxury-exp-card__meta">Family farms · Glamping · Estate retreat</p>
                <form onSubmit={handleWelcomeRequest} className="luxury-field-grid" style={{ marginTop: "0.25rem" }}>
                  <div className="luxury-field">
                    <label htmlFor="welcome-name">Name *</label>
                    <input
                      id="welcome-name"
                      value={welcomeContact.name}
                      onChange={(e) =>
                        setWelcomeContact((c) => ({ ...c, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="welcome-email">Email *</label>
                    <input
                      id="welcome-email"
                      type="email"
                      value={welcomeContact.email}
                      onChange={(e) =>
                        setWelcomeContact((c) => ({ ...c, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="luxury-field" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="welcome-message">When are you hoping to visit?</label>
                    <textarea
                      id="welcome-message"
                      rows={2}
                      placeholder="Dates, group size, what you’re seeking…"
                      value={welcomeContact.message}
                      onChange={(e) =>
                        setWelcomeContact((c) => ({ ...c, message: e.target.value }))
                      }
                    />
                  </div>
                  <div className="luxury-exp-card__actions" style={{ gridColumn: "1 / -1" }}>
                    <button type="submit" className="luxury-btn luxury-btn--gold">
                      Request Welcome Home
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </article>

              <article
                className="luxury-exp-card luxury-exp-card--soon"
                id="visit-villa"
                aria-labelledby="pkg-villa"
              >
                <span className="luxury-exp-card__badge">Coming soon</span>
                <h3 className="luxury-exp-card__title" id="pkg-villa">
                  Visit the Villa
                </h3>
                <p className="luxury-exp-card__desc">
                  A refined villa stay experience is on the way. Join the waitlist through Work
                  With Us if you’d like first notice when doors open.
                </p>
                <p className="luxury-exp-card__meta">Villa hospitality · Details forthcoming</p>
                <div className="luxury-exp-card__actions">
                  <button type="button" className="luxury-btn luxury-btn--outline" disabled>
                    Coming Soon
                  </button>
                  <Link to="/book-now" className="luxury-btn luxury-btn--outline">
                    Notify Me
                  </Link>
                </div>
              </article>
            </div>

            {/* Closing pair: Bush Medicine + Custom Retreat teaser */}
            <div className="luxury-exp-closing">
              <article
                className="luxury-exp-card luxury-exp-card--closing-pair"
                id="bush-medicine"
                aria-labelledby="pkg-bush"
              >
                <span className="luxury-exp-card__badge">
                  <Leaf size={12} style={{ marginRight: 6, display: "inline" }} />
                  Healing
                </span>
                <h3 className="luxury-exp-card__title" id="pkg-bush">
                  Bush Medicine
                </h3>
                <p className="luxury-exp-card__desc">
                  Learn how to transform your outlook on health with traditional medicine based
                  on a mucus-removing lifestyle — plants, practice, and a clearer way of living
                  in the body.
                </p>
                <p className="luxury-exp-card__meta">
                  From ${BUSH_MEDICINE.price} · {BUSH_MEDICINE.duration}
                </p>
                <div className="luxury-exp-card__actions">
                  <button
                    type="button"
                    className="luxury-btn luxury-btn--gold"
                    onClick={handleBushMedicineBook}
                  >
                    Book Bush Medicine
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>

              <article
                className="luxury-exp-card luxury-exp-card--featured luxury-exp-card--closing-pair"
                id="custom-retreat"
                aria-labelledby="pkg-custom"
              >
                <span className="luxury-exp-card__badge">Signature path</span>
                <h3 className="luxury-exp-card__title" id="pkg-custom">
                  Custom Retreat
                </h3>
                <p className="luxury-exp-card__desc">
                  Two clear ways to retreat with us. Start simple — beach and stay — or build a
                  fully custom tour from real activities on the land.
                </p>
                <p className="luxury-exp-card__meta">
                  Simple from ${SIMPLE_RETREAT.price} · Or fully custom
                </p>
                <div className="luxury-exp-card__actions">
                  <Link to="/custom-retreat" className="luxury-btn luxury-btn--gold">
                    Book Your Retreat
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </div>
          </section>

          <ConversionClose variant="tours" />

          <section className="luxury-section" style={{ paddingTop: "0.5rem", paddingBottom: "3rem" }}>
            <div className="luxury-panel" style={{ textAlign: "center", maxWidth: "40rem", margin: "0 auto" }}>
              <p className="luxury-hero__eyebrow">Samadhi Productions</p>
              <h2 className="luxury-panel__title" style={{ marginBottom: "0.65rem" }}>
                Looking for digital work instead?
              </h2>
              <p className="luxury-panel__subtitle" style={{ marginBottom: "1.25rem" }}>
                Cinematic shorts, campaigns, and project coordination live under Samadhi
                Productions — a separate door, same house.
              </p>
              <a
                href="https://www.samadhiproductions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn luxury-btn--outline"
              >
                Visit Samadhi Productions
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ExperiencesPage;
