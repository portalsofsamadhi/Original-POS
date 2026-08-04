
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Youtube, Linkedin } from "lucide-react";
import { Button } from "../ui/button";
import PrivacyPolicy from "../PrivacyPolicy";
import "../../styles/luxury-theme.css";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--luxury-gold-muted)] text-[var(--luxury-cream)] py-12 px-4 md:px-8 lg:px-12" style={{ background: 'var(--luxury-black)' }}>
      <div className="max-w-7xl mx-auto mb-10">
        <div className="luxury-footer-cta">
          <h2 className="luxury-footer-cta__title">Ready when you are</h2>
          <p className="luxury-footer-cta__text">
            Free discovery sessions. Small groups. Real hosts on Jamaican land.
          </p>
          <div className="luxury-hero__actions" style={{ justifyContent: "center", marginBottom: 0 }}>
            <Link to="/book-now" className="luxury-btn luxury-btn--gold">
              Book a free session
            </Link>
            <Link to="/experiences" className="luxury-btn luxury-btn--outline">
              Browse tours
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/poslogo.webp"
              alt="Portals of Samadhi logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h3 className="luxury-nav-brand text-[var(--luxury-gold-light)]">
                Portals of Samadhi
              </h3>
              <p className="luxury-nav-tagline mt-0.5">
                Explore · Heal · Thrive
              </p>
            </div>
          </div>
          <p className="text-[var(--luxury-cream-muted)] text-sm leading-relaxed max-w-sm">
            Come walk Jamaica’s out-of-the-way farms and forests, plan a retreat or workshop
            with us, or book healing, including The Realignment Program. You won’t feel like a
            tourist. You’ll feel like a guest.
          </p>
          <div className="flex space-x-3 mt-1">
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-[var(--luxury-charcoal)] text-[var(--luxury-gold-light)]">
              <a href="https://youtube.com/@dometicket" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-[var(--luxury-charcoal)] text-[var(--luxury-gold-light)]">
              <a href="https://www.linkedin.com/company/portals-of-samadhi/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-[var(--luxury-charcoal)] text-[var(--luxury-gold-light)]">
              <a href="mailto:info@portalsofsamadhi.com">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--luxury-gold)]">
            Tours
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/airport-runs" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">Airport Runs</Link></li>
            <li><Link to="/experiences" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">Tours</Link></li>
            <li><Link to="/plan-retreat" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">Plan an Event</Link></li>
            <li><Link to="/courses" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">Courses</Link></li>
            <li><Link to="/book-now" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">Book a Session</Link></li>
            <li><Link to="/about" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--luxury-gold)]">
            Contact
          </h3>
          <div className="flex items-start space-x-3 text-sm">
            <MapPin className="h-4 w-4 text-[var(--luxury-gold)] mt-0.5 shrink-0" />
            <span className="text-[var(--luxury-cream-muted)]">Kingston, Jamaica</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="h-4 w-4 text-[var(--luxury-gold)] shrink-0" />
            <a href="tel:+15102919399" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">
              (510) 291-9399
            </a>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="h-4 w-4 text-[var(--luxury-gold)] shrink-0" />
            <a href="mailto:info@portalsofsamadhi.com" className="text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors">
              info@portalsofsamadhi.com
            </a>
          </div>
          <a href="/#contact" className="text-sm text-[var(--luxury-gold)] hover:text-[var(--luxury-gold-light)] transition-colors">
            Send a message on the home page →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[var(--luxury-gold-muted)] space-y-3">
        <p className="text-center text-[var(--luxury-gold)] text-sm font-medium">
          We Do Not Sell Your Information
        </p>
        <div className="text-center text-sm">
          <PrivacyPolicy />
        </div>
        <p className="text-center text-[var(--luxury-cream-muted)] text-sm">
          © {new Date().getFullYear()} Portals of Samadhi. All rights reserved.
        </p>
        <p className="text-center text-[0.7rem] leading-relaxed text-[var(--luxury-cream-muted)] pt-1 opacity-60">
          Looking for cinematic production?{" "}
          <a
            href="https://www.samadhiproductions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--luxury-gold)] hover:text-[var(--luxury-gold-light)] transition-colors underline-offset-2 hover:underline"
          >
            Visit Samadhi Productions
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;