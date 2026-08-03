import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  Heart,
  Leaf,
  MapPin,
  Mountain,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import { PAGE_SEO } from "../data/seoConfig";
import {
  ACCOMMODATION_TYPES,
  TOUR_CATEGORIES,
  TOUR_EXPERIENCES,
  VEHICLE_TYPES,
  experiencePrice,
  type TourCategoryId,
} from "../data/tourExperiences";
import "../styles/luxury-theme.css";

const CATEGORY_ICONS: Record<TourCategoryId, React.ElementType> = {
  nature: Mountain,
  traditional: Sparkles,
  healing: Heart,
  spiritual: Sparkles,
  herbalism: Leaf,
};

/** Fixed simple retreat — beach + comfortable stay. One-click book. */
export const SIMPLE_RETREAT = {
  id: "simple-retreat",
  name: "Simple Custom Retreat",
  price: 550,
  duration: "1 night / 2 days",
  guests: "Up to 2 guests",
  includes: [
    "Guided beach visit on Jamaica’s quieter shoreline",
    "Comfortable shared or private-style accommodation (based on availability)",
    "Local host support for arrival and day flow",
    "Light orientation to the land and surrounding area",
  ],
  notes: [
    "Simple Custom Retreat — beach visit + comfortable accommodation",
    "Includes: guided beach visit",
    "Includes: comfortable accommodation (1 night)",
    "Includes: local host support & light orientation",
    "Guests: up to 2 (add-ons available on request)",
    "Duration: 1 night / 2 days",
  ].join("\n"),
};

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

type CustomMode = "simple" | "full";

const ExperiencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [customMode, setCustomMode] = useState<CustomMode>("simple");
  const [activeCategory, setActiveCategory] = useState<TourCategoryId>("nature");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numParticipants, setNumParticipants] = useState(2);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [accommodation, setAccommodation] = useState<string>(ACCOMMODATION_TYPES[0].id);
  const [vehicle, setVehicle] = useState<string>(VEHICLE_TYPES[0].id);
  const [specialRequests, setSpecialRequests] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [welcomeContact, setWelcomeContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const numDays = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(1, diff > 0 ? diff : 1);
    }
    return 6;
  }, [startDate, endDate]);

  const maxActivities = Math.max(2, numDays * 2);
  const basePerDay = 180;
  const chauffeurFee = 500;
  const chefFee = 500;
  const vehicleRate = VEHICLE_TYPES.find((v) => v.id === vehicle)?.dailyRate ?? 89;
  const vehicleFee = vehicleRate * numDays;

  const selectedExperiences = useMemo(
    () => TOUR_EXPERIENCES.filter((e) => selectedIds.includes(e.id)),
    [selectedIds]
  );

  const activityTotal = useMemo(
    () =>
      selectedExperiences.reduce(
        (sum, exp) => sum + experiencePrice(exp, numParticipants),
        0
      ),
    [selectedExperiences, numParticipants]
  );

  const totalPrice =
    basePerDay * numDays + chauffeurFee + chefFee + vehicleFee + activityTotal;

  const categoryMeta = TOUR_CATEGORIES.find((c) => c.id === activeCategory)!;
  const categoryItems = TOUR_EXPERIENCES.filter((e) => e.category === activeCategory);

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of TOUR_CATEGORIES) {
      map[cat.id] = TOUR_EXPERIENCES.filter((e) => e.category === cat.id).length;
    }
    return map;
  }, []);

  const toggleExperience = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxActivities) return prev;
      return [...prev, id];
    });
  };

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

  const handleSimpleRetreatBook = () => {
    goToPayment({
      serviceId: SIMPLE_RETREAT.id,
      serviceName: SIMPLE_RETREAT.name,
      servicePrice: SIMPLE_RETREAT.price,
      serviceDuration: SIMPLE_RETREAT.duration,
      notes: SIMPLE_RETREAT.notes,
    });
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

  const handleFullCustomBook = () => {
    const missing: string[] = [];
    if (!contact.name.trim()) missing.push("Full Name");
    if (!contact.email.trim()) missing.push("Email");
    if (!startDate) missing.push("Start Date");
    if (!endDate) missing.push("End Date");
    if (missing.length) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    const notes = [
      "Fully Custom Jamaica Tour",
      `Participants: ${numParticipants}`,
      `Location preference: ${preferredLocation || "Open"}`,
      `Stay: ${ACCOMMODATION_TYPES.find((a) => a.id === accommodation)?.name}`,
      `Vehicle: ${VEHICLE_TYPES.find((v) => v.id === vehicle)?.name}`,
      `Experiences: ${selectedExperiences.map((e) => e.name).join(", ") || "To be curated"}`,
      `Special requests: ${specialRequests || "None"}`,
    ].join("\n");

    goToPayment({
      serviceId: "jamaica-custom-tour",
      serviceName: "Fully Custom Jamaica Tour",
      servicePrice: totalPrice,
      serviceDuration: `${numDays} day(s)`,
      notes,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      date: `${startDate} to ${endDate}`,
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
                Work With Us
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

            <div className="luxury-exp-grid">
              {/* 1. Airport Pickup */}
              <article className="luxury-exp-card" id="airport-pickup" aria-labelledby="pkg-airport">
                <span className="luxury-exp-card__badge">
                  <Plane size={12} style={{ marginRight: 6, display: "inline" }} />
                  Transfer
                </span>
                <h3 className="luxury-exp-card__title" id="pkg-airport">
                  Airport Pickup
                </h3>
                <p className="luxury-exp-card__desc">
                  Land well. Private one-way pickup from the airport to your stay — simple,
                  clear, and handled with the same care as the rest of your journey.
                </p>
                <p className="luxury-exp-card__meta">
                  From ${AIRPORT_PICKUP.price} · {AIRPORT_PICKUP.duration}
                </p>
                <div className="luxury-exp-card__actions">
                  <button
                    type="button"
                    className="luxury-btn luxury-btn--gold"
                    onClick={handleAirportBook}
                  >
                    Book Airport Pickup
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>

              {/* 2. Welcome Home */}
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

              {/* 3. Visit the Villa */}
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

              {/* 5. Bush Medicine (paired beside villa for grid balance; custom is full-width) */}
              <article className="luxury-exp-card" id="bush-medicine" aria-labelledby="pkg-bush">
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

              {/* 4. Custom Retreat — featured full width */}
              <article
                className="luxury-exp-card luxury-exp-card--featured"
                id="custom-retreat"
                aria-labelledby="pkg-custom"
              >
                <span className="luxury-exp-card__badge">Signature path</span>
                <h3 className="luxury-exp-card__title" id="pkg-custom">
                  Custom Retreat
                </h3>
                <p className="luxury-exp-card__desc">
                  Two clear ways to retreat with us. Start simple — or build a fully custom tour
                  from real activities on the land.
                </p>

                <div className="luxury-option-tabs" role="tablist" aria-label="Custom retreat options">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={customMode === "simple"}
                    className={`luxury-option-tab${customMode === "simple" ? " luxury-option-tab--active" : ""}`}
                    onClick={() => setCustomMode("simple")}
                  >
                    <span className="luxury-option-tab__label">Option 1 · Simple Retreat</span>
                    <span className="luxury-option-tab__hint">
                      Beach visit + comfortable accommodation. One-click booking. Default path.
                    </span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={customMode === "full"}
                    className={`luxury-option-tab${customMode === "full" ? " luxury-option-tab--active" : ""}`}
                    onClick={() => setCustomMode("full")}
                  >
                    <span className="luxury-option-tab__label">Option 2 · Fully Custom Tour</span>
                    <span className="luxury-option-tab__hint">
                      Build your days from nature, culture, healing, spiritual practice, and bush
                      medicine activities.
                    </span>
                  </button>
                </div>

                {customMode === "simple" && (
                  <div id="simple-retreat-panel">
                    <h4 className="luxury-panel__title" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                      What’s included
                    </h4>
                    <ul className="luxury-includes">
                      {SIMPLE_RETREAT.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="luxury-exp-card__meta" style={{ marginBottom: "1rem" }}>
                      ${SIMPLE_RETREAT.price} · {SIMPLE_RETREAT.duration} · {SIMPLE_RETREAT.guests}
                    </p>
                    <div className="luxury-exp-card__actions">
                      <button
                        type="button"
                        className="luxury-btn luxury-btn--gold"
                        onClick={handleSimpleRetreatBook}
                      >
                        Book Simple Retreat
                        <ArrowRight size={14} />
                      </button>
                      <p className="luxury-note" style={{ margin: 0, alignSelf: "center" }}>
                        Opens payment with a full package description.
                      </p>
                    </div>
                  </div>
                )}

                {customMode === "full" && (
                  <div id="full-custom-panel" style={{ marginTop: "0.5rem" }}>
                    <p className="luxury-panel__subtitle" style={{ marginBottom: "1.25rem" }}>
                      Select activity categories and build your tour. Business workshops are not
                      offered on this path — this is land, lineage, and healing only.
                    </p>

                    <p className="luxury-activity-label">Select an activity category</p>
                    <div
                      className="luxury-activity-grid"
                      role="tablist"
                      aria-label="Tour activity categories"
                    >
                      {TOUR_CATEGORIES.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat.id];
                        const active = activeCategory === cat.id;
                        const count = countsByCategory[cat.id] ?? 0;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            className={`luxury-activity-card${active ? " luxury-activity-card--active" : ""}`}
                            onClick={() => setActiveCategory(cat.id)}
                          >
                            <span className="luxury-activity-card__badge">Activity category</span>
                            <span className="luxury-activity-card__icon" aria-hidden="true">
                              <Icon size={20} strokeWidth={1.5} />
                            </span>
                            <span className="luxury-activity-card__title">{cat.label}</span>
                            <span className="luxury-activity-card__sub">{cat.shortLabel}</span>
                            <span className="luxury-activity-card__count">
                              {count} activit{count === 1 ? "y" : "ies"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="luxury-page-grid" style={{ marginTop: "1.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <section className="luxury-panel" aria-labelledby="category-heading">
                          <p className="luxury-hero__eyebrow" style={{ marginBottom: "0.5rem" }}>
                            Activities in this category
                          </p>
                          <h2 className="luxury-panel__title" id="category-heading">
                            {categoryMeta.label}
                          </h2>
                          <p className="luxury-panel__subtitle">
                            {categoryMeta.description} Tap an activity to add it to your tour
                            summary.
                          </p>

                          <div className="luxury-option-grid">
                            {categoryItems.map((exp) => {
                              const selected = selectedIds.includes(exp.id);
                              const disabled = !selected && selectedIds.length >= maxActivities;
                              const price = experiencePrice(exp, numParticipants);
                              return (
                                <button
                                  key={exp.id}
                                  type="button"
                                  className={`luxury-option${selected ? " luxury-option--selected" : ""}`}
                                  onClick={() => toggleExperience(exp.id)}
                                  disabled={disabled}
                                  aria-pressed={selected}
                                >
                                  <span className="luxury-option__check" aria-hidden="true">
                                    {selected ? <Check size={12} strokeWidth={3} /> : null}
                                  </span>
                                  <span className="luxury-option__body">
                                    <span className="luxury-option__top">
                                      <span className="luxury-option__name">{exp.name}</span>
                                      <span className="luxury-option__price">${price}</span>
                                    </span>
                                    <span className="luxury-option__desc">{exp.description}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <p className="luxury-note">
                            Pricing reflects group size. Selected: {selectedIds.length} /{" "}
                            {maxActivities} for this journey length.
                          </p>
                        </section>

                        <section className="luxury-panel" id="tour-details">
                          <h2 className="luxury-panel__title">Tour Details</h2>
                          <p className="luxury-panel__subtitle">
                            Dates, stay, and transport so we can hold the container properly.
                          </p>
                          <div className="luxury-field-grid">
                            <div className="luxury-field">
                              <label htmlFor="start">Preferred start</label>
                              <input
                                id="start"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                              />
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="end">Preferred end</label>
                              <input
                                id="end"
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(e) => setEndDate(e.target.value)}
                              />
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="guests">Guests</label>
                              <input
                                id="guests"
                                type="number"
                                min={1}
                                max={20}
                                value={numParticipants}
                                onChange={(e) =>
                                  setNumParticipants(Number(e.target.value) || 1)
                                }
                              />
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="location">Preferred region</label>
                              <input
                                id="location"
                                type="text"
                                placeholder="Blue Mountains, Portland, Ocho Rios…"
                                value={preferredLocation}
                                onChange={(e) => setPreferredLocation(e.target.value)}
                              />
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="stay">Stay style</label>
                              <select
                                id="stay"
                                value={accommodation}
                                onChange={(e) => setAccommodation(e.target.value)}
                              >
                                {ACCOMMODATION_TYPES.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="vehicle">Vehicle</label>
                              <select
                                id="vehicle"
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value)}
                              >
                                {VEHICLE_TYPES.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="luxury-field">
                            <label htmlFor="requests">Special requests</label>
                            <textarea
                              id="requests"
                              rows={3}
                              placeholder="Dietary needs, accessibility, ceremony intentions…"
                              value={specialRequests}
                              onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                          </div>
                        </section>

                        <section className="luxury-panel">
                          <h2 className="luxury-panel__title">Your Details</h2>
                          <p className="luxury-panel__subtitle">
                            We use this to confirm availability and send your journey outline.
                          </p>
                          <div className="luxury-field-grid">
                            <div className="luxury-field">
                              <label htmlFor="name">Full name *</label>
                              <input
                                id="name"
                                value={contact.name}
                                onChange={(e) =>
                                  setContact((c) => ({ ...c, name: e.target.value }))
                                }
                              />
                            </div>
                            <div className="luxury-field">
                              <label htmlFor="email">Email *</label>
                              <input
                                id="email"
                                type="email"
                                value={contact.email}
                                onChange={(e) =>
                                  setContact((c) => ({ ...c, email: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                          <div className="luxury-field">
                            <label htmlFor="phone">Phone</label>
                            <input
                              id="phone"
                              type="tel"
                              value={contact.phone}
                              onChange={(e) =>
                                setContact((c) => ({ ...c, phone: e.target.value }))
                              }
                            />
                          </div>
                        </section>
                      </div>

                      <aside className="luxury-panel luxury-panel--sticky" aria-label="Tour summary">
                        <h2 className="luxury-panel__title">Tour Summary</h2>
                        <p className="luxury-panel__subtitle">Estimate updates as you choose.</p>

                        <div className="luxury-summary-row">
                          <span>Duration</span>
                          <strong>{numDays} days</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Guests</span>
                          <strong>{numParticipants}</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Hosting base ({numDays}×${basePerDay})</span>
                          <strong>${basePerDay * numDays}</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Guide &amp; chauffeur</span>
                          <strong>${chauffeurFee}</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Personal chef</span>
                          <strong>${chefFee}</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Vehicle ({numDays}×${vehicleRate})</span>
                          <strong>${vehicleFee}</strong>
                        </div>
                        <div className="luxury-summary-row">
                          <span>Experiences</span>
                          <strong>${activityTotal}</strong>
                        </div>

                        {selectedExperiences.length > 0 && (
                          <div className="luxury-chip-list">
                            {selectedExperiences.map((e) => (
                              <span key={e.id} className="luxury-chip">
                                {e.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="luxury-summary-total">
                          <span>Estimated total</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>

                        <p className="luxury-note">
                          Final quote confirms stay rates and seasonal access. Deposit secures
                          your dates.
                        </p>

                        <button
                          type="button"
                          className="luxury-btn luxury-btn--gold"
                          style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }}
                          onClick={handleFullCustomBook}
                        >
                          Request This Custom Tour
                        </button>
                        <Link
                          to="/book-now"
                          className="luxury-btn luxury-btn--outline"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            marginTop: "0.65rem",
                          }}
                        >
                          Talk With Us First
                        </Link>
                      </aside>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className="luxury-section" style={{ paddingTop: "1rem", paddingBottom: "3rem" }}>
            <div className="luxury-panel" style={{ textAlign: "center", maxWidth: "40rem", margin: "0 auto" }}>
              <p className="luxury-hero__eyebrow">Samadhi Productions</p>
              <h2 className="luxury-panel__title" style={{ marginBottom: "0.65rem" }}>
                Looking for digital work instead?
              </h2>
              <p className="luxury-panel__subtitle" style={{ marginBottom: "1.25rem" }}>
                Cinematic shorts, campaigns, and project coordination live under Samadhi
                Productions — a separate door, same house.
              </p>
              <Link to="/production" className="luxury-btn luxury-btn--outline">
                Explore Productions
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ExperiencesPage;
