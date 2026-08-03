import { Link } from "react-router-dom";
import { Users, Calendar, Heart } from "lucide-react";
import "../../styles/luxury-theme.css";

const offerings = [
  {
    icon: Users,
    eyebrow: "Come for a few days",
    title: "Tours",
    text: "Travel the countryside with us: hills, valleys, working farms, and forests our families still tend. Build your days from real experiences, not a fixed tourist loop.",
    href: "/experiences",
    cta: "See tour options",
  },
  {
    icon: Calendar,
    eyebrow: "Bring your people",
    title: "Event Planning",
    text: "Planning a retreat, workshop, multi-session series, or virtual gathering? We host and organize the whole container so your group can settle in and actually be present.",
    href: "/plan-retreat",
    cta: "Plan your event",
  },
  {
    icon: Heart,
    eyebrow: "Start with yourself",
    title: "Healing & Realignment",
    text: "Book a private session for energy work, sound, or bush wisdom, or join The Realignment Program if you want a full six weeks of guided change from wherever you are.",
    href: "/book-now",
    cta: "Book a session",
    secondaryHref: "/courses",
    secondaryCta: "The Realignment Program",
  },
];

const LuxuryApproachSection = () => (
  <section
    className="luxury-section luxury-section--dark"
    aria-label="What you can do with us"
    id="paths"
  >
    <div className="luxury-section__header">
      <p className="luxury-hero__eyebrow">With Portals of Samadhi</p>
      <h2 className="luxury-section__title">
        What Will You <em>Come For?</em>
      </h2>
      <p className="luxury-section__lead">
        Whether you&apos;re coming to Jamaica or simply need experienced event cultivators, we
        provide everything you need to immerse and refine. Come as you are. Leave changed. Walk
        the land on a tour, gather your people for a retreat or workshop we host and plan, or
        begin with healing, including our six-week Realignment Program. Small groups. Real roots.
      </p>
    </div>

    <div className="luxury-approach-grid luxury-paths-grid">
      {offerings.map(
        ({ icon: Icon, eyebrow, title, text, href, cta, secondaryHref, secondaryCta }) => (
          <div key={title} className="luxury-approach-card luxury-path-card">
            <p className="luxury-path-card__key">{eyebrow}</p>
            <div className="luxury-approach-card__icon">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <h3 className="luxury-approach-card__title">{title}</h3>
            <p className="luxury-approach-card__text">{text}</p>
            <div className="luxury-path-card__actions">
              <Link to={href} className="luxury-approach-card__cta">
                {cta} →
              </Link>
              {secondaryHref && secondaryCta ? (
                <Link to={secondaryHref} className="luxury-path-card__secondary">
                  {secondaryCta} →
                </Link>
              ) : null}
            </div>
          </div>
        )
      )}
    </div>
  </section>
);

export default LuxuryApproachSection;
