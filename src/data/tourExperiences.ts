/** Full Tours catalog - restored original options, organized for the luxury Tours page. */

export type TourCategoryId =
  | "nature"
  | "traditional"
  | "healing"
  | "spiritual"
  | "herbalism";

export interface TourExperience {
  id: string;
  name: string;
  description: string;
  price: number;
  category: TourCategoryId;
  includedGuests: number;
  extraPerGuest: number;
}

export const TOUR_CATEGORIES: {
  id: TourCategoryId;
  label: string;
  shortLabel: string;
  eyebrow: string;
  description: string;
}[] = [
  {
    id: "nature",
    label: "Nature & Adventure",
    shortLabel: "Land journeys",
    eyebrow: "Activity Category",
    description:
      "Beaches, mineral springs, caves, mountain dining, farms, and off-path landscapes across Jamaica.",
  },
  {
    id: "traditional",
    label: "Indigenous Jamaican Wisdom",
    shortLabel: "Culture & lineage",
    eyebrow: "Activity Category",
    description:
      "Rastafari philosophy, sacred drumming, storytelling, dance, and living cultural tradition.",
  },
  {
    id: "healing",
    label: "Healing Arts",
    shortLabel: "Body & spirit",
    eyebrow: "Activity Category",
    description:
      "Sound healing, meditation, massage, energy work, breathwork, and art therapy.",
  },
  {
    id: "spiritual",
    label: "Spiritual Practices",
    shortLabel: "Sacred rites",
    eyebrow: "Activity Category",
    description:
      "Cleansing rituals and ancestral connection workshops held with reverence and care.",
  },
  {
    id: "herbalism",
    label: "Botanical Remedies",
    shortLabel: "Bush medicine",
    eyebrow: "Activity Category",
    description:
      "Jamaican bush medicine, medicinal plant identification, and botanical formulations.",
  },
];

