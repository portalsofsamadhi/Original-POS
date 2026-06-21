export interface ProductionTier {
  id: string;
  label: string;
  summary: string;
  examples: string;
  startingAt: number;
}

/** Homepage "starting at" tiers, Signature Launch Price for founding partners. */
export const PRODUCTION_PRICING: ProductionTier[] = [
  {
    id: "short-form",
    label: "Signature Launch: Short-Form Cinematic",
    summary:
      "A fully directed, high-end short-form cinematic piece (60–120 seconds) tailored to your project.",
    examples: "Founding partner rate for the first 5–8 aligned collaborators",
    startingAt: 2800,
  },
  {
    id: "mid-form",
    label: "Mid-Form Content",
    summary:
      "Episodic narrative chapters with world-building, story arcs, and premium post-production.",
    examples: "15–25 min episodes in the New Wave Series style",
    startingAt: 15000,
  },
];

export const formatStartingPrice = (amount: number) =>
  `$${amount.toLocaleString("en-US")}`;