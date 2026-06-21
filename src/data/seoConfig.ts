export const SITE_URL = "https://portalsofsamadhi.com";
export const SITE_NAME = "Portals of Samadhi";
export const BRAND_NAME = "Samadhi Productions";

/** Primary on-site tagline, keep in sync with hero & browser titles */
export const BRAND_TAGLINE = "Thoughtful Media. Immersive Worlds.";
export const BRAND_EYEBROW = "Premium Cinematic Content";
export const HOME_DESCRIPTION =
  "High-end short-form series, music videos, and immersive digital experiences rooted in Afro-futurist beauty and spiritual depth.";

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
    title: `Samadhi Productions | ${BRAND_TAGLINE}`,
    description: `${HOME_DESCRIPTION} Samadhi Productions is the Afro-futurist cinematic studio of Portals of Samadhi.`,
    image: "/samadhi-productions-logo.webp",
    imageAlt: "Samadhi Productions phoenix logo, Afro-futuristic cinematic production studio",
    keywords: [
      "samadhi productions",
      "AI cinematic studio",
      "afro-futurist video production",
      "short form cinematic content",
      "mid form episodic production",
      "music visual production",
      "portals of samadhi",
    ],
    priority: 1,
    changefreq: "weekly",
  },
  "/about": {
    path: "/about",
    title: "Our Story | Samadhi Productions & Portals of Samadhi",
    description:
      "From sanctuary and retreat work to Samadhi Productions, an Afro-futurist cinematic studio shaped by healing roots, spiritual intention, and thoughtful media craft.",
    image: "/samadhi-transparent-logo.png",
    imageAlt: "Samadhi Productions phoenix emblem",
    keywords: [
      "samadhi productions about",
      "portals of samadhi story",
      "afro-futurist creative studio",
      "jamaica healing retreat founders",
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
    title: "Retreat Tours | Jamaica Cultural & Healing Adventures | Portals of Samadhi",
    description:
      "Authentic Jamaican retreat tours combining indigenous wisdom, healing arts, and natural adventures. Premium service packages and custom retreat planning.",
    image: "/images/Cell Phone/Picsart_25-06-23_02-22-07-116.webp",
    imageAlt: "Jamaica retreat tour, cultural healing adventure with Portals of Samadhi",
    keywords: [
      "jamaica retreat tours",
      "healing retreat jamaica",
      "cultural immersion jamaica",
      "wellness travel jamaica",
      "portals of samadhi retreats",
    ],
    priority: 0.85,
    changefreq: "weekly",
  },
  "/book-now": {
    path: "/book-now",
    title: "Work Together | Book an Info Session | Samadhi Productions",
    description:
      "Schedule a complimentary info session to share your vision and explore cinematic collaboration, healing services, or strategic support with Samadhi Productions.",
    image: "/samadhi-productions-logo.webp",
    imageAlt: "Book an info session with Samadhi Productions",
    keywords: ["book cinematic consultation", "schedule info session", "samadhi productions booking"],
    priority: 0.8,
    changefreq: "monthly",
  },
  "/courses": {
    path: "/courses",
    title: "Ralign | 6-Week Global Transformation Program | Portals of Samadhi",
    description:
      "A 6-week virtual transformation program combining traditional wisdom, botanical support, and modern behavior science. Available worldwide.",
    image: "/images - Copy/Site Files/For Course_edited_edited.webp",
    imageAlt: "Ralign 6-week global transformation program by Portals of Samadhi",
    keywords: ["ralign transformation program", "virtual wellness course", "behavior change program"],
    priority: 0.7,
    changefreq: "monthly",
  },
  "/plan-retreat": {
    path: "/plan-retreat",
    title: "Plan Your Custom Retreat | Portals of Samadhi",
    description:
      "Design a custom healing and wellness retreat in Jamaica with professional guidance, customizable features, and culturally rooted experiences.",
    image: "/images/Cell Phone/Picsart_25-07-12_20-46-17-231.png",
    imageAlt: "Plan a custom healing retreat in Jamaica with Portals of Samadhi",
    keywords: ["custom jamaica retreat", "plan wellness retreat", "private healing retreat"],
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
  name: BRAND_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/samadhi-productions-logo.webp`,
  description:
    "Afro-futurist cinematic production studio and experiential wellness brand. Samadhi Productions creates thoughtful short and mid-form media; Portals of Samadhi offers healing, retreats, and strategic support.",
  foundingLocation: {
    "@type": "Place",
    name: "Portland, Oregon, United States",
  },
  areaServed: "Worldwide",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
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