import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../../styles/luxury-theme.css";

type ConversionCloseProps = {
  /** Primary action context for the page */
  variant?: "default" | "tours" | "events" | "healing" | "about" | "airport";
};

const COPY: Record<
  NonNullable<ConversionCloseProps["variant"]>,
  { eyebrow: string; title: string; text: string; primary: { to: string; label: string }; secondary: { to: string; label: string } }
> = {
  default: {
    eyebrow: "Next step",
    title: "Ready to begin?",
    text: "Pick a clear path. Free discovery sessions available. Small groups. Real hosts.",
    primary: { to: "/book-now", label: "Book a free session" },
    secondary: { to: "/experiences", label: "Browse tours" },
  },
  tours: {
    eyebrow: "Tours & land",
    title: "Secure your days on the land",
    text: "Start with a package or request a custom journey. We confirm availability and hold space for your group.",
    primary: { to: "#packages", label: "View packages" },
    secondary: { to: "/book-now", label: "Talk with us first" },
  },
  events: {
    eyebrow: "Gatherings",
    title: "Plan an event that actually holds",
    text: "Retreats, workshops, series, and virtual gatherings, professionally hosted with the same care as our land work.",
    primary: { to: "/book-now", label: "Book a discovery call" },
    secondary: { to: "/experiences", label: "Or explore tours" },
  },
  healing: {
    eyebrow: "Healing",
    title: "Reserve your session",
    text: "Private sessions and The Realignment Program. Choose a time. We confirm within one business day.",
    primary: { to: "/book-now", label: "Book a session" },
    secondary: { to: "/courses", label: "Realignment Program" },
  },
  about: {
    eyebrow: "Walk with us",
    title: "You’ve read the story. Come for the land.",
    text: "Tours, events, and healing, all rooted in Maroon lineage and living host work from Yallahs Bay, St. Thomas, Jamaica.",
    primary: { to: "/experiences", label: "Explore tours" },
    secondary: { to: "/book-now", label: "Book a free session" },
  },
  airport: {
    eyebrow: "Airport Runs",
    title: "Book your landing",
    text: "Private pickup, drop-off, or round trip from $95 one-way at KIN. Flight details confirmed after you book.",
    primary: { to: "#airport-packages", label: "Choose a run" },
    secondary: { to: "/experiences", label: "Add a tour or stay" },
  },
};

/**
 * High-converting close band used on interior pages.
 * Keeps Portals aesthetics; clarifies the next action.
 */
const ConversionClose = ({ variant = "default" }: ConversionCloseProps) => {
  const c = COPY[variant];
  const primaryIsHash = c.primary.to.startsWith("#");

  return (
    <section className="luxury-section luxury-convert-close" aria-label="Call to action">
      <div className="luxury-cta-panel luxury-convert-close__panel">
        <p className="luxury-production-banner__label">{c.eyebrow}</p>
        <h2 className="luxury-production-banner__title">{c.title}</h2>
        <p className="luxury-production-banner__text">{c.text}</p>
        <div className="luxury-hero__actions" style={{ justifyContent: "center", marginTop: "0.5rem" }}>
          {primaryIsHash ? (
            <a href={c.primary.to} className="luxury-btn luxury-btn--gold">
              {c.primary.label}
              <ArrowRight size={14} />
            </a>
          ) : (
            <Link to={c.primary.to} className="luxury-btn luxury-btn--gold">
              {c.primary.label}
              <ArrowRight size={14} />
            </Link>
          )}
          <Link to={c.secondary.to} className="luxury-btn luxury-btn--outline">
            {c.secondary.label}
          </Link>
        </div>
        <ul className="luxury-convert-close__trust">
          <li>Free discovery sessions</li>
          <li>Small groups by design</li>
          <li>Hosts who walk the land with you</li>
        </ul>
      </div>
    </section>
  );
};

export default ConversionClose;
