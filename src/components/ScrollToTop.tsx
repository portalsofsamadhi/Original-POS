import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that when navigating to a new page,
 * the user is scrolled to the top of the page
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll to top if we're not already there
    if (window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
