import {
  SIGNATURE_LAUNCH_PRICING,
  FOUNDING_PARTNER_RATE_SECTION,
  formatFoundingPartnerInvestment,
} from "../../data/signatureLaunchPricing";

type SignatureLaunchPricingBlockProps = {
  variant: "homepage" | "production";
};

/**
 * Canonical Signature Launch pricing copy, keep in sync across all pricing sections.
 */
const SignatureLaunchPricingBlock = ({ variant }: SignatureLaunchPricingBlockProps) => {
  if (variant === "homepage") {
    return (
      <>
        <h3 className="samadhi-pricing-block__title">{SIGNATURE_LAUNCH_PRICING.headline}</h3>
        <p className="samadhi-pricing-block__intro">{SIGNATURE_LAUNCH_PRICING.description}</p>
        <p className="samadhi-pricing-block__rates">{formatFoundingPartnerInvestment()}</p>
        <p className="samadhi-pricing-block__note">{SIGNATURE_LAUNCH_PRICING.closing}</p>
      </>
    );
  }

  return (
    <div className="samadhi-prod-pricing-intro">
      <h2 className="samadhi-prod-sales__section-title">{FOUNDING_PARTNER_RATE_SECTION.headline}</h2>
      <p className="samadhi-prod-sales__section-desc">{FOUNDING_PARTNER_RATE_SECTION.description}</p>
      <p className="samadhi-prod-sales__investment">{formatFoundingPartnerInvestment()}</p>
      <p className="samadhi-prod-sales__section-desc samadhi-prod-sales__section-desc--closing">
        {FOUNDING_PARTNER_RATE_SECTION.closing}
      </p>
    </div>
  );
};

export default SignatureLaunchPricingBlock;