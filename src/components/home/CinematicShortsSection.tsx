import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clapperboard, Loader2, Play } from "lucide-react";
import { CINEMATIC_SHORTS, getShortVideoUrl } from "../../data/cinematicShorts";
import "../../styles/samadhi-sections.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const CinematicShortsSection = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(CINEMATIC_SHORTS[0].id);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  const activeShort =
    CINEMATIC_SHORTS.find((s) => s.id === activeId) ?? CINEMATIC_SHORTS[0];
  const activeSrc = getShortVideoUrl(activeShort.src);

  const scrollRail = useCallback((direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.min(rail.clientWidth * 0.85, 320);
    rail.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const handlePick = useCallback((id: string) => {
    setActiveId(id);
    setLoadState("loading");
  }, []);

  return (
    <motion.div
      className="samadhi-shorts scroll-fade-in"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      aria-label="Short form content"
    >
      <div className="samadhi-shorts__header">
        <p className="samadhi-section__eyebrow">Short Form</p>
        <h3 className="samadhi-shorts__title">
          Immersive <span className="samadhi-section__title-accent">Snapshots</span>
        </h3>
        <p className="samadhi-shorts__desc">
          A quiet preview of our vertical and short-form work. Choose a piece and
          settle in.
        </p>
      </div>

      <div className="samadhi-shorts__stage">
        <div className="samadhi-shorts__featured">
          <div className="samadhi-shorts__featured-frame">
            {loadState === "loading" && (
              <div className="samadhi-shorts__featured-status" aria-live="polite">
                <Loader2 size={28} className="samadhi-shorts__spinner" />
                <span>Preparing preview...</span>
              </div>
            )}
            {loadState === "error" && (
              <div className="samadhi-shorts__featured-status" role="alert">
                <span>Unable to load this short. Try another pick below.</span>
              </div>
            )}
            <video
              key={activeShort.id}
              className="samadhi-shorts__featured-video"
              style={{ opacity: loadState === "ready" ? 1 : 0 }}
              src={activeSrc}
              poster={`${activeShort.poster}?v=2`}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={() => setLoadState("ready")}
              onCanPlay={() => setLoadState("ready")}
              onError={() => setLoadState("error")}
            />
          </div>
          <div className="samadhi-shorts__featured-meta">
            <Clapperboard size={18} className="samadhi-shorts__featured-icon" />
            <div>
              {activeShort.tag && (
                <span className="samadhi-shorts__tag">{activeShort.tag}</span>
              )}
              <h4 className="samadhi-shorts__featured-title">{activeShort.title}</h4>
            </div>
          </div>
        </div>

        <div className="samadhi-shorts__picker">
          <div className="samadhi-shorts__picker-bar">
            <span className="samadhi-shorts__picker-label">Choose a piece</span>
            <div className="samadhi-shorts__picker-nav">
              <button
                type="button"
                className="samadhi-shorts__nav-btn"
                onClick={() => scrollRail("left")}
                aria-label="Scroll short form gallery left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="samadhi-shorts__nav-btn"
                onClick={() => scrollRail("right")}
                aria-label="Scroll short form gallery right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="samadhi-shorts__rail-wrap">
            <div className="samadhi-shorts__rail-fade samadhi-shorts__rail-fade--left" aria-hidden="true" />
            <div className="samadhi-shorts__rail-fade samadhi-shorts__rail-fade--right" aria-hidden="true" />

            <div ref={railRef} className="samadhi-shorts__rail" role="list">
              {CINEMATIC_SHORTS.map((short) => {
                const isActive = short.id === activeId;
                return (
                  <button
                    key={short.id}
                    type="button"
                    role="listitem"
                    className={`samadhi-shorts__card${isActive ? " samadhi-shorts__card--active" : ""}`}
                    onClick={() => handlePick(short.id)}
                    aria-pressed={isActive}
                    aria-label={`Preview ${short.title}`}
                  >
                    <div className="samadhi-shorts__card-media">
                      <img
                        className="samadhi-shorts__card-thumb"
                        src={`${short.poster}?v=2`}
                        alt={`${short.title} cinematic short preview`}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                      <span className="samadhi-shorts__card-play" aria-hidden="true">
                        <Play size={14} fill="currentColor" />
                      </span>
                    </div>
                    <span className="samadhi-shorts__card-title">{short.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CinematicShortsSection;