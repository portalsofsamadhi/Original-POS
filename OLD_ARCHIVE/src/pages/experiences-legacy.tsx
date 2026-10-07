import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";
import ExperiencesSection from "../components/home/ExperiencesSection";
import MindSection from "../components/home/about/MindSection";
import BodySection from "../components/home/about/BodySection";
import SpiritSection from "../components/home/about/SpiritSection";
import ServiceSelection from "../components/services/ServiceSelection";
import type { Service } from "../components/services/ServiceSelection";
import "../styles/mbg-aesthetics.css";
import "../styles/samadhi-sections.css";

const ExperiencesPage = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <>
      <SEO
        title={PAGE_SEO["/experiences"].title}
        description={PAGE_SEO["/experiences"].description}
        image={PAGE_SEO["/experiences"].image}
        imageAlt={PAGE_SEO["/experiences"].imageAlt}
        url="/experiences"
        keywords={PAGE_SEO["/experiences"].keywords}
        schemaType="Service"
      />

      <div className="bg-samadhi-black min-h-screen overflow-x-hidden">
        <ExperiencesSection pageMode />

        <div className="samadhi-experiences-body">
          <MindSection />
          <BodySection paddingTop="1.5rem" />
          <SpiritSection />
        </div>

        <div
          id="services"
          className="samadhi-services-wrap"
          style={{ scrollMarginTop: "72px" }}
        >
          <div
            className="mbg-container samadhi-services-layout scroll-stagger"
            style={{ width: "100%", maxWidth: "1280px", margin: "0 auto" }}
          >
            <div className="samadhi-services-layout__main">
              <p className="samadhi-section__eyebrow scroll-fade-in">Book a Premium Service</p>
              <h2 className="samadhi-services-layout__title scroll-fade-in scroll-slide-up">
                Premium Service Packages
              </h2>
              <p className="samadhi-services-layout__desc scroll-fade-in">
                Curated programs with practitioners who match our standard of care and creative
                craft. Browse the carousel and tap a card to book.
              </p>
              <ServiceSelection
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </div>

            <aside className="samadhi-services-layout__aside scroll-fade-in">
              <p className="samadhi-services-layout__aside-label">Explore Further</p>
              <h3 className="samadhi-services-layout__aside-title">
                Learn More About Our Services
              </h3>
              <p className="samadhi-services-layout__aside-desc">
                Healing programs with Feq&apos;ad Wolde and strategic creative support with
                Mesq&apos;al Kebra. Each path reflects the same intention we bring to every
                production.
              </p>
              <div className="samadhi-services-layout__aside-actions">
                <Link to="/feqad-services" className="samadhi-services-layout__link">
                  Feq&apos;ad&apos;s Healing Services
                  <ArrowRight size={16} />
                </Link>
                <Link to="/mesqal-services" className="samadhi-services-layout__link">
                  Mesq&apos;al&apos;s Admin Services
                  <ArrowRight size={16} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperiencesPage;