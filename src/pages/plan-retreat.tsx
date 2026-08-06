import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Check,
  Heart,
  Leaf,
  MapPin,
  Monitor,
  Sparkles,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import "../styles/luxury-theme.css";

type EventIntent = "retreat" | "workshop" | "series" | "virtual";

type PricingTier = "essential" | "immersive" | "premier";
type FeatureCategory =
  | "stay"
  | "nourishment"
  | "healing"
  | "culture"
  | "celebration"
  | "virtual";

interface EventFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FeatureCategory;
  tiers: PricingTier[];
}

const EVENT_INTENTS: {
  id: EventIntent;
  label: string;
  text: string;
}[] = [
  {
    id: "retreat",
    label: "Retreat",
    text: "Multi-day immersive gatherings with rest, land, and intentional programming.",
  },
  {
    id: "workshop",
    label: "Workshop",
    text: "Focused sessions - healing arts, culture, leadership, or creative craft - in person or hybrid.",
  },
  {
    id: "series",
    label: "Series",
    text: "Ongoing multi-session arcs for teams, communities, or recurring circles.",
  },
  {
    id: "virtual",
    label: "Virtual Gathering",
    text: "Professionally hosted online workshops, ceremonies, and community calls worldwide.",
  },
];

/** Event planning packages - clear scope from coordination-only to full production. */
const PRICING_TIERS: Record<
  PricingTier,
  {
    name: string;
    tagline: string;
    price: number;
    perDay: boolean;
    /** When set, price is a starting package fee; additional guests add this amount each. */
    perGuestAfter?: number;
    priceNote: string;
    description: string;
    includes: string[];
    bestFor: string;
  }
> = {
  essential: {
    name: "Essential Planning",
    tagline: "Detailed coordination and personalized handling of vendors",
    price: 450,
    perDay: false,
    priceNote: "limited-time starting package rate",
    perGuestAfter: 95,
    description:
      "Ideal for workshops, virtual gatherings, and focused events that need expert facilitation without full lodging production. Introductory package rates start at $450 and scale with group size.",
    includes: [
      "Event design & run-of-show",
      "Professional hosting / facilitation",
      "Agenda, timing, and guest flow",
      "Detailed coordination and personalized handling of vendors",
      "Pre-event planning call",
    ],
    bestFor: "Workshops · Virtual · Single-day focus",
  },
  immersive: {
    name: "Immersive Retreat",
    tagline: "Multi-day hosting with hospitality",
    price: 425,
    perDay: true,
    priceNote: "limited-time rate · per guest / day",
    description:
      "For multi-day retreats and in-person series: we shape lodging guidance, meals, land-based programming, and daily rhythm.",
    includes: [
      "Everything in Essential",
      "Multi-day itinerary design",
      "Lodging recommendations & coordination",
      "Meal planning support & group hosting",
      "On-land activity pacing",
    ],
    bestFor: "Retreats · Multi-day · Small groups",
  },
  premier: {
    name: "Premier Production",
    tagline: "Private venues & full white-glove care",
    price: 575,
    perDay: true,
    priceNote: "limited-time rate · per guest / day",
    description:
      "Signature events with private estates or boutique villas, chef-led hospitality, concierge coordination, and complete production support.",
    includes: [
      "Everything in Immersive",
      "Private venue / estate matching",
      "Chef-led meal service options",
      "Dedicated event concierge",
      "Elevated ceremonial & guest experience",
    ],
    bestFor: "Private groups · Landmark events · High-touch",
  },
};

