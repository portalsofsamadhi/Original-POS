import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { HOMEPAGE_FEATURED_VIDEOS } from "../../data/youtubeVideos";
import { CINEMATIC_SHORTS } from "../../data/cinematicShorts";
import { useIsMobile } from "../../hooks/useIsMobile";
import { buildShortPreviewUrl } from "../../utils/mobileRoutes";
import "../../styles/hero-samadhi.css";

interface HeroSectionProps {
  allowVideoAutoplay?: boolean;
}

const buildYoutubeEmbed = (videoId: string, autoplay: boolean) =>
  `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=${autoplay ? 1 : 0}&mute=1&playsinline=1`;

const HeroSection = ({ allowVideoAutoplay = true }: HeroSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [videoIndex, setVideoIndex] = useState(0);
  const [activeShortId, setActiveShortId] = useState<string | null>(null);

  const activeVideo = HOMEPAGE_FEATURED_VIDEOS[videoIndex];
  const activeShort = CINEMATIC_SHORTS.find((s) => s.id === activeShortId);

  const changeVideo = useCallback((direction: "prev" | "next") => {
    setVideoIndex((current) => {
      const total = HOMEPAGE_FEATURED_VIDEOS.length;
      return direction === "next"
        ? (current + 1) % total
        : (current - 1 + total) % total;
    });
  }, []);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 41) % 92)}%`,
        top: `${3 + ((i * 29) % 94)}%`,
        size: 1 + (i % 3),
        delay: (i % 9) * 1.2,
        duration: 8 + (i % 6) * 3,
        opacity: 0.25 + (i % 4) * 0.15,
      })),
    []
  );

  return (
    <section className="samadhi-hero samadhi-hero--video" aria-label="Samadhi Productions hero">
      <div className="samadhi-hero__bg" aria-hidden="true">
        <div className="samadhi-hero__accent-glow samadhi-hero__accent-glow--left" />
        <div className="samadhi-hero__accent-glow samadhi-hero__accent-glow--right" />
        <div className="samadhi-hero__vignette" />
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="samadhi-hero__sparkle"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="samadhi-hero__inner">
        <div className="samadhi-hero__split">
          <motion.div
            className="samadhi-hero__video-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="samadhi-hero__video-stage">
              <div className="samadhi-hero__video-glow" aria-hidden="true" />
              <div className="samadhi-hero__video-frame">
                <iframe
                  key={activeVideo.id}
                  src={buildYoutubeEmbed(activeVideo.id, allowVideoAutoplay)}
                  title={activeVideo.title}
                  className="samadhi-hero__video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  type="button"
                  className="samadhi-hero__video-nav samadhi-hero__video-nav--prev"
                  onClick={() => changeVideo("prev")}
                  aria-label="Previous featured video"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="samadhi-hero__video-nav samadhi-hero__video-nav--next"
                  onClick={() => changeVideo("next")}
                  aria-label="Next featured video"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="samadhi-hero__video-meta">
                {activeVideo.series && (
                  <span className="samadhi-hero__video-series">{activeVideo.series}</span>
                )}
                <p className="samadhi-hero__video-title">{activeVideo.title}</p>
              </div>

              <div className="samadhi-hero__ctas samadhi-hero__ctas--compact samadhi-hero__ctas--under-video">
                <button
                  type="button"
                  className="samadhi-hero__cta samadhi-hero__cta--glass samadhi-hero__cta--primary"
                  onClick={() => navigate("/book-now")}
                >
                  <span className="samadhi-hero__cta-shine" aria-hidden="true" />
                  Work Together
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="samadhi-hero__copy-col samadhi-hero__copy-col--compact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="samadhi-hero__eyebrow samadhi-hero__eyebrow--compact">
              Premium Cinematic Content
            </p>

            <h1 className="samadhi-hero__headline samadhi-hero__headline--compact">
              <span className="samadhi-hero__headline-accent">Thoughtful Media.</span>
              <br />
              <span className="samadhi-hero__headline-line">Immersive Worlds.</span>
            </h1>

            <p className="samadhi-hero__desc samadhi-hero__desc--compact">
              High-end short-form series, music videos, advertisements, and digital
              experiences rooted in Afro-futurist beauty and spiritual depth.
            </p>

            <div className="samadhi-hero__shorts">
              <div className="samadhi-hero__shorts-head">
                <span className="samadhi-hero__shorts-label">Short Form</span>
                <span className="samadhi-hero__shorts-hint">Scroll to explore</span>
              </div>
              <div className="samadhi-hero__shorts-rail" role="list">
                {CINEMATIC_SHORTS.map((short) => (
                  <button
                    key={short.id}
                    type="button"
                    role="listitem"
                    className="samadhi-hero__shorts-card"
                    onClick={() => {
                      if (isMobile) {
                        navigate(buildShortPreviewUrl(short.id));
                        return;
                      }
                      setActiveShortId(short.id);
                    }}
                    aria-label={`Play ${short.title}`}
                  >
                    <div className="samadhi-hero__shorts-thumb-wrap">
                      <img
                        src={`${short.poster}?v=2`}
                        alt={`${short.title} cinematic short thumbnail`}
                        className="samadhi-hero__shorts-thumb"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <span className="samadhi-hero__shorts-play" aria-hidden="true">
                        <Play size={12} fill="currentColor" />
                      </span>
                    </div>
                    <span className="samadhi-hero__shorts-name">{short.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {activeShort && (
          <motion.div
            className="samadhi-reel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveShortId(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeShort.title} preview`}
          >
            <motion.div
              className="samadhi-reel-modal samadhi-reel-modal--portrait samadhi-reel-modal--glass"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="samadhi-reel-close"
                onClick={() => setActiveShortId(null)}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
              <div className="samadhi-reel-player">
                <video
                  key={activeShort.id}
                  className="samadhi-reel-video samadhi-reel-video--portrait"
                  src={activeShort.src}
                  poster={`${activeShort.poster}?v=2`}
                  controls
                  playsInline
                  autoPlay
                />
              </div>
              <p className="samadhi-reel-caption">{activeShort.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;