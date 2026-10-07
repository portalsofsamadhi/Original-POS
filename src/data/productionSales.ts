import { formatStartingPrice, PRODUCTION_PRICING } from "./productionPricing";

export interface ProductionProof {
  id: string;
  title: string;
  format: "short-form" | "mid-form";
  duration: string;
  deliverable: string;
  buyerFit: string;
  youtubeId?: string;
  poster?: string;
  videoSrc?: string;
}

export interface BuyerProfile {
  title: string;
  situation: string;
  whyFit: string;
  typicalAsk: string;
}

export interface ProductionOffer {
  id: string;
  label: string;
  startingAt: number;
  buyerFit: string;
  bestWhen: string;
  includes: string[];
  movesPrice: string[];
  typicalTimeline: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  detail: string;
}

export interface ProductionFaq {
  question: string;
  answer: string;
}

export const PRODUCTION_PROOF: ProductionProof[] = [
  {
    id: "new-wave-s3e1",
    title: "New Wave Series, Season 3, Episode 1",
    format: "mid-form",
    duration: "~23 min",
    deliverable:
      "A full episodic chapter, recurring characters, rising stakes, and an Afro-futurist world that deepens scene by scene. Proof that AI craft can carry story, emotion, and continuity across twenty-plus minutes.",
    buyerFit:
      "Look here if you are building serialized IP and need evidence that your world can hold attention over a full chapter, not just a teaser.",
    youtubeId: "8t4XehTT0JY",
  },
  {
    id: "nami-neo",
    title: "The Legend: Nami Neo",
    format: "short-form",
    duration: "~90 sec",
    deliverable:
      "An origin-story pilot in vertical format, myth, landscape, and character introduced in under two minutes, with custom title treatment and a visual language you can build from.",
    buyerFit:
      "Look here if you want to test how your universe feels on screen before committing budget to a longer piece or an ongoing series.",
    poster: "/Shorts/thumbnails/legend-ep1.jpg",
    videoSrc: "/Shorts/legend-ep1.mp4",
  },
  {
    id: "reds-crush",
    title: "Red's Crush",
    format: "short-form",
    duration: "~90 sec",
    deliverable:
      "A luxury narrative vignette built on mood, palette, and staging, the kind of short that can anchor a release, a drop, or a brand's most intimate campaign moment.",
    buyerFit:
      "Look here if the work needs to feel expensive, emotionally clear, and unmistakably yours, atmosphere doing the storytelling, not a conventional production day.",
    poster: "/Shorts/thumbnails/reds-crush.jpg",
    videoSrc: "/Shorts/reds-crush.mp4",
  },
];

export const FIT_SECTION_HEADLINE = "Who We're a Great Fit For";

export const FIT_SECTION_INTRO =
  "We do our best work with collaborators who care about craft, clarity, and intention. If something here feels familiar, we would welcome a conversation. No pressure, just an honest place to begin.";

export const BUYER_PROFILES: BuyerProfile[] = [
  {
    title: "Artists & labels",
    situation:
      "You have a single, EP, or visual world to share, and the piece needs to honor what the music already carries.",
    whyFit:
      "We treat release visuals as art objects: composition, palette, rhythm, and atmosphere shaped to feel inevitable beside the sound, all built through AI-native craft.",
    typicalAsk: "a music visual, release piece, or campaign hero (60-90 sec)",
  },
  {
    title: "Series & IP builders",
    situation:
      "You are shaping characters, mythology, or an episodic world and need to know it holds on screen.",
    whyFit:
      "New Wave is our proof of chapter-length storytelling: tone sustained across time, worlds that deepen instead of reset, without a traditional shoot schedule.",
    typicalAsk: "a pilot short, then Episode 1 (15-25 min) once the look is settled",
  },
  {
    title: "Culture & experience brands",
    situation:
      "Your brand lives in atmosphere, ritual, or transformation, and generic content would diminish what you have built.",
    whyFit:
      "We extend your existing intention into cinematic work, with Afro-futurist beauty and spiritual depth woven through every generated scene.",
    typicalAsk: "a campaign piece, brand story, or flagship vertical short",
  },
  {
    title: "Funded creators & small teams",
    situation:
      "You have vision, budget, and a deadline, but not an in-house studio to carry the full arc from idea to master.",
    whyFit:
      "Our AI-native pipeline gives you studio-level finish without the overhead of crews, locations, or gear, direction and taste remain the center of the work.",
    typicalAsk: "a scoped short or chapter with clear milestones and room to breathe",
  },
];

export const CONSULTATION_HEADLINE = "What We'll Explore Together";

export const CONSULTATION_SUBTEXT =
  "Come as you are. You don't need every answer. We'll shape the direction together.";

export const PRODUCTION_OFFERS: ProductionOffer[] = PRODUCTION_PRICING.map((tier) => {
  if (tier.id === "short-form") {
    return {
      id: tier.id,
      label: tier.label,
      startingAt: tier.startingAt,
      buyerFit:
        "For founding partners who need one finished cinematic piece (60-120 seconds) to launch, promote, or prove their vision.",
      bestWhen:
        "You are one of the first 5-8 aligned collaborators ready to invest in a signature short-form piece tailored to your project.",
      includes: [
        "Concept collaboration and creative direction",
        "Immersive audio soundscape with rights to music used in video",
        "Video editing, color grade, and audio mastering",
        "Marketing support to help launch or promote your vision",
        "AI generation and scene build: environments, characters, and motion as scoped",
        "Master delivery in agreed formats (e.g. 16:9 and/or 9:16)",
      ],
      movesPrice: [
        "Script development from zero",
        "Multiple environments or heavy compositing",
        "Extended character work or custom performance assets",
        "Extra formats, cut-downs, or rush delivery",
      ],
      typicalTimeline: "4-8 weeks from signed scope, depending on complexity",
    };
  }

  return {
    id: tier.id,
    label: tier.label,
    startingAt: tier.startingAt,
    buyerFit:
      "For when you are investing in a living chapter of story, not a longer version of a single ad.",
    bestWhen:
      "You hold a series bible, episode outline, or funded mandate for work that unfolds over time.",
    includes: [
      "Episode story architecture and beat structure",
      "Creative direction and world-consistent look across the chapter",
      "Full AI craft pipeline scaled to a 15-25 minute deliverable",
      "Post-production: edit, sound, grade, and delivery-ready master",
      "Milestone workflow: outline → generation → fine cut",
      "One consolidated revision round on the fine cut",
    ],
    movesPrice: [
      "Multiple episodes in one contract (volume discounts possible)",
      "Large cast of characters, multiple environments, or complex compositing",
      "Rush schedule or parallel deliverable formats",
      "Full script development and multiple writing passes",
    ],
    typicalTimeline: "8-14 weeks from signed scope for a first chapter",
  };
});

export const PRODUCTION_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Info session",
    detail:
      "A quiet 30-minute conversation about your vision, audience, references, and timing. No need to decide anything on the call.",
  },
  {
    step: "02",
    title: "Written scope",
    detail:
      "Within 48 hours, a clear document: deliverables, investment, timeline, payment rhythm, and what sits outside the frame.",
  },
  {
    step: "03",
    title: "Deposit & kickoff",
    detail:
      "A deposit holds your place in the studio. We align on creative brief, approvals, and the milestones ahead.",
  },
  {
    step: "04",
    title: "Creation",
    detail:
      "We generate, shape, and refine the scoped scenes with gentle check-ins, so you see the world taking form without a shoot day on the calendar.",
  },
  {
    step: "05",
    title: "Delivery",
    detail:
      "Finished masters, one scoped revision round, and handoff. Many episodic collaborators begin Episode 2 from here.",
  },
];

export const CONSULTATION_TOPICS = [
  "What success looks like for you after this project ships.",
  "Who this is really for, and what you want them to feel.",
  "Whether this is a single piece, a pilot, or the start of something bigger.",
  "References and worlds that inspire you.",
  "Timeline, budget range, and how involved you want to be in the process.",
];

export const PRODUCTION_FAQ: ProductionFaq[] = [
  {
    question: "Is the price on the site final?",
    answer:
      "The published rates are a beginning. Your written quote reflects the actual world we are building together: length, visual complexity, character scope, timeline, and deliverables.",
  },
  {
    question: "What does AI-native craft mean for my project?",
    answer:
      "Every scene is generated and directed in-house, no crew, locations, or shoot days. That gives us room to iterate on atmosphere, environment, and visual ambition while you invest in direction, taste, story, and finish. The feeling on screen is the point.",
  },
  {
    question: "Do I own the final work?",
    answer:
      "Usage and ownership are defined in your project agreement, clearly, before the deposit is placed.",
  },
  {
    question: "How do payments work?",
    answer:
      "Often 50% to begin and 50% on delivery. Mid-form work may unfold in milestones (for example, 40% / 30% / 30%). Your scope document spells it out.",
  },
  {
    question: "Can I start with a short and move to mid-form later?",
    answer:
      "Yes. Many collaborators begin with a pilot short to settle the look, then open Episode 1 once the world feels true.",
  },
  {
    question: "Is this the same as Experiences or healing services?",
    answer:
      "No. This page is for cinematic production. Retreats, healing, and admin support live under Experiences with their own packages.",
  },
];

export { formatStartingPrice };