/** The three excursions sold on /experiences. Nothing else on that page. */

export interface Excursion {
  id: string;
  title: string;
  badge: string;
  summary: string;
  meta: string;
  points: string[];
  bring: string;
}

export const EXCURSIONS: Excursion[] = [
  {
    id: "farms-and-forests",
    title: "Farms and Forests",
    badge: "Growing grounds",
    summary:
      "A day on the farms our family and our friends still work, and on other ground you will not find written up.",
    meta: "St. Thomas, and a friend's ground when the day calls for it",
    points: [
      "Home ground is Yallahs Bay and Airy Castle. Some days stay there. Some days ride out to a friend's farm or a forest track.",
      "You walk rows that are in season, with the people who tend them.",
      "The other stops are back roads and forest places that do not show up on the posters.",
      "There is time to taste what is growing and ask how it is grown.",
    ],
    bring: "Tell us the date, how many people, and whether you want to stay in St. Thomas or go to a friend's ground.",
  },
  {
    id: "sights-and-sounds",
    title: "The Best of Jamaica's Sights and Sounds",
    badge: "Famous stops",
    summary:
      "A basic day at the places Jamaica is known for. One city or coast in a day. We drive, walk the stops with you, and leave time at each one. The music is part of the day, at the museum and wherever the speakers are already on.",
    meta: "One area per day. Tickets at the gate are separate.",
    points: [
      "Kingston: Bob Marley Museum and Devon House.",
      "Ocho Rios: Dunn's River Falls.",
      "Montego Bay: Rose Hall Great House and Doctor's Cave Beach.",
      "Negril: Rick's Café.",
    ],
    bring: "Tell us which stops you want and the date. We send the gate costs for that day before you commit.",
  },
  {
    id: "top-three",
    title: "Top Three",
    badge: "Your cities",
    summary:
      "Name three cities. We design the itinerary: the order, the drive between them, and what each day is for. One city belongs on The Best of Jamaica's Sights and Sounds. Top Three is the trip that needs three.",
    meta: "You pick the cities. We write the days and host them.",
    points: [
      "Kingston, Ocho Rios, and Port Antonio is one example. Montego Bay, Negril, and Kingston is another. You choose the three.",
      "The plan is day by day, with drive times that fit in a real day.",
      "We host those days. The itinerary is the trip, not a list you take somewhere else.",
    ],
    bring: "Tell us the three cities, your dates, and how many people.",
  },
];

export function excursionById(id: string | null): Excursion | undefined {
  if (!id) return undefined;
  return EXCURSIONS.find((excursion) => excursion.id === id);
}
