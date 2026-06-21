import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";
import WhoWeAreSection from "../components/home/about/WhoWeAreSection";
import JourneySection from "../components/home/about/JourneySection";
import PhilosophySection from "../components/home/about/PhilosophySection";
import "../styles/mbg-aesthetics.css";
import "../styles/samadhi-sections.css";
import "../styles/luxury-theme.css";

const AboutPage = () => {
  return (
    <>
      <SEO
        title={PAGE_SEO["/about"].title}
        description={PAGE_SEO["/about"].description}
        image={PAGE_SEO["/about"].image}
        imageAlt={PAGE_SEO["/about"].imageAlt}
        url="/about"
        keywords={PAGE_SEO["/about"].keywords}
      />

      <div className="luxury-site min-h-screen overflow-x-hidden">
        <div className="samadhi-section" style={{ paddingBottom: "0.5rem" }}>
          <div className="samadhi-section__inner samadhi-section__header samadhi-section__header--center">
            <p className="luxury-hero__eyebrow">Portals of Samadhi</p>
            <h1 className="luxury-hero__title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Our <em>Story</em>
            </h1>
          </div>
        </div>

        <WhoWeAreSection pageMode paddingTop="0.5rem" marginTop="0" className="about-subsection" />
        <JourneySection paddingTop="0rem" marginTop="2rem" className="about-subsection" />
        <PhilosophySection className="about-subsection" />
      </div>
    </>
  );
};

export default AboutPage;