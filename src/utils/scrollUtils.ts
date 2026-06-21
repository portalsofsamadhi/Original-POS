/**
 * Smoothly scrolls to the specified element ID with customizable options
 * 
 * @param elementId The ID of the element to scroll to
 * @param options Additional options for scrolling behavior
 */
export const scrollToElement = (
  elementId: string,
  options: {
    offset?: number; // Optional offset from the top of the element (in pixels)
    behavior?: ScrollBehavior; // 'auto', 'smooth', etc.
    callback?: () => void; // Optional callback after scrolling
  } = {}
): void => {
  const {
    offset = 0,
    behavior = 'smooth',
    callback
  } = options;
  
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior
    });
    
    // Execute callback after scroll animation (approximately)
    if (callback) {
      // Estimate animation duration based on distance
      const distance = Math.abs(window.pageYOffset - offsetPosition);
      const approximateDuration = behavior === 'smooth' ? Math.min(1000, distance / 2) : 0;
      
      setTimeout(callback, approximateDuration);
    }
  }
};

/**
 * Creates a scroll observer that triggers callbacks when elements with 
 * specific selectors enter or exit the viewport
 */
export const createScrollObserver = (
  selectors: string[],
  onEnterViewport: (element: Element) => void,
  onExitViewport?: (element: Element) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  // Default options
  const defaultOptions: IntersectionObserverInit = {
    root: null, // use viewport
    rootMargin: '0px',
    threshold: 0.1, // 10% of the element must be visible
    ...options
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onEnterViewport(entry.target);
      } else if (onExitViewport) {
        onExitViewport(entry.target);
      }
    });
  }, defaultOptions);
  
  // Observe all elements matching the selectors
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      observer.observe(element);
    });
  });
  
  return observer;
};

/**
 * Creates an enhanced scroll observer with advanced animation options
 * Uses CSS classes instead of direct style manipulation for better performance
 */
export const createEnhancedScrollObserver = (
  selectors: string[],
  options: {
    fadeOut?: boolean;
    rootMargin?: string;
    threshold?: number | number[];
    staggerDelay?: number;
    parallax?: boolean;
  } = {}
): IntersectionObserver => {
  const {
    fadeOut = false,
    rootMargin = "-5% 0px -10% 0px",
    threshold = [0, 0.15, 0.35],
    staggerDelay = 80,
  } = options;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin,
    threshold,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;

      if (!document.body.classList.contains("animations-ready")) {
        return;
      }

      if (entry.isIntersecting) {
        element.classList.add("active");
        element.classList.remove("fade-out");

        if (element.classList.contains("scroll-stagger")) {
          const children = Array.from(element.children) as HTMLElement[];
          children.forEach((child, childIndex) => {
            window.setTimeout(() => {
              child.classList.add("active");
              child.classList.remove("fade-out");
            }, childIndex * staggerDelay);
          });
        }
      } else if (fadeOut && entry.boundingClientRect.top > 0) {
        element.classList.remove("active");
        element.classList.add("fade-out");

        if (element.classList.contains("scroll-stagger")) {
          const children = Array.from(element.children) as HTMLElement[];
          children.forEach((child) => {
            child.classList.remove("active");
            child.classList.add("fade-out");
          });
        }
      }
    });
  }, observerOptions);

  // Initialize elements and observe them
  selectors.forEach(selector => {
    // Use a more specific query to avoid conflicts
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Ensure element has proper initial state without overriding CSS
      if (!htmlElement.classList.contains('active')) {
        htmlElement.classList.add('scroll-initialized');
      }
      
      observer.observe(htmlElement);
    });
  });  // Mark animations as ready after a minimal delay
  setTimeout(() => {
    document.body.classList.add('animations-ready');
  }, 25);

  return observer;
};

/**
 * Adds IDs to section elements for easy navigation
 * @param sectionNames Map of section names to their element IDs
 */
export const addSectionIds = (
  sectionNames: Record<string, string>
): void => {
  Object.entries(sectionNames).forEach(([name, id]) => {
    const elements = document.querySelectorAll(`section[data-section="${name}"]`);
    if (elements.length > 0) {
      elements[0].id = id;
    }
  });
};

/**
 * Utility function to safely reset scroll animations
 * Useful for when components unmount or when navigation occurs
 */
export const resetScrollAnimations = (): void => {
  const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-slide-up, .scroll-scale, .scroll-blur-reveal, .reveal-on-scroll');
  
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.remove('active', 'fade-out');
    htmlElement.classList.add('scroll-initialized');
  });
  
  // Reset body class
  document.body.classList.remove('animations-ready');
};

/**
 * Utility function to force enable all animations (useful for debugging)
 */
export const enableAllAnimations = (): void => {
  const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-slide-up, .scroll-scale, .scroll-blur-reveal, .reveal-on-scroll');
  
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('active');
    htmlElement.classList.remove('fade-out');
  });
};
