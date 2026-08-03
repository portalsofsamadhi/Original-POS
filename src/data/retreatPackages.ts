import { HEALING_ARTS_CONTENT } from "./healingArtsContent";

/** Premium retreat activity packages for the Experiences carousel (Activities, Indigenous Wisdom, Healing Arts). */
export type RetreatPackageCategory = "activities" | "indigenous" | "healing";

export interface RetreatPackage {
  id: string;
  title: string;
  summary: string;
  price: number;
  category: RetreatPackageCategory;
}

export const RETREAT_PACKAGE_CATEGORIES: Record<RetreatPackageCategory, string> = {
  activities: "Nature & Adventure",
  indigenous: "Indigenous Wisdom",
  healing: HEALING_ARTS_CONTENT.title,
};

export const RETREAT_PACKAGES: RetreatPackage[] = [
  { id: "forest-bathing", title: "Forest Bathing", summary: "Immerse yourself in the healing power of an amazing local pool and natural spring.", price: 200, category: "activities" },
  { id: "beach-visit", title: "Beach Visit", summary: "Relax and rejuvenate with a mindful visit to Jamaica's pristine beaches.", price: 200, category: "activities" },
  { id: "mineral-hot-spring", title: "Mineral Hot Spring", summary: "Experience the therapeutic benefits of Jamaica's natural hot springs.", price: 250, category: "activities" },
  { id: "strawberry-hills", title: "Strawberry Hills", summary: "An ascent into the Blue Mountains, where we dine with the clouds.", price: 200, category: "activities" },
  { id: "local-culture-tour", title: "Local Culture Tour", summary: "Experience Jamaica's vibrant culture and history on a guided tour off the beaten path.", price: 250, category: "activities" },
  { id: "cave-adventure", title: "Cave Adventure", summary: "Explore Jamaica's mystical caves and connect with the earth's energy.", price: 200, category: "activities" },

  { id: "rastafari-philosophy", title: "Rastafari Philosophy & Culture", summary: "Deep dive into Rastafari principles, history, and spiritual practices.", price: 299, category: "indigenous" },
  { id: "drumming-chanting", title: "Traditional Drumming & Chant", summary: "Learn sacred rhythms and spiritual chants from Jamaican tradition.", price: 165, category: "indigenous" },
  { id: "cultural-storytelling", title: "Cultural Storytelling & Folklore", summary: "Explore Jamaica's rich oral traditions and ancestral wisdom.", price: 162, category: "indigenous" },
  { id: "nyahbinghi-drumming", title: "Nyahbinghi Drumming Lesson", summary: "Learn the sacred Nyahbinghi rhythm and origins.", price: 299, category: "indigenous" },
  { id: "bush-medicine", title: "Jamaican Bush Medicine", summary: "Learn traditional herbal tea medicine preparation.", price: 63, category: "indigenous" },

  { id: "sound-healing", title: "Sound Healing", summary: "Experience vibrational healing through sound baths and therapeutic frequencies.", price: 108, category: "healing" },
  { id: "guided-meditation", title: "Guided Meditation", summary: "Participate in deeply relaxing guided meditation sessions for inner peace.", price: 99, category: "healing" },
  { id: "massage-therapy", title: "Massage Therapy", summary: "Enjoy restorative massage therapy for relaxation and holistic wellness.", price: 117, category: "healing" },
  { id: "energy-healing", title: "Energy Healing", summary: "Receive energy healing sessions to balance and rejuvenate your mind and body.", price: 108, category: "healing" },
  { id: "pranayama", title: "Pranayama (Breathwork)", summary: "Learn breathwork practices to enhance vitality and reduce stress.", price: 54, category: "healing" },
  { id: "art-therapy", title: "Art Therapy", summary: "Express yourself and heal through creative art therapy sessions.", price: 63, category: "healing" },
];
