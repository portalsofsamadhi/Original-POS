import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactSection from '../home/ContactSection';
import ScrollToTop from './ScrollToTop';
import AccessibilityReader from './AccessibilityReader';
import ProfilePopup from './ProfilePopup';
import { ProfilePopupProvider, useProfilePopup } from '../../contexts/ProfilePopupContext';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import { useIsMobile } from '../../hooks/useIsMobile';

interface LayoutProps {
  children: ReactNode;
}


const CONTACT_HIDDEN_PATHS = [
  '/book-now',
  '/booking',
  '/booking-payment',
  '/booking-success',
  '/booking-cancel',
  '/booking-services',
  '/profile',
  '/about/journey',
  '/preview',
];

const LayoutInner = ({ children }: LayoutProps) => {
  const { isOpen, close } = useProfilePopup();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const showContact = !CONTACT_HIDDEN_PATHS.some((p) => pathname.startsWith(p));
  useScrollAnimations();
  return (
    <div className="flex flex-col min-h-screen bg-samadhi-black text-samadhi-cream overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full min-w-0">{children}</main>
      {showContact && <ContactSection />}
      <Footer />
      <ScrollToTop />
      <AccessibilityReader />
      {!isMobile && <ProfilePopup isOpen={isOpen} onClose={close} />}
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => (
  <ProfilePopupProvider>
    <LayoutInner>{children}</LayoutInner>
  </ProfilePopupProvider>
);

export default Layout;
