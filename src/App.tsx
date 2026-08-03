import { Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import SEO from './components/SEO';
import ScrollToTop from './components/ScrollToTop';
import Home from "./components/home";
import ProfilePage from "./pages/profile";
import Layout from "./components/layout/Layout";
import { PAYMENT_CONFIG } from "./config/payment";
import './utils/imagePreloader';
import { Toaster } from "./components/ui/toaster";

import PlanRetreatPage from "./pages/plan-retreat";
import CoursesPage from "./pages/courses";
import BookingSuccessPage from "./pages/booking-success";
import BookingCancelPage from "./pages/booking-cancel";
import BookingPaymentPage from "./pages/booking-payment";
import BookNowPage from "./pages/book-now";
import AboutPage from "./pages/about";
import ExperiencesPage from "./pages/experiences";
import AirportRunsPage from "./pages/airport-runs";
import CustomRetreatPage from "./pages/custom-retreat";
import JourneyStoryPage from "./pages/JourneyStoryPage";
import JourneyPhotoPage from "./pages/JourneyPhotoPage";
import NotFoundPage from "./pages/404";

const LegacyRedirect = ({ to, from }: { to: string; from: string }) => (
  <>
    <SEO title="Redirect" description="" url={from} noindex nofollow />
    <Navigate to={to} replace />
  </>
);

const ExternalRedirect = ({ url, from }: { url: string; from: string }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return (
    <>
      <SEO title="Redirect" description="" url={from} noindex nofollow />
      <p className="text-center py-20 text-samadhi-cream/60">Redirecting...</p>
    </>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  return (
    <HelmetProvider>
      <PayPalScriptProvider
        options={{
          clientId: PAYMENT_CONFIG.paypal.clientId,
          currency: PAYMENT_CONFIG.paypal.currency,
          intent: PAYMENT_CONFIG.paypal.intent,
        }}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/journey/photo" element={<JourneyPhotoPage />} />
              <Route path="/about/journey/:storyId" element={<JourneyStoryPage />} />
              <Route path="/production" element={<ExternalRedirect url="https://www.samadhiproductions.com/production" from="/production" />} />
              <Route path="/preview/:shortId" element={<ExternalRedirect url="https://www.samadhiproductions.com" from="/preview" />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/airport-runs" element={<AirportRunsPage />} />
              <Route path="/custom-retreat" element={<CustomRetreatPage />} />
              <Route path="/airport-pickup" element={<LegacyRedirect to="/airport-runs" from="/airport-pickup" />} />
              <Route path="/feqad-services" element={<LegacyRedirect to="/experiences" from="/feqad-services" />} />
              <Route path="/lifestyle-shift" element={<LegacyRedirect to="/experiences" from="/lifestyle-shift" />} />
              <Route path="/mesqal-services" element={<LegacyRedirect to="/experiences" from="/mesqal-services" />} />
              <Route path="/plan-retreat" element={<PlanRetreatPage />} />
              <Route path="/retreat-tours-workshops" element={<LegacyRedirect to="/experiences" from="/retreat-tours-workshops" />} />
              <Route path="/retreat-tours" element={<LegacyRedirect to="/experiences" from="/retreat-tours" />} />
              <Route path="/workshops" element={<LegacyRedirect to="/experiences" from="/workshops" />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/booking-services" element={<LegacyRedirect to="/book-now" from="/booking-services" />} />
              <Route path="/book-now" element={<BookNowPage />} />
              <Route path="/booking" element={<BookingPaymentPage />} />
              <Route path="/booking-payment" element={<BookingPaymentPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route path="/booking-cancel" element={<BookingCancelPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
          <Toaster />
        </Suspense>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}
export default App;