export const TOUR_EXPERIENCES: TourExperience[] = [
  // Nature & Adventure (restored)
  {
    id: "forest-bathing",
    name: "Forest Bathing",
    description:
      "Immerse yourself in the healing power of an amazing local pool and natural spring.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "beach-visit",
    name: "Beach Visit",
    description:
      "Relax and rejuvenate with a mindful visit to Jamaica’s pristine beaches.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "mineral-hot-spring",
    name: "Mineral Hot Spring",
    description:
      "Experience the therapeutic benefits of Jamaica’s natural hot springs.",
    price: 250,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "spa",
    name: "Spa",
    description: "Enjoy a memorable spa experience with holistic treatments.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "cave-adventure",
    name: "Cave Adventure",
    description:
      "Explore Jamaica’s mystical caves and connect with the earth’s energy.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "farm-visit",
    name: "Farm Visit",
    description:
      "Discover sustainable farming and local agriculture on a guided farm tour at our tribal estates.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "strawberry-hills",
    name: "Strawberry Hills",
    description: "An ascent into the Blue Mountains, where we dine with the clouds.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "local-culture-tour",
    name: "Local Culture Tour",
    description:
      "Experience Jamaica’s vibrant culture and history on a guided tour off the beaten path.",
    price: 250,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "cooking-class",
    name: "Cooking Class",
    description:
      "Learn to prepare nourishing local meals with natural ingredients and island technique.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "nature-photography",
    name: "Nature Photography",
    description:
      "Capture the beauty of Jamaica’s landscapes with guided photography time in special places.",
    price: 200,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 25,
  },
  {
    id: "private-island-day",
    name: "Private Island Day Retreat (All-Inclusive)",
    description:
      "A full private island day retreat - immersive, intimate, and completely curated for your group.",
    price: 450,
    category: "nature",
    includedGuests: 2,
    extraPerGuest: 50,
  },

  // Indigenous Jamaican Wisdom
  {
    id: "rastafari-philosophy",
    name: "Rastafari Philosophy & Culture",
    description:
      "Deep dive into Rastafari principles, history, and spiritual practices.",
    price: 299,
    category: "traditional",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "drumming-chanting",
    name: "Traditional Drumming & Chant",
    description:
      "Learn sacred rhythms and spiritual chants from Jamaican tradition.",
    price: 165,
    category: "traditional",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "cultural-storytelling",
    name: "Cultural Storytelling & Folklore",
    description:
      "Explore Jamaica’s rich oral traditions and ancestral wisdom.",
    price: 162,
    category: "traditional",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "traditional-dance",
    name: "Sacred Movement & Dance",
    description:
      "Traditional Jamaican spiritual dance and movement practices.",
    price: 99,
    category: "traditional",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "nyahbinghi-drumming",
    name: "Nyahbinghi Drumming Lesson",
    description: "Learn the sacred Nyahbinghi rhythm and origins.",
    price: 299,
    category: "traditional",
    includedGuests: 2,
    extraPerGuest: 9,
  },

  // Botanical Remedies
  {
    id: "bush-medicine",
    name: "Jamaican Bush Medicine",
    description: "Learn traditional herbal tea medicine preparation.",
    price: 63,
    category: "herbalism",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "herb-identification",
    name: "Medicinal Plant Identification",
    description:
      "Field guide to identifying and harvesting local medicinal plants.",
    price: 99,
    category: "herbalism",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "botanical-formulations",
    name: "Botanical Formulations",
    description: "Learn Dr. Feq’ad’s signature tincture formulation method.",
    price: 299,
    category: "herbalism",
    includedGuests: 2,
    extraPerGuest: 9,
  },

  // Spiritual Practices
  {
    id: "spiritual-cleansing",
    name: "Spiritual Cleansing Rituals",
    description:
      "Learn traditional purification and protection ceremonies.",
    price: 99,
    category: "spiritual",
    includedGuests: 2,
    extraPerGuest: 9,
  },
  {
    id: "ancestral-connection",
    name: "Ancestral Connection Workshop",
    description:
      "Techniques for connecting with ancestral wisdom and guidance.",
    price: 99,
    category: "spiritual",
    includedGuests: 2,
    extraPerGuest: 9,
  },

  // Healing Arts
  {
    id: "sound-healing",
    name: "Sound Healing",
    description:
      "Experience vibrational healing through sound baths and therapeutic frequencies.",
    price: 108,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 50,
  },
  {
    id: "guided-meditation",
    name: "Guided Meditation",
    description:
      "Participate in deeply relaxing guided meditation sessions for inner peace.",
    price: 99,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 50,
  },
  {
    id: "massage-therapy",
    name: "Massage Therapy",
    description:
      "Enjoy restorative massage therapy for relaxation and holistic wellness.",
    price: 117,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 50,
  },
  {
    id: "energy-healing",
    name: "Energy Healing",
    description:
      "Receive energy healing sessions to balance and rejuvenate your mind and body.",
    price: 108,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 50,
  },
  {
    id: "pranayama",
    name: "Pranayama (Breathwork)",
    description:
      "Learn breathwork practices to enhance vitality and reduce stress.",
    price: 54,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 15,
  },
  {
    id: "art-therapy",
    name: "Art Therapy",
    description:
      "Express yourself and heal through creative art therapy sessions.",
    price: 63,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 25,
  },
  {
    id: "jamaican-meditation",
    name: "Jamaican Meditation",
    description:
      "Meditation practices grounded in island stillness, nature, and cultural rhythm.",
    price: 99,
    category: "healing",
    includedGuests: 1,
    extraPerGuest: 50,
  },
  {
    id: "herbal-tea-ceremony",
    name: "Herbal Tea Ceremony",
    description:
      "A held ceremony of traditional herbal teas for calm, connection, and nourishment.",
    price: 75,
    category: "healing",
    includedGuests: 2,
    extraPerGuest: 15,
  },
];

export const ACCOMMODATION_TYPES = [
  { id: "guesthouse", name: "Guesthouse" },
  { id: "villa", name: "Villa" },
  { id: "hotel", name: "Hotel" },
  { id: "eco-lodge", name: "Eco-Lodge" },
  { id: "boutique", name: "Boutique Hotel" },
] as const;

export const VEHICLE_TYPES = [
  { id: "sedan", name: "Sedan (Toyota Axio, Nissan AD, Honda Fit, etc.)", capacity: 3, dailyRate: 89 },
  { id: "minivan", name: "Minivan (Toyota Noah, Nissan Serena, Toyota Voxy, etc.)", capacity: 6, dailyRate: 100 },
  { id: "jeep", name: "4×4 Jeep (Suzuki Vitara, Toyota Prado, Land Cruiser, etc.)", capacity: 4, dailyRate: 120 },
  { id: "pickup", name: "Pickup Truck (Toyota Hilux, Isuzu D-Max, etc.)", capacity: 4, dailyRate: 110 },
] as const;

export function experiencePrice(exp: TourExperience, participants: number): number {
  const extra = Math.max(0, participants - exp.includedGuests);
  return exp.price + extra * exp.extraPerGuest;
}
