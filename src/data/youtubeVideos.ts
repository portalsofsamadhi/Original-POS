export const DOME_TICKET_CHANNEL = "https://www.youtube.com/@DomeTicket";

export interface FeaturedVideo {
  id: string;
  title: string;
  series?: string;
}

/** Homepage spotlight: side-by-side cinematic embeds */
export const HOMEPAGE_FEATURED_VIDEOS: FeaturedVideo[] = [
  {
    id: "8t4XehTT0JY",
    title: "New Wave Series S3E1: New Beginning",
    series: "New Wave Series",
  },
  {
    id: "6HLR47ncMIw",
    title: "Caves of Moryana Meditation",
    series: "Deep Healing & Meditation",
  },
];

/** Mid-form series and featured videos from Dome Ticket Universe (@DomeTicket) */
export const FEATURED_YOUTUBE_VIDEOS: FeaturedVideo[] = [
  ...HOMEPAGE_FEATURED_VIDEOS,
  {
    id: "E6lUbX-i1pk",
    title: "New Wave Series S2E2: Betrayal & Goddess Awakening",
    series: "Afro-Futurist Sci-Fi Drama",
  },
  {
    id: "eHPTvM94tBU",
    title: "New Wave Series S2E1 Premiere",
    series: "New Wave Series",
  },
];