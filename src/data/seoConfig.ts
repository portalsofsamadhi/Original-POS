export const SITE_URL = "https://portalsofsamadhi.com";
export const SITE_NAME = "Portals of Samadhi";
export const BRAND_NAME = "Samadhi Productions";

/** Primary on-site tagline, keep in sync with hero & browser titles */
export const BRAND_TAGLINE = "Explore · Heal · Thrive";
export const BRAND_EYEBROW = "Jamaica Tours · Sacred Retreats · Bush Medicine";
export const HOME_DESCRIPTION =
  "Jamaica Airport Runs, countryside Tours, custom Retreats & gatherings, Healing sessions, and The Realignment Program — family-hosted experiences from Kingston. Land well, walk the land, gather your people.";

export interface PageSeoEntry {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  keywords?: string[];
  noindex?: boolean;
  priority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
}

export const PAGE_SEO: Record<string, PageSeoEntry> = {
  "/": {
    path: "/",
    title: `Portals of Samadhi | Airport Runs, Tours, Retreats & Healing in Jamaica`,
    description: HOME_DESCRIPTION,
    image:
      "/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp",
    imageAlt: "Aerial view of Jamaican land — Portals of Samadhi homepage hero",
    keywords: [
      "jamaica tours",
      "jamaica family experiences",
      "sacred retreats jamaica",
      "bush medicine jamaica",
      "authentic jamaica cultural immersion",
      "airport pickup jamaica",
      "family farm retreats jamaica",
      "portals of samadhi",
    ],
    priority: 1,
    changefreq: "weekly",
  },
  "/about": {
    path: "/about",
    title: "Our Story | Portals of Samadhi",
    description:
      "Rooted in Scotts Hall Maroon lineage, energy healing, and land stewardship - Portals of Samadhi hosts authentic family tours and sacred events across Jamaica.",
    image: "/poslogo.webp",
    imageAlt: "Portals of Samadhi original logo",
    keywords: [
      "portals of samadhi story",
      "scotts hall maroon heritage",
      "jamaica healing tours founders",
      "authentic jamaica cultural hosts",
    ],
    priority: 0.9,
    changefreq: "monthly",
  },
  "/production": {
    path: "/production",
    title: "Work Together | Cinematic Work That Feels Like Art | Samadhi Productions",
    description:
      "Short and mid-form cinematic pieces shaped with patience, intention, and Afro-futurist beauty. Explore selected works, packages, and how to begin a collaboration with Samadhi Productions.",
    image: "/samadhi-productions-logo.webp",
    imageAlt: "Samadhi Productions, collaborate on premium cinematic work",
    keywords: [
      "AI cinematic production",
      "short form video packages",
      "mid form episodic production",
      "music visual production",
      "afro-futurist film studio",
      "cinematic collaboration",
    ],
    priority: 0.95,
    changefreq: "weekly",
  },
  "/experiences": {
    path: "/experiences",
    title: "Jamaica Tours & Sacred Experiences | Portals of Samadhi",
    description:
      "Book Jamaica experiences money can't buy: airport pickup, family farm Welcome Home stays, simple beach retreats, custom tours, and traditional bush medicine with Portals of Samadhi.",
    image: "/images - Copy/Phone/IMG-20250629-WA0045.webp",
    imageAlt: "Jamaica family tours and sacred retreats with Portals of Samadhi",
    keywords: [
      "jamaica tours",
      "jamaica family experiences",
      "airport pickup jamaica",
      "sacred retreats jamaica",
      "bush medicine jamaica",
      "custom jamaica retreat",
      "family farm glamping jamaica",
      "portals of samadhi",
    ],
    priority: 0.9,
    changefreq: "weekly",
  },
  "/airport-runs": {
    path: "/airport-runs",
    title: "Airport Runs Jamaica | Private Pickup & Drop-Off | Portals of Samadhi",
    description:
      "Private Jamaica airport runs with host care — one-way pickup or drop-off from $95, round trip $180. Land well with Portals of Samadhi, not a random cab.",
    image: "/Welcome.webp",
    imageAlt: "Private airport transfer and host welcome with Portals of Samadhi in Jamaica",
    keywords: [
      "jamaica airport pickup",
      "kingston airport transfer",
      "private airport run jamaica",
      "airport drop off jamaica",
      "meet and greet jamaica airport",
      "portals of samadhi airport",
    ],
    priority: 0.9,
    changefreq: "weekly",
  },
  "/custom-retreat": {
    path: "/custom-retreat",
    title: "Book Your Retreat | Simple or Fully Custom | Portals of Samadhi",
    description:
      "Book a simple beach retreat or build a fully custom Jamaica tour with Portals of Samadhi — land, lineage, and healing.",
    image: "/Welcome.webp",
    imageAlt: "Custom Jamaica retreat with Portals of Samadhi",
    keywords: [
      "custom jamaica retreat",
      "simple beach retreat jamaica",
      "private jamaica tour",
      "portals of samadhi retreat",
    ],
    priority: 0.85,
    changefreq: "weekly",
  },
  "/book-now": {
    path: "/book-now",
    title: "Book a Session | Portals of Samadhi",
    description:
      "Schedule a session or consultation for healing work, family tours, or sacred event planning with Portals of Samadhi.",
    image: "/poslogo.webp",
    imageAlt: "Book a session with Portals of Samadhi",
    keywords: ["book jamaica tour consultation", "energy healing session", "portals of samadhi booking"],
    priority: 0.8,
    changefreq: "monthly",
  },
  "/courses": {
    path: "/courses",
    title: "The Realignment Program | 6-Week Transformation | Portals of Samadhi",
    description:
      "A 6-week virtual transformation program combining traditional wisdom, botanical support, and modern behavior science. Available worldwide.",
    image: "/images - Copy/Site Files/For Course_edited_edited.webp",
    imageAlt: "The Realignment Program - 6-week transformation by Portals of Samadhi",
    keywords: ["realignment program", "virtual wellness course", "behavior change program"],
    priority: 0.7,
    changefreq: "monthly",
  },
  "/plan-retreat": {
    path: "/plan-retreat",
    title: "Plan an Event | Retreats, Workshops, Series & Virtual | Portals of Samadhi",
    description:
      "We host and professionally plan meaningful events - including retreats, workshops, series, and virtual gatherings - with intentional, premium care rooted in Jamaican land and lineage.",
    image: "/images - Copy/Site Files/pexels-portals-of-samadhi-luxury-travel-retreats-1039102407-20435172.jpg",
    imageAlt: "Event planning for retreats, workshops, and virtual gatherings with Portals of Samadhi",
    keywords: [
      "event planning jamaica",
      "retreat planning",
      "workshop facilitation",
      "virtual gathering host",
      "sacred ceremony planning",
    ],
    priority: 0.7,
    changefreq: "monthly",
  },

  "/booking-success": {
    path: "/booking-success",
    title: "Booking Confirmed | Portals of Samadhi",
    description: "Your booking was successful. A confirmation email has been sent.",
    image: "/poslogo.webp",
    imageAlt: "Booking confirmed",
    noindex: true,
  },
  "/booking-cancel": {
    path: "/booking-cancel",
    title: "Booking Cancelled | Portals of Samadhi",
    description: "Your booking was not completed. Return to services to try again.",
    image: "/poslogo.webp",
    imageAlt: "Booking cancelled",
    noindex: true,
  },
  "/booking": {
    path: "/booking",
    title: "Complete Payment | Portals of Samadhi",
    description: "Finalize your booking with secure payment processing.",
    image: "/poslogo.webp",
    imageAlt: "Complete booking payment",
    noindex: true,
  },
  "/booking-payment": {
    path: "/booking-payment",
    title: "Complete Payment | Portals of Samadhi",
    description: "Finalize your booking with secure payment processing.",
    image: "/poslogo.webp",
    imageAlt: "Complete booking payment",
    noindex: true,
  },
  "/profile": {
    path: "/profile",
    title: "Member Profile | Portals of Samadhi",
    description: "View and manage your member profile.",
    image: "/poslogo.webp",
    imageAlt: "Member profile",
    noindex: true,
  },
};

export const SITEMAP_PATHS = Object.values(PAGE_SEO).filter((p) => !p.noindex);

export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/poslogo.webp`,
  description:
    "Portals of Samadhi hosts authentic family tours, cultural immersion, energy healing, and sacred event planning in Jamaica, rooted in Scotts Hall Maroon heritage and land stewardship. Samadhi Productions is the sister cinematic studio.",
  foundingLocation: {
    "@type": "Place",
    name: "Airy Castle, Jamaica",
  },
  areaServed: ["Jamaica", "Worldwide"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+1-510-291-9399",
    email: "info@portalsofsamadhi.com",
    availableLanguage: ["English"],
    areaServed: "Worldwide",
  },
  sameAs: [
    "https://www.instagram.com/portalsofsamadhi",
    "https://www.facebook.com/portalsofsamadhi",
    "https://youtube.com/@dometicket",
    "https://www.linkedin.com/company/portals-of-samadhi/",
  ],
};

export const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  name: BRAND_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  description: PAGE_SEO["/"].description,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

export const resolveCanonicalUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${SITE_URL}${path}`;
};

export const resolvePath = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
};