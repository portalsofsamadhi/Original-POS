import SEO from "./SEO";
import { PAGE_SEO } from "../data/seoConfig";
import LuxuryHeroSection from "./home/LuxuryHeroSection";
import FeaturedServicesSection from "./home/FeaturedServicesSection";
import LuxuryApproachSection from "./home/LuxuryApproachSection";
import ExperiencesSection from "./home/ExperiencesSection";
import ConversionHowItWorks from "./layout/ConversionHowItWorks";
import ProductionPortalLink from "./home/ProductionPortalLink";
import "../styles/luxury-theme.css";

const Home = () => {
  return (
    <>
      <SEO
        title={PAGE_SEO["/"].title}
        description={PAGE_SEO["/"].description}
        image={PAGE_SEO["/"].image}
        imageAlt={PAGE_SEO["/"].imageAlt}
        imageWidth={1200}
        imageHeight={630}
        url="/"
        keywords={PAGE_SEO["/"].keywords}
        schemaType="Organization"
      />

      <div className="luxury-site min-h-screen">
        <LuxuryHeroSection />
        <FeaturedServicesSection />
        <LuxuryApproachSection />
        <ExperiencesSection />
        <ConversionHowItWorks />
        <ProductionPortalLink />
      </div>
    </>
  );
};

export default Home;