const FEATURES: EventFeature[] = [
  {
    id: "shared-room",
    name: "Shared Accommodation",
    description: "Comfortable shared rooms with fellow guests.",
    price: 85,
    category: "stay",
    tiers: ["essential"],
  },
  {
    id: "private-room",
    name: "Private Room",
    description: "Individual room with private bath where available.",
    price: 185,
    category: "stay",
    tiers: ["immersive", "premier"],
  },
  {
    id: "mountain-cabin",
    name: "Mountain Cabin / Eco Stay",
    description: "Hillside cabin or eco-lodge with canopy views.",
    price: 165,
    category: "stay",
    tiers: ["immersive"],
  },
  {
    id: "ocean-view",
    name: "Ocean-View Villa",
    description: "Private villa with panoramic coast or garden light.",
    price: 285,
    category: "stay",
    tiers: ["premier"],
  },
  {
    id: "estate-grounds",
    name: "Private Estate Grounds",
    description: "Exclusive use of cultural estate or private property.",
    price: 315,
    category: "stay",
    tiers: ["premier"],
  },
  {
    id: "basic-meals",
    name: "Nourishing Daily Meals",
    description: "Three plant-forward meals prepared with local produce.",
    price: 65,
    category: "nourishment",
    tiers: ["essential"],
  },
  {
    id: "organic-meals",
    name: "Organic Gourmet Meals",
    description: "Elevated ital and fusion cuisine, farm-sourced.",
    price: 115,
    category: "nourishment",
    tiers: ["immersive", "premier"],
  },
  {
    id: "private-chef",
    name: "Private Chef Service",
    description: "Dedicated chef for customized menus and dietary care.",
    price: 185,
    category: "nourishment",
    tiers: ["premier"],
  },
  {
    id: "tea-ceremony",
    name: "Herbal Tea Ceremony",
    description: "Bush tea service and ceremonial hospitality.",
    price: 85,
    category: "nourishment",
    tiers: ["immersive", "premier"],
  },
  {
    id: "group-sound",
    name: "Group Sound Bath",
    description: "Shared sound healing for rest and release.",
    price: 65,
    category: "healing",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "energy-healing",
    name: "Energy Healing Sessions",
    description: "Individual or small-group energy work.",
    price: 105,
    category: "healing",
    tiers: ["immersive", "premier"],
  },
  {
    id: "massage-therapy",
    name: "Therapeutic Massage",
    description: "Professional bodywork sessions during your stay.",
    price: 125,
    category: "healing",
    tiers: ["immersive", "premier"],
  },
  {
    id: "meditation",
    name: "Guided Meditation Circle",
    description: "Daily or multi-day meditation practice on the land.",
    price: 55,
    category: "healing",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "nature-walks",
    name: "Guided Nature Walks",
    description: "Hill, forest, or river walks with local knowledge.",
    price: 25,
    category: "culture",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "cultural-immersion",
    name: "Cultural Immersion Day",
    description: "Off-path sites, stories, and living tradition.",
    price: 115,
    category: "culture",
    tiers: ["immersive", "premier"],
  },
  {
    id: "bush-medicine",
    name: "Bush Medicine Workshop",
    description: "Plant identification and traditional tea craft.",
    price: 63,
    category: "culture",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "drum-circle",
    name: "Drum Circle",
    description: "Rhythmic gathering for community and release.",
    price: 55,
    category: "culture",
    tiers: ["immersive", "premier"],
  },
  {
    id: "fire-ceremony",
    name: "Fire Ceremony",
    description: "Evening fire ritual for intention and release.",
    price: 75,
    category: "celebration",
    tiers: ["immersive", "premier"],
  },
  {
    id: "water-ceremony",
    name: "Water Ceremony",
    description: "Sacred water ritual at spring, river, or sea.",
    price: 65,
    category: "celebration",
    tiers: ["immersive", "premier"],
  },
  {
    id: "stargazing",
    name: "Guided Stargazing",
    description: "Night sky observation and quiet cosmic meditation.",
    price: 55,
    category: "celebration",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "concierge",
    name: "Event Concierge",
    description: "Dedicated coordination for program and guest flow.",
    price: 95,
    category: "celebration",
    tiers: ["premier"],
  },
  {
    id: "virtual-hosting",
    name: "Professional Virtual Hosting",
    description: "Facilitated online gathering with clear structure and sacred tone.",
    price: 120,
    category: "virtual",
    tiers: ["essential", "immersive", "premier"],
  },
  {
    id: "virtual-series",
    name: "Multi-Session Series Design",
    description: "Curriculum outline, session arcs, and continuity for ongoing programs.",
    price: 180,
    category: "virtual",
    tiers: ["immersive", "premier"],
  },
  {
    id: "virtual-tech",
    name: "Tech & Production Support",
    description: "Platform setup guidance, run-of-show, and guest experience polish.",
    price: 95,
    category: "virtual",
    tiers: ["immersive", "premier"],
  },
];

