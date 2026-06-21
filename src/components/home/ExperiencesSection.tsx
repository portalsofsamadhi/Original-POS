import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Palmtree } from "lucide-react";
import "../../styles/samadhi-sections.css";

interface ExperiencesSectionProps {
  pageMode?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1 },
  }),
};

const ExperiencesSection = ({ pageMode = false }: ExperiencesSectionProps) => (
  <section
    id="experiences"
    className={`samadhi-section samadhi-section--subtle${pageMode ? " samadhi-section--experiences-page" : ""}`}
    aria-label="Retreat Tours from Portals of Samadhi"
  >
    <div className="samadhi-section__inner">
      <motion.div
        className="samadhi-section__header samadhi-section__header--center scroll-fade-in"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        custom={0}
      >
        <p className="samadhi-section__eyebrow">Portals of Samadhi</p>
        <h2 className="samadhi-section__title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}>
          {pageMode ? (
            <>Retreat <span className="samadhi-section__title-accent">Tours</span></>
          ) : (
            <>Jamaica <span className="samadhi-section__title-accent">Retreat Tours</span></>
          )}
        </h2>
        <p className="samadhi-section__desc">
          {pageMode
            ? "Authentic Jamaican retreat experiences, culture, healing, and community shaped with the same intention we bring to cinematic content."
            : "Beyond the screen: immersive retreat tours in Jamaica blending culture, indigenous wisdom, and transformative experiences."}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        variants={fadeUp}
        custom={1}
        className="flex justify-center"
      >
        <Link to="/experiences" className="samadhi-exp-card samadhi-exp-card--clean" style={{ maxWidth: "420px", width: "100%" }}>
          <Palmtree size={22} className="samadhi-exp-card__icon" strokeWidth={1.5} />
          <span className="samadhi-exp-card__label">Immersive Travel</span>
          <h3 className="samadhi-exp-card__title">Retreat Tours</h3>
          <p className="samadhi-exp-card__text">
            Jamaica retreat experiences blending culture, indigenous wisdom, healing arts, and community.
          </p>
          <span className="samadhi-exp-card__arrow">Explore →</span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default ExperiencesSection;