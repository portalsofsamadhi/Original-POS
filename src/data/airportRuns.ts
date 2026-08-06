/** Airport Runs  -  private Jamaica airport transfers with host care. */

export type AirportLocationId = "kin" | "mbj";

export interface AirportRunPackage {
  id: string;
  locationId: AirportLocationId;
  airportCode: string;
  airportName: string;
  name: string;
  price: number;
  duration: string;
  summary: string;
  includes: string[];
  notes: string;
  badge?: string;
}

export const AIRPORT_LOCATIONS: {
  id: AirportLocationId;
  code: string;
  name: string;
  city: string;
  note: string;
}[] = [
  {
    id: "kin",
    code: "KIN",
    name: "Norman Manley International Airport",
    city: "Kingston",
    note: "Our home region for most stays and land work.",
  },
  {
    id: "mbj",
    code: "MBJ",
    name: "Sangster International Airport",
    city: "Montego Bay",
    note: "Longer run from our Yallahs Bay base; rate covers fuel and road time.",
  },
];

export const AIRPORT_RUNS_INTRO =
  "Land well. Private airport runs handled by the same people who host your tours and stays, not a random cab queue. Packages are priced by airport.";

/** Kingston (KIN) one-way $95; round-trip $175 (save $15 vs two one-ways). */
/** Montego Bay (MBJ) one-way $175; round-trip $320 (save $30 vs two one-ways). */
export const AIRPORT_RUN_PACKAGES: AirportRunPackage[] = [
  {
    id: "kin-pickup",
    locationId: "kin",
    airportCode: "KIN",
    airportName: "Norman Manley International Airport",
    name: "Kingston Pickup (KIN)",
    price: 95,
    duration: "One-way · KIN",
    summary:
      "Private one-way pickup from Norman Manley International Airport (KIN) to your stay. Clear pricing from our Yallahs Bay base.",
    includes: [
      "Private vehicle and driver-host",
      "Meet-and-greet style welcome when possible",
      "Transfer from KIN to your confirmed stay",
      "Flight details confirmed after booking",
    ],
    notes: [
      "Airport Pickup  -  Norman Manley International (KIN), Kingston",
      "One-way private transfer from KIN to your stay",
      "Based near Yallahs Bay, St. Thomas, Jamaica",
      "Confirm flight details after booking",
    ].join("\n"),
    badge: "Most booked",
  },
  {
    id: "kin-dropoff",
    locationId: "kin",
    airportCode: "KIN",
    airportName: "Norman Manley International Airport",
    name: "Kingston Drop-Off (KIN)",
    price: 95,
    duration: "One-way · KIN",
    summary:
      "Private one-way run from your stay to Norman Manley International Airport (KIN) when it is time to leave.",
    includes: [
      "Pickup from your stay",
      "Private transfer to KIN",
      "Buffer time planned around your flight when shared",
      "Same host care as arrival",
    ],
    notes: [
      "Airport Drop-Off  -  Norman Manley International (KIN), Kingston",
      "One-way private transfer from stay to KIN",
      "Share flight details after booking for timing",
    ].join("\n"),
  },
  {
    id: "kin-round-trip",
    locationId: "kin",
    airportCode: "KIN",
    airportName: "Norman Manley International Airport",
    name: "Kingston Round-Trip (KIN)",
    price: 175,
    duration: "Arrival + departure · KIN",
    summary:
      "Both ways for Kingston: pickup on arrival and drop-off for departure. Round-trip saves $15 versus two separate one-ways ($190).",
    includes: [
      "KIN pickup on arrival",
      "KIN drop-off on departure",
      "Flight details coordinated for both legs",
      "Round-trip discount vs two one-way runs",
    ],
    notes: [
      "Round-Trip Airport Runs  -  Norman Manley International (KIN)",
      "Includes: pickup + drop-off",
      "Package rate: $175 (vs $190 as separate one-ways)",
      "Confirm both flight times after booking",
    ].join("\n"),
    badge: "Best value",
  },
  {
    id: "mbj-pickup",
    locationId: "mbj",
    airportCode: "MBJ",
    airportName: "Sangster International Airport",
    name: "Montego Bay Pickup (MBJ)",
    price: 175,
    duration: "One-way · MBJ",
    summary:
      "Private one-way pickup from Sangster International Airport (MBJ). Rate reflects fuel and road time from our Yallahs Bay, St. Thomas base.",
    includes: [
      "Private vehicle and driver-host",
      "Meet-and-greet style welcome when possible",
      "Transfer from MBJ toward your confirmed stay",
      "Flight details confirmed after booking",
    ],
    notes: [
      "Airport Pickup  -  Sangster International (MBJ), Montego Bay",
      "One-way private transfer from MBJ",
      "Priced from Yallahs Bay, St. Thomas base (fuel & distance)",
      "Confirm flight details after booking",
    ].join("\n"),
  },
  {
    id: "mbj-dropoff",
    locationId: "mbj",
    airportCode: "MBJ",
    airportName: "Sangster International Airport",
    name: "Montego Bay Drop-Off (MBJ)",
    price: 175,
    duration: "One-way · MBJ",
    summary:
      "Private one-way run to Sangster International Airport (MBJ). Same host care, with distance from eastern Jamaica priced in.",
    includes: [
      "Pickup from your stay",
      "Private transfer to MBJ",
      "Buffer time planned around your flight when shared",
      "Same host care as arrival",
    ],
    notes: [
      "Airport Drop-Off  -  Sangster International (MBJ), Montego Bay",
      "One-way private transfer to MBJ",
      "Share flight details after booking for timing",
    ].join("\n"),
  },
  {
    id: "mbj-round-trip",
    locationId: "mbj",
    airportCode: "MBJ",
    airportName: "Sangster International Airport",
    name: "Montego Bay Round-Trip (MBJ)",
    price: 320,
    duration: "Arrival + departure · MBJ",
    summary:
      "Both ways for Montego Bay. Round-trip saves $30 versus two separate one-ways ($350).",
    includes: [
      "MBJ pickup on arrival",
      "MBJ drop-off on departure",
      "Flight details coordinated for both legs",
      "Round-trip discount vs two one-way runs",
    ],
    notes: [
      "Round-Trip Airport Runs  -  Sangster International (MBJ)",
      "Includes: pickup + drop-off",
      "Package rate: $320 (vs $350 as separate one-ways)",
      "Confirm both flight times after booking",
    ].join("\n"),
    badge: "Best value",
  },
];

export function packagesForLocation(locationId: AirportLocationId): AirportRunPackage[] {
  return AIRPORT_RUN_PACKAGES.filter((p) => p.locationId === locationId);
}

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
