import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/samadhi-sections.css";
import "../../styles/luxury-theme.css";

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
    id="on-the-land"
    className={`samadhi-section samadhi-section--subtle luxury-section--experiences${pageMode ? " samadhi-section--experiences-page" : ""}`}
    aria-label="Life on the land"
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
        <p className="samadhi-section__eyebrow">
          {pageMode ? "Portals of Samadhi" : "On the Land"}
        </p>
        <h2 className="samadhi-section__title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}>
          {pageMode ? (
            <>
              Tours &amp; <span className="samadhi-section__title-accent">True Roots</span>
            </>
          ) : (
            <>
              Explore. <span className="samadhi-section__title-accent">Forget the tour.</span>
            </>
          )}
        </h2>
        <p className="samadhi-section__desc" style={{ maxWidth: "40rem" }}>
          {pageMode
            ? "Choose from real activities on Jamaican land: nature, culture, healing, bush medicine, and more. We'll shape the days around you."
            : "Leave the polished package behind. Make yourself at home in the countryside as we take you across hills and valleys into Jamaica's agricultural heartland: farms, forests, and quiet sanctuaries tended by our families and friends. This is where our tours live, and where many of our retreats and workshops begin too."}
        </p>
      </motion.div>

      {!pageMode && (
        <motion.div
          className="luxury-land-proof"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={fadeUp}
          custom={1}
        >
          <p className="luxury-land-proof__quote">
            You won&apos;t feel like a passenger on someone else&apos;s itinerary. You&apos;ll feel
            welcomed as a guest into a living landscape, with hosts who cook, drive, and walk the
            hills beside you.
          </p>
          <div className="luxury-hero__actions" style={{ marginTop: "1.75rem" }}>
            <Link to="/experiences" className="luxury-btn luxury-btn--gold">
              Explore Tours
            </Link>
            <Link to="/airport-runs" className="luxury-btn luxury-btn--gold">
              Airport Runs
            </Link>
          </div>
          <div className="luxury-hero__actions luxury-hero__actions--secondary">
            <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline luxury-btn--sm">
              Plan a Retreat
            </Link>
            <Link to="/courses" className="luxury-btn luxury-btn--outline luxury-btn--sm">
              Realignment Program
            </Link>
          </div>
        </motion.div>
      )}

      {pageMode && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={fadeUp}
          custom={1}
          className="flex justify-center mt-10"
        >
          <Link to="/experiences" className="luxury-btn luxury-btn--gold">
            Explore Tours
          </Link>
        </motion.div>
      )}
    </div>
  </section>
);

export default ExperiencesSection;
