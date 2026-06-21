export interface CinematicShort {
  id: string;
  title: string;
  tag?: string;
  src: string;
  poster: string;
}

/** Short form portfolio videos from /public/Shorts */
export const CINEMATIC_SHORTS: CinematicShort[] = [
  {
    id: "frozen",
    title: "Frozen",
    tag: "Visual Piece",
    src: "/Shorts/frozen.mp4",
    poster: "/Shorts/thumbnails/frozen.jpg",
  },
  {
    id: "legend-ep1",
    title: "The Legend: EP 1",
    tag: "Series",
    src: "/Shorts/legend-ep1.mp4",
    poster: "/Shorts/thumbnails/legend-ep1.jpg",
  },
  {
    id: "london",
    title: "London",
    tag: "Cinematic",
    src: "/Shorts/london.mp4",
    poster: "/Shorts/thumbnails/london.jpg",
  },
  {
    id: "reds-crush",
    title: "Red's Crush",
    tag: "Short Film",
    src: "/Shorts/reds-crush.mp4",
    poster: "/Shorts/thumbnails/reds-crush.jpg",
  },
  {
    id: "meetup-phoenix",
    title: "Meetup with Phoenix",
    tag: "Dome Ticket",
    src: "/Shorts/meetup-phoenix.mp4",
    poster: "/Shorts/thumbnails/meetup-phoenix.jpg",
  },
  {
    id: "mj-dance",
    title: "Michael Jackson Dance",
    tag: "Performance",
    src: "/Shorts/mj-dance.mp4",
    poster: "/Shorts/thumbnails/mj-dance.jpg",
  },
  {
    id: "dbz-faceoff",
    title: "Dragon Ball Z Faceoff",
    tag: "Action",
    src: "/Shorts/dbz-faceoff.mp4",
    poster: "/Shorts/thumbnails/dbz-faceoff.jpg",
  },
];

export const getShortVideoUrl = (path: string): string => path;