import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import "../../styles/luxury-theme.css";

const HERO_POSTER =
  "/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp";

const LuxuryHeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const hero = video?.closest(".luxury-hero");
    if (!video || !hero) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!noticeOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNoticeOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [noticeOpen]);

  return (
  <section className="luxury-hero luxury-hero--cinematic motion-hero" aria-label="Portals of Samadhi hero">
    <div className="luxury-hero__media" aria-hidden="true">
      <video
        ref={videoRef}
        className="luxury-hero__bg-video"
        src="/videos/new-homepage.mp4"
        poster={HERO_POSTER}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
      <div className="luxury-hero__overlay" />
      <div className="luxury-hero__glow luxury-hero__glow--left" />
      <div className="luxury-hero__glow luxury-hero__glow--right" />
    </div>

    <div className="luxury-hero__inner">
      <div data-motion="focus">
        <h1 className="luxury-hero__title">Come full-joy yourself!</h1>
      </div>
      <p className="luxury-hero__livity">In Jamaica: Off the beaten path</p>
      <div className="luxury-hero__desc luxury-hero__desc--stack">
        <p>Let us guide you through an adventure that you&apos;ll keep wanting to come back to.</p>
      </div>
      <div className="luxury-hero__actions">
        <button type="button" className="luxury-btn luxury-btn--gold" onClick={() => setNoticeOpen(true)}>
          Explore What We Offer
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
    {noticeOpen && (
      <div className="luxury-soon" role="presentation" onClick={() => setNoticeOpen(false)}>
        <div
          className="luxury-soon__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="luxury-soon__close" onClick={() => setNoticeOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
          <p id="coming-soon-title" className="luxury-soon__title">The portal to our new experiences is opening soon.</p>
          <p className="luxury-soon__text">
            Check back early 2027 to see what&apos;s coming. Can&apos;t wait? Slip through the portal early and email us:{" "}
            <a href="mailto:info@portalsofsamadhi.com">info@portalsofsamadhi.com</a>
          </p>
        </div>
      </div>
    )}
  </section>
  );
};

export default LuxuryHeroSection;