const CATEGORY_META: Record<FeatureCategory, { label: string; description: string }> = {
  stay: {
    label: "Stay & Setting",
    description: "Where your people rest - from shared simplicity to private estates.",
  },
  nourishment: {
    label: "Nourishment",
    description: "Meals and tea ceremonies that taste like care and island soil.",
  },
  healing: {
    label: "Healing Arts",
    description: "Sound, bodywork, energy, and meditation woven into the program.",
  },
  culture: {
    label: "Culture & Land",
    description: "Walks, farms, bush medicine, and living Jamaican culture.",
  },
  celebration: {
    label: "Ceremony & Celebration",
    description: "Fire, water, stars, and the moments that mark a life.",
  },
  virtual: {
    label: "Virtual Production",
    description: "Hosting, series design, and support for online gatherings.",
  },
};

const CATEGORY_ORDER: FeatureCategory[] = [
  "stay",
  "nourishment",
  "healing",
  "culture",
  "celebration",
  "virtual",
];

const SERVICE_PILLARS = [
  {
    icon: Leaf,
    title: "Retreats",
    text: "Multi-day immersive events on Jamaican land - rest, culture, meals, and healing held with host care from arrival to departure.",
    example: "3-7 days · small groups · lodging & itinerary",
  },
  {
    icon: Sparkles,
    title: "Workshops",
    text: "Focused single- or multi-session programs in healing arts, bush medicine, culture, leadership, or creative craft.",
    example: "Half-day to 2 days · clear curriculum · facilitated",
  },
  {
    icon: Calendar,
    title: "Series",
    text: "Recurring multi-session arcs for communities, teams, or circles - designed for continuity, not one-off events.",
    example: "Weekly / monthly · progressive themes · lasting bonds",
  },
  {
    icon: Monitor,
    title: "Virtual Gatherings",
    text: "Professionally hosted online workshops, ceremonies, and community calls - with structure, presence, and polished flow.",
    example: "Worldwide · platform-ready · sacred tone online",
  },
];

const PlanRetreatPage: React.FC = () => {
  const navigate = useNavigate();
  const [intent, setIntent] = useState<EventIntent>("retreat");
  const [tier, setTier] = useState<PricingTier>("immersive");
  const [activeCategory, setActiveCategory] = useState<FeatureCategory>("stay");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [details, setDetails] = useState({
    startDate: "",
    endDate: "",
    participants: 4,
    location: "",
    specialRequests: "",
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });

  const days = useMemo(() => {
    if (details.startDate && details.endDate) {
      const start = new Date(details.startDate);
      const end = new Date(details.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(1, diff > 0 ? diff : 1);
    }
    return 3;
  }, [details.startDate, details.endDate]);

  const isVirtualHeavy = intent === "virtual" || intent === "series";

  const tierFeatures = useMemo(
    () => FEATURES.filter((f) => f.tiers.includes(tier)),
    [tier]
  );

  const availableCategories = CATEGORY_ORDER.filter((cat) => {
    if (isVirtualHeavy && (cat === "stay" || cat === "nourishment")) return false;
    if (!isVirtualHeavy && cat === "virtual" && intent !== "workshop") {
      // still allow virtual add-ons lightly for hybrid, but prioritize in-person categories
    }
    return tierFeatures.some((f) => f.category === cat);
  });

  const categoryFeatures = tierFeatures.filter((f) => f.category === activeCategory);

  const baseTotal = useMemo(() => {
    const t = PRICING_TIERS[tier];
    const guests = Math.max(1, details.participants);
    if (t.perDay) {
      return t.price * days * guests;
    }
    // Starting package rate (limited-time), then scales with additional guests
    if (typeof t.perGuestAfter === "number") {
      return t.price + Math.max(0, guests - 1) * t.perGuestAfter;
    }
    return t.price * guests;
  }, [tier, days, details.participants, intent]);

  const featuresTotal = useMemo(() => {
    return selectedFeatures.reduce((sum, id) => {
      const feature = FEATURES.find((f) => f.id === id);
      if (!feature) return sum;
      const multiplier =
        feature.category === "virtual" || intent === "virtual"
          ? details.participants
          : days * details.participants;
      return sum + feature.price * multiplier;
    }, 0);
  }, [selectedFeatures, days, details.participants, intent]);

  const total = baseTotal + featuresTotal;

  const handleTierChange = (next: PricingTier) => {
    setTier(next);
    const allowed = new Set(
      FEATURES.filter((f) => f.tiers.includes(next)).map((f) => f.id)
    );
    setSelectedFeatures((prev) => prev.filter((id) => allowed.has(id)));
  };

  React.useEffect(() => {
    if (!availableCategories.includes(activeCategory) && availableCategories[0]) {
      setActiveCategory(availableCategories[0]);
    }
  }, [availableCategories, activeCategory]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBook = () => {
    const missing: string[] = [];
    if (!contact.name.trim()) missing.push("Full Name");
    if (!contact.email.trim()) missing.push("Email");
    if (!details.startDate) missing.push("Start Date");
    if (intent !== "virtual" && !details.endDate) missing.push("End Date");
    if (missing.length) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    const featureNames = selectedFeatures
      .map((id) => FEATURES.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const intentLabel = EVENT_INTENTS.find((i) => i.id === intent)?.label;

    const notes = `Event planning inquiry
Intent: ${intentLabel}
Tier: ${PRICING_TIERS[tier].name}
Dates: ${details.startDate}${details.endDate ? ` to ${details.endDate}` : ""} (${days} day span)
Guests / attendees: ${details.participants}
Location preference: ${details.location || "Open / virtual"}
Selected elements: ${featureNames || "Base planning only"}
Special requests: ${details.specialRequests || "None"}
Base: $${baseTotal}
Features: $${featuresTotal}
Total estimate: $${total}`;

    navigate("/booking", {
      state: {
        serviceId: "event-planning",
        serviceName: `${intentLabel} - Event Planning`,
        servicePrice: total,
        serviceDuration: details.endDate ? `${days} days` : "Custom",
        practitionerName: "Portals of Samadhi Host Team",
        date: details.startDate,
        time: "Flexible / to be confirmed",
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        notes,
      },
    });
  };

  return (
    <>
      <SEO
        title={PAGE_SEO["/plan-retreat"].title}
        description={PAGE_SEO["/plan-retreat"].description}
        image={PAGE_SEO["/plan-retreat"].image}
        imageAlt={PAGE_SEO["/plan-retreat"].imageAlt}
        url="/plan-retreat"
        keywords={PAGE_SEO["/plan-retreat"].keywords}
      />

      <div className="luxury-page">
        <PageHeader
          variant="events"
          eyebrow="Event Planning · Portals of Samadhi"
          title={
            <>
              Plan an Event That <em>Transcends Your Expectations</em>
            </>
          }
          description="We host and professionally plan retreats, workshops, multi-session series, and virtual gatherings, with the same grounded care we bring when we walk Jamaica's land with guests."
          actions={
            <>
              <a href="#event-builder" className="luxury-btn luxury-btn--gold">
                Build your event
              </a>
              <Link to="/book-now" className="luxury-btn luxury-btn--outline">
                Book a discovery call
              </Link>
            </>
          }
          meta={
            <>
              <span>
                <Calendar size={14} /> In person &amp; virtual
              </span>
              <span>
                <MapPin size={14} /> Jamaica · Worldwide online
              </span>
              <span>
                <Users size={14} /> Small by design
              </span>
            </>
          }
        />

        <div className="luxury-page-body" id="event-builder">
          <div className="luxury-intro-block" style={{ marginTop: "2.5rem" }}>
            <p>
              Looking for more than a day tour? Planning that puts your vision at the center. We
              build a portal to the world you want to create: retreats on the land, focused
              workshops, ongoing series for communities and teams, and virtual gatherings held with
              real presence, not a generic vendor checklist.
            </p>
            <p>
              You bring the intention. We shape the container: flow, hospitality, venue or
              platform, and the quiet details that help people leave nourished instead of rushed.
              Same roots as our tours: family land near Yallahs Bay, St. Thomas, Maroon lineage,
              bush wisdom, extended into professional event planning.
            </p>
          </div>

          <section style={{ marginBottom: "2.75rem" }}>
            <div className="luxury-section__header" style={{ marginBottom: "1.5rem" }}>
              <p className="luxury-hero__eyebrow">What We Plan</p>
              <h2 className="luxury-section__title">
                Four Kinds of Events. <em>One Way of Hosting.</em>
              </h2>
              <p className="luxury-section__lead">
                Clear formats, warm hosting. Pick the shape that fits - then we’ll build the rest
                around your people and your purpose.
              </p>
            </div>
            <div className="luxury-approach-grid">
              {SERVICE_PILLARS.map(({ icon: Icon, title, text, example }) => (
                <div key={title} className="luxury-approach-card luxury-service-pillar">
                  <div className="luxury-approach-card__icon">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <p className="luxury-service-pillar__eyebrow">Event service</p>
                  <h3 className="luxury-approach-card__title">{title}</h3>
                  <p className="luxury-approach-card__text">{text}</p>
                  <p className="luxury-service-pillar__example">{example}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <div className="luxury-section__header" style={{ marginBottom: "1.25rem" }}>
              <p className="luxury-hero__eyebrow">Step One</p>
              <h2 className="luxury-section__title">
                What Kind of Event <em>Are You Creating?</em>
              </h2>
              <p className="luxury-section__lead">
                Choose the format that matches your vision. You can refine details and add-ons below.
              </p>
            </div>
            <div className="luxury-option-grid">
              {EVENT_INTENTS.map((item) => {
                const selected = intent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`luxury-option${selected ? " luxury-option--selected" : ""}`}
                    onClick={() => setIntent(item.id)}
                    aria-pressed={selected}
                  >
                    <span className="luxury-option__check">
                      {selected ? <Check size={12} strokeWidth={3} /> : null}
                    </span>
                    <span className="luxury-option__body">
                      <span className="luxury-option__name">{item.label}</span>
                      <span
                        className="luxury-option__desc"
                        style={{ display: "block", marginTop: "0.35rem" }}
                      >
                        {item.text}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <div className="luxury-section__header" style={{ marginBottom: "1.25rem" }}>
              <p className="luxury-hero__eyebrow">Step Two</p>
              <h2 className="luxury-section__title">
                Choose Your <em>Planning Package</em>
              </h2>
              <p className="luxury-section__lead">
                Packages scale from focused facilitation to full multi-day production. Rates below
                are introductory / limited-time package rates (subject to change). Essential starts
                at a package floor, then scales with your group. Not a simple per-person ticket.
              </p>
            </div>
            <div className="luxury-package-grid">
              {(Object.keys(PRICING_TIERS) as PricingTier[]).map((key) => {
                const t = PRICING_TIERS[key];
                const active = tier === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`luxury-package-card${active ? " luxury-package-card--active" : ""}`}
                    onClick={() => handleTierChange(key)}
                    aria-pressed={active}
                  >
                    <span className="luxury-package-card__best">{t.bestFor}</span>
                    <span className="luxury-package-card__name">{t.name}</span>
                    <span className="luxury-package-card__tagline">{t.tagline}</span>
                    <span className="luxury-package-card__price">
                      From ${t.price}
                      <span className="luxury-package-card__price-note"> {t.priceNote}</span>
                    </span>
                    <span className="luxury-package-card__desc">{t.description}</span>
                    <ul className="luxury-package-card__includes">
                      {t.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <span className="luxury-package-card__select">
                      {active ? "Selected package" : "Select this package"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="luxury-page-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <section className="luxury-panel">
                <h2 className="luxury-panel__title">Event Details</h2>
                <p className="luxury-panel__subtitle">
                  Dates and scale help us match venues, hosts, and virtual production needs.
                </p>
                <div className="luxury-field-grid">
                  <div className="luxury-field">
                    <label htmlFor="start">Start date *</label>
                    <input
                      id="start"
                      type="date"
                      value={details.startDate}
                      onChange={(e) =>
                        setDetails((d) => ({ ...d, startDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="end">
                      End date {intent === "virtual" ? "(optional)" : "*"}
                    </label>
                    <input
                      id="end"
                      type="date"
                      min={details.startDate || undefined}
                      value={details.endDate}
                      onChange={(e) =>
                        setDetails((d) => ({ ...d, endDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="guests">Guests / attendees</label>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      max={200}
                      value={details.participants}
                      onChange={(e) =>
                        setDetails((d) => ({
                          ...d,
                          participants: parseInt(e.target.value, 10) || 1,
                        }))
                      }
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="region">Location or platform</label>
                    <input
                      id="region"
                      placeholder="Portland, Ocho Rios, Zoom, hybrid…"
                      value={details.location}
                      onChange={(e) =>
                        setDetails((d) => ({ ...d, location: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="luxury-field">
                  <label htmlFor="special">Vision, goals &amp; special requests</label>
                  <textarea
                    id="special"
                    rows={4}
                    placeholder="What should people feel when they leave? Any must-haves, dietary needs, accessibility notes, or brand guidelines…"
                    value={details.specialRequests}
                    onChange={(e) =>
                      setDetails((d) => ({ ...d, specialRequests: e.target.value }))
                    }
                  />
                </div>
              </section>

              <section className="luxury-panel">
                <p className="luxury-hero__eyebrow" style={{ marginBottom: "0.5rem" }}>
                  Step Three
                </p>
                <h2 className="luxury-panel__title">Compose the Experience</h2>
                <p className="luxury-panel__subtitle">
                  {CATEGORY_META[activeCategory]?.description}
                </p>
                <p className="luxury-note" style={{ marginBottom: "1rem" }}>
                  Prices shown are base estimates and are subject to change until bookings are
                  made. Final prices will be quoted in your proposed itinerary.
                </p>

                <div className="luxury-tabs" role="tablist">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === cat}
                      className={`luxury-tab${activeCategory === cat ? " luxury-tab--active" : ""}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {CATEGORY_META[cat].label}
                    </button>
                  ))}
                </div>

                <div className="luxury-option-grid">
                  {categoryFeatures.map((feature) => {
                    const selected = selectedFeatures.includes(feature.id);
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        className={`luxury-option${selected ? " luxury-option--selected" : ""}`}
                        onClick={() => toggleFeature(feature.id)}
                        aria-pressed={selected}
                      >
                        <span className="luxury-option__check">
                          {selected ? <Check size={12} strokeWidth={3} /> : null}
                        </span>
                        <span className="luxury-option__body">
                          <span className="luxury-option__top">
                            <span className="luxury-option__name">{feature.name}</span>
                            <span className="luxury-option__price">${feature.price}</span>
                          </span>
                          <span className="luxury-option__desc">{feature.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {categoryFeatures.length === 0 && (
                  <p className="luxury-empty">
                    No options in this category for the selected tier. Try another level of care.
                  </p>
                )}
              </section>

              <section className="luxury-panel">
                <h2 className="luxury-panel__title">Your Details</h2>
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

            <aside className="luxury-panel luxury-panel--sticky">
              <h2 className="luxury-panel__title">Planning Summary</h2>
              <p className="luxury-panel__subtitle">A living estimate as you design.</p>

              <div className="luxury-summary-row">
                <span>Event type</span>
                <strong>{EVENT_INTENTS.find((i) => i.id === intent)?.label}</strong>
              </div>
              <div className="luxury-summary-row">
                <span>Planning package</span>
                <strong>{PRICING_TIERS[tier].name}</strong>
              </div>
              <div className="luxury-summary-row">
                <span>Span</span>
                <strong>{days} day{days === 1 ? "" : "s"}</strong>
              </div>
              <div className="luxury-summary-row">
                <span>Attendees</span>
                <strong>{details.participants}</strong>
              </div>
              <div className="luxury-summary-row">
                <span>Base planning</span>
                <strong>${baseTotal.toLocaleString()}</strong>
              </div>
              <div className="luxury-summary-row">
                <span>Selected elements</span>
                <strong>${featuresTotal.toLocaleString()}</strong>
              </div>

              {selectedFeatures.length > 0 && (
                <div className="luxury-chip-list">
                  {selectedFeatures.map((id) => {
                    const f = FEATURES.find((x) => x.id === id);
                    return f ? (
                      <span key={id} className="luxury-chip">
                        {f.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <div className="luxury-summary-total">
                <span>Estimated total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <p className="luxury-note">
                Base prices only. Subject to change until booking is confirmed. Final prices will
                be quoted in your proposed itinerary. This tool is a starting sketch; we refine
                every event by hand.
              </p>

              <button
                type="button"
                className="luxury-btn luxury-btn--gold"
                style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }}
                onClick={handleBook}
              >
                Request Event Planning
              </button>
              <Link
                to="/book-now"
                className="luxury-btn luxury-btn--outline"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.65rem" }}
              >
                Book a Discovery Call
              </Link>
              <Link
                to="/experiences"
                className="luxury-btn luxury-btn--outline"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.65rem" }}
              >
                Looking for Tours Instead?
              </Link>

              <div
                style={{
                  marginTop: "1.75rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--luxury-gold-muted)",
                  textAlign: "center",
                }}
              >
                <div className="luxury-approach-card__icon" style={{ margin: "0 auto 0.75rem" }}>
                  <Heart size={18} strokeWidth={1.5} />
                </div>
                <p className="luxury-note">
                  Premium. Intentional. Never mass-produced.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <ConversionClose variant="events" />
      </div>
    </>
  );
};

export default PlanRetreatPage;
