import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Film, Sparkles, Clapperboard, ArrowRight } from "lucide-react";
import SignatureLaunchPricingBlock from "../pricing/SignatureLaunchPricingBlock";
import "../../styles/samadhi-sections.css";

const CAPABILITIES = [
  {
    icon: Film,
    title: "Short-Form & Series",
    text: "Immersive episodic content, vertical series, and cinematic shorts for audiences who crave depth.",
  },
  {
    icon: Clapperboard,
    title: "Music Videos & Campaigns",
    text: "Premium music visuals and advertisement films with Afro-futurist aesthetics and emotional clarity.",
  },
  {
    icon: Sparkles,
    title: "Creative Direction",
    text: "Concept development, visual identity, and full production for brands and creators who want more than noise.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const WorkShowcaseSection = () => {
  return (
    <section
      id="productions"
      className="samadhi-section samadhi-section--work-showcase samadhi-section--stacked"
      aria-label="Samadhi Productions capabilities"
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
          <p className="samadhi-section__eyebrow">What We Create</p>
          <h2 className="samadhi-section__title">
            Cinematic Content That <span className="samadhi-section__title-accent">Resonates</span>
          </h2>
          <p className="samadhi-section__desc">
            Short and mid-form work at the highest level. Three pillars of how we shape
            thoughtful, uplifting cinematic content.
          </p>
        </motion.div>

        <div className="samadhi-cap-grid samadhi-cap-grid--trio">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="samadhi-cap-card scroll-fade-in"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              custom={i + 1}
            >
              <cap.icon className="samadhi-cap-card__icon" size={28} strokeWidth={1.5} />
              <h3 className="samadhi-cap-card__title">{cap.title}</h3>
              <p className="samadhi-cap-card__text">{cap.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="samadhi-pricing-block samadhi-pricing-block--teaser scroll-fade-in"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          custom={4}
        >
          <SignatureLaunchPricingBlock variant="homepage" />
          <Link to="/production" className="samadhi-pricing-block__cta">
            Explore Our Approach
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkShowcaseSection;