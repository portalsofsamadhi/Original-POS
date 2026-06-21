import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  createEnhancedScrollObserver,
  resetScrollAnimations,
} from "../utils/scrollUtils";

const SCROLL_SELECTORS = [
  ".scroll-fade-in",
  ".scroll-slide-left",
  ".scroll-slide-right",
  ".scroll-slide-up",
  ".scroll-scale",
  ".scroll-blur-reveal",
  ".scroll-stagger",
  ".reveal-on-scroll",
  ".about-subsection",
];

export function useScrollAnimations() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.style.scrollSnapType = "none";

    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      observer = createEnhancedScrollObserver(SCROLL_SELECTORS, {
        fadeOut: false,
        rootMargin: "-5% 0px -10% 0px",
        threshold: [0, 0.15, 0.35],
        staggerDelay: 80,
      });
    }, 50);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      resetScrollAnimations();
    };
  }, [pathname]);
}