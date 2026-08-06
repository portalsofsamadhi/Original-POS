/** Simple Custom Retreat  -  beach + stay, one-click book. */

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
    "Simple Custom Retreat  -  beach visit + comfortable accommodation",
    "Includes: guided beach visit",
    "Includes: comfortable accommodation (1 night)",
    "Includes: local host support & light orientation",
    "Guests: up to 2 (add-ons available on request)",
    "Duration: 1 night / 2 days",
  ].join("\n"),
} as const;

/** Full custom tour hosting fees (private host rates structure). */
export const CUSTOM_TOUR_FEES = {
  basePerDay: 180,
  chauffeurFee: 500,
  chefFee: 500,
} as const;
