import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import ConversionHowItWorks from "../components/layout/ConversionHowItWorks";
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

      <div className="luxury-page min-h-screen overflow-x-hidden">
        <PageHeader
          variant="about"
          eyebrow="Portals of Samadhi"
          title={
            <>
              Our <em>Story</em>
            </>
          }
          description="From Scotts Hall Maroon lineage to living host work across Jamaica—tours, sacred events, healing, and cultural immersion rooted in land and lineage."
          actions={
            <>
              <Link to="/experiences" className="luxury-btn luxury-btn--gold">
                Explore tours
                <ArrowRight size={14} />
              </Link>
              <Link to="/book-now" className="luxury-btn luxury-btn--outline">
                Book a free session
              </Link>
            </>
          }
        />

        <WhoWeAreSection pageMode paddingTop="0.5rem" marginTop="0" className="about-subsection" />
        <JourneySection paddingTop="0rem" marginTop="2rem" className="about-subsection" />
        <PhilosophySection className="about-subsection" />
        <ConversionHowItWorks />
        <ConversionClose variant="about" />
      </div>
    </>
  );
};

export default AboutPage;
