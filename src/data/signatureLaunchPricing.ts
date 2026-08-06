/** Site-wide Signature Launch Price framing for Samadhi Productions cinematic work. */
export const SIGNATURE_LAUNCH_PRICING = {
  headline: "Signature Launch Price: Founding Partner Rate",
  description:
    "We craft high-end short-form cinematic works (60-120 seconds) that carry intention and atmosphere. Through thoughtful collaboration, we bring your vision to life with rich visual worlds, immersive sound, and refined cinematic finish.",
  investmentLabel: "Founding Partner Investment",
  closing:
    "Limited to the first few aligned projects. We are now accepting project proposals.",
  startingAtMin: 2800,
  startingAtMax: 4500,
} as const;

/** Production (/production) sales page: warmer, more personal founding partner framing. */
export const FOUNDING_PARTNER_RATE_SECTION = {
  headline: "Founding Partner Rate",
  description:
    "For our first aligned collaborators, we offer a special rate on fully directed short-form pieces (60-120 seconds). You bring the vision; we shape the atmosphere, sound, and finish with care, so the work feels ready to share and proud to stand behind.",
  closing:
    "We're opening this to a small circle of founding partners. If your project resonates, we would love to hear from you.",
} as const;

export const formatSignatureInvestment = () =>
  `$${SIGNATURE_LAUNCH_PRICING.startingAtMin.toLocaleString("en-US")} - $${SIGNATURE_LAUNCH_PRICING.startingAtMax.toLocaleString("en-US")}`;

export const formatFoundingPartnerInvestment = () =>
  `${SIGNATURE_LAUNCH_PRICING.investmentLabel}: ${formatSignatureInvestment()}`;