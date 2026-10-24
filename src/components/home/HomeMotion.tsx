import { useEffect } from "react";

/** Hero drift and recede follow scroll. Other gestures play once. Copy stays put if this never runs. */
const HomeMotion = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector(".luxury-site");
    if (!root) return;

    const hero = root.querySelector<HTMLElement>(".motion-hero");
    const media = hero?.querySelector<HTMLElement>(".luxury-hero__media");
    const focus = hero?.querySelector<HTMLElement>('[data-motion="focus"]');
    let frame = 0;
    let leftHero = false;

    const replay = (el: HTMLElement) => {
      el.classList.remove("is-in");
      void el.offsetWidth;
      el.classList.add("is-in");
    };

    if (focus) replay(focus);

    const onScroll = () => {
      if (!hero || !focus) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const height = rect.height || 1;
        const leave = Math.min(1, Math.max(0, -rect.top / (height * 0.8)));
        focus.style.setProperty("--hero-leave", leave.toFixed(3));
        if (media && rect.bottom > 0 && rect.top < window.innerHeight) {
          const drift = Math.max(-36, Math.min(36, -rect.top * 0.12));
          media.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
        } else if (media) {
          media.style.transform = "";
        }
        if (leave > 0.65) leftHero = true;
        if (leftHero && leave < 0.05) {
          leftHero = false;
          replay(focus);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      const once = root.querySelectorAll<HTMLElement>(
        '[data-motion="wipe"], [data-motion="nums"], [data-motion="turn"], [data-motion="draw"]',
      );
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.35 },
      );
      once.forEach((node) => observer?.observe(node));
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      media && (media.style.transform = "");
      focus?.style.removeProperty("--hero-leave");
    };
  }, []);

  return null;
};

export default HomeMotion;
