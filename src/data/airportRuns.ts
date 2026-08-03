/** Airport Runs — private Jamaica airport transfers with host care. */

export interface AirportRunPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  summary: string;
  includes: string[];
  notes: string;
  badge?: string;
}

export const AIRPORT_RUNS_INTRO =
  "Land well. Private airport runs handled by the same people who host your tours and stays — not a random cab queue.";

export const AIRPORT_RUN_PACKAGES: AirportRunPackage[] = [
  {
    id: "airport-pickup",
    name: "Airport Pickup",
    price: 95,
    duration: "One-way transfer",
    summary:
      "Private one-way pickup from the airport to your stay. Simple, clear, and handled with the same care as the rest of your journey.",
    includes: [
      "Private vehicle and driver-host",
      "Meet-and-greet style welcome when possible",
      "Transfer from airport to your confirmed stay",
      "Flight details confirmed after booking",
    ],
    notes: [
      "Airport Pickup — Jamaica",
      "One-way private transfer from airport to your stay",
      "Meet-and-greet style welcome when possible",
      "Confirm flight details after booking",
    ].join("\n"),
    badge: "Most booked",
  },
  {
    id: "airport-dropoff",
    name: "Airport Drop-Off",
    price: 95,
    duration: "One-way transfer",
    summary:
      "Private one-way run from your stay back to the airport when it is time to leave. Calm timing, no scramble.",
    includes: [
      "Pickup from your stay",
      "Private transfer to the airport",
      "Buffer time planned around your flight when shared",
      "Same host care as arrival",
    ],
    notes: [
      "Airport Drop-Off — Jamaica",
      "One-way private transfer from stay to airport",
      "Share flight details after booking for timing",
    ].join("\n"),
  },
  {
    id: "airport-round-trip",
    name: "Round-Trip Airport Runs",
    price: 180,
    duration: "Arrival + departure",
    summary:
      "Both ways covered: pickup on arrival and drop-off for departure. One booking, clearer logistics for your whole stay.",
    includes: [
      "Airport pickup on arrival",
      "Airport drop-off on departure",
      "Flight details coordinated for both legs",
      "Slight savings vs two one-way runs",
    ],
    notes: [
      "Round-Trip Airport Runs — Jamaica",
      "Includes: one-way pickup + one-way drop-off",
      "Confirm both flight times after booking",
      "Package rate: $180 (vs $190 as separate one-ways)",
    ].join("\n"),
    badge: "Best value",
  },
];

export function buildAirportBookParams(pkg: AirportRunPackage): URLSearchParams {
  return new URLSearchParams({
    serviceId: pkg.id,
    serviceName: pkg.name,
    servicePrice: String(pkg.price),
    serviceDuration: pkg.duration,
    practitionerName: "Portals of Samadhi",
    notes: pkg.notes,
  });
}
