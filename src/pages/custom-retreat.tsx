import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  Mountain,
  Sparkles,
} from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import { SIMPLE_RETREAT, CUSTOM_TOUR_FEES } from "../data/customRetreat";
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

type CustomMode = "simple" | "full";

const CustomRetreatPage: React.FC = () => {
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
  const { basePerDay, chauffeurFee, chefFee } = CUSTOM_TOUR_FEES;
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

  const seo = PAGE_SEO["/custom-retreat"];

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        image={seo.image}
        imageAlt={seo.imageAlt}
        url="/custom-retreat"
        keywords={seo.keywords}
      />

      <div className="luxury-page">
        <PageHeader
          variant="tours"
          eyebrow="Portals of Samadhi · Custom Retreat"
          title={
            <>
              Book Your <em>Retreat</em>
            </>
          }
          description="Two clear ways to retreat with us. Start simple — beach and stay — or build a fully custom tour from real activities on the land."
          actions={
            <>
              <a href="#retreat-options" className="luxury-btn luxury-btn--gold">
                Choose an option
                <ArrowRight size={14} />
              </a>
              <Link to="/experiences" className="luxury-btn luxury-btn--outline">
                Back to experiences
              </Link>
            </>
          }
          meta={
            <>
              <span>Simple from ${SIMPLE_RETREAT.price}</span>
              <span>Or fully custom on the land</span>
              <span>Small groups · real hosts</span>
            </>
          }
        />

        <div className="luxury-page-body" id="retreat-options">
          <section className="luxury-section" style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>
            <div
              className="luxury-option-tabs"
              role="tablist"
              aria-label="Custom retreat options"
              style={{ maxWidth: "48rem", margin: "0 auto 1.75rem" }}
            >
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
              <div
                id="simple-retreat-panel"
                className="luxury-panel"
                style={{ maxWidth: "40rem", margin: "0 auto" }}
              >
                <h2 className="luxury-panel__title" style={{ marginBottom: "0.65rem" }}>
                  What&apos;s included
                </h2>
                <ul className="luxury-includes">
                  {SIMPLE_RETREAT.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="luxury-exp-card__meta" style={{ marginBottom: "1.25rem" }}>
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
                </div>
                <p className="luxury-note" style={{ marginTop: "0.85rem" }}>
                  Opens payment with a full package description.
                </p>
              </div>
            )}

            {customMode === "full" && (
              <div id="full-custom-panel">
                <p
                  className="luxury-panel__subtitle"
                  style={{ marginBottom: "1.25rem", maxWidth: "40rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}
                >
                  Select activity categories and build your tour. This path is land, lineage, and
                  healing only.
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
                        {categoryMeta.description} Tap an activity to add it to your tour summary.
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
                            onChange={(e) => setNumParticipants(Number(e.target.value) || 1)}
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
                            onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                          />
                        </div>
                        <div className="luxury-field">
                          <label htmlFor="email">Email *</label>
                          <input
                            id="email"
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="luxury-field">
                        <label htmlFor="phone">Phone</label>
                        <input
                          id="phone"
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
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
                      Final quote confirms stay rates and seasonal access. Deposit secures your
                      dates.
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
          </section>

          <ConversionClose variant="tours" />
        </div>
      </div>
    </>
  );
};

export default CustomRetreatPage;
