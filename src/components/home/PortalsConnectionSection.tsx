import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "../../styles/samadhi-sections.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PortalsConnectionSection = () => (
  <section
    id="portals-connection"
    className="samadhi-section samadhi-section--connection"
    aria-label="Samadhi Productions and Portals of Samadhi connection"
  >
    <div className="samadhi-section__inner">
      <motion.div
        className="samadhi-connection scroll-fade-in"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        custom={0}
      >
        <div className="samadhi-connection__brand">
          <img
            src="/samadhi-productions-logo.webp"
            alt="Samadhi Productions logo, cinematic studio of Portals of Samadhi"
            className="samadhi-connection__logo"
            loading="lazy"
          />
          <h2 className="samadhi-connection__title">One Vision, Two Portals</h2>
        </div>

        <p className="samadhi-connection__lead">
          Samadhi Productions was born from the desire to create cinematic work with real soul,
          diversity, and intention in the age of AI-generated content. We craft powerful short-form
          series, music videos, advertisements, and immersive digital experiences rooted in
          Afro-futurism and soul-stirring storytelling.
        </p>
        <p className="samadhi-connection__lead samadhi-connection__lead--last">
          It all began with Portals of Samadhi - our original sanctuary for healing arts,
          meditative experiences, cultural immersion, and transformative journeys in Jamaica.
        </p>

        <div className="samadhi-connection__options" role="group" aria-label="Explore productions or our story">
          <motion.div className="samadhi-connection__option" variants={fadeUp} custom={1}>
            <p className="samadhi-connection__option-copy">
              Learn more about our cinematic productions and collaboration process.
            </p>
            <Link to="/production" className="samadhi-btn samadhi-btn--gold samadhi-connection__option-cta">
              Work Together
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div className="samadhi-connection__option" variants={fadeUp} custom={2}>
            <p className="samadhi-connection__option-copy">
              Learn more about the minds and creative philosophy behind Samadhi Productions.
            </p>
            <Link to="/about" className="samadhi-btn samadhi-connection__option-cta">
              Our Story
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PortalsConnectionSection;