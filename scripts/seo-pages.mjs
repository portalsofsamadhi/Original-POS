/** Shared SEO + sitemap data (keep in sync with src/data/seoConfig.ts) */
export const SITE_URL = "https://portalsofsamadhi.com";

export const BRAND_TAGLINE = "Thoughtful Media. Immersive Worlds.";
export const HOME_DESCRIPTION =
  "High-end short-form series, music videos, and immersive digital experiences rooted in Afro-futurist beauty and spiritual depth.";

export const PAGE_SEO = [
  {
    path: "/",
    title: `Samadhi Productions | ${BRAND_TAGLINE}`,
    description: `${HOME_DESCRIPTION} Samadhi Productions is the Afro-futurist cinematic studio of Portals of Samadhi.`,
    image: `${SITE_URL}/samadhi-productions-logo.webp`,
    imageAlt: "Samadhi Productions phoenix logo, Afro-futuristic cinematic production studio",
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/production",
    title: "Work Together | Cinematic Work That Feels Like Art | Samadhi Productions",
    description:
      "Short and mid-form cinematic pieces shaped with patience, intention, and Afro-futurist beauty. Explore selected works, packages, and how to begin a collaboration with Samadhi Productions.",
    image: `${SITE_URL}/samadhi-productions-logo.webp`,
    imageAlt: "Samadhi Productions, collaborate on premium cinematic work",
    priority: 0.95,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "Our Story | Samadhi Productions & Portals of Samadhi",
    description:
      "From sanctuary and retreat work to Samadhi Productions, an Afro-futurist cinematic studio shaped by healing roots, spiritual intention, and thoughtful media craft.",
    image: `${SITE_URL}/samadhi-transparent-logo.png`,
    imageAlt: "Samadhi Productions phoenix emblem",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/experiences",
    title: "Retreat Tours | Jamaica Cultural & Healing Adventures | Portals of Samadhi",
    description:
      "Authentic Jamaican retreat tours combining indigenous wisdom, healing arts, and natural adventures. Premium service packages and custom retreat planning.",
    image: `${SITE_URL}/images/Cell%20Phone/Picsart_25-06-23_02-22-07-116.webp`,
    imageAlt: "Jamaica retreat tour, cultural healing adventure with Portals of Samadhi",
    priority: 0.85,
    changefreq: "weekly",
  },
  {
    path: "/book-now",
    title: "Work Together | Book an Info Session | Samadhi Productions",
    description:
      "Schedule a complimentary info session to share your vision and explore cinematic collaboration, healing services, or strategic support with Samadhi Productions.",
    image: `${SITE_URL}/samadhi-productions-logo.webp`,
    imageAlt: "Book an info session with Samadhi Productions",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/courses",
    title: "Ralign | 6-Week Global Transformation Program | Portals of Samadhi",
    description:
      "A 6-week virtual transformation program combining traditional wisdom, botanical support, and modern behavior science. Available worldwide.",
    image: `${SITE_URL}/images%20-%20Copy/Site%20Files/For%20Course_edited_edited.webp`,
    imageAlt: "Ralign 6-week global transformation program by Portals of Samadhi",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/plan-retreat",
    title: "Plan Your Custom Retreat | Portals of Samadhi",
    description:
      "Design a custom healing and wellness retreat in Jamaica with professional guidance, customizable features, and culturally rooted experiences.",
    image: `${SITE_URL}/images/Cell%20Phone/Picsart_25-07-12_20-46-17-231.png`,
    imageAlt: "Plan a custom healing retreat in Jamaica with Portals of Samadhi",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/booking-services",
    title: "Book Services | Healing & Virtual Assistant | Portals of Samadhi",
    description:
      "Book healing sessions with Dr. Feq'ad Wolde or virtual assistant services with Mesq'al Kebra. Secure online scheduling with instant confirmation.",
    image: `${SITE_URL}/poslogo.webp`,
    imageAlt: "Book Portals of Samadhi services online",
    priority: 0.6,
    changefreq: "monthly",
  },
];