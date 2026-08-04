import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/useAuth';
import { useProfilePopup } from '../../contexts/ProfilePopupContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import '../../styles/luxury-theme.css';

type NavLink = {
  name: string;
  href: string;
  hash?: string;
  isIcon?: boolean;
  isCta?: boolean;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { open: openProfilePopup } = useProfilePopup();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash.replace('#', ''));
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (link: NavLink, e?: React.MouseEvent) => {
    if (link.isCta || link.isIcon) return;

    if (link.hash) {
      e?.preventDefault();
      const targetPath = link.href || '/';
      if (location.pathname === targetPath) {
        scrollToHash(link.hash);
      } else {
        navigate(`${targetPath}#${link.hash}`);
      }
      return;
    }

    if (location.pathname === link.href) {
      e?.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const primaryLinks: NavLink[] = [
    { name: 'Airport Runs', href: '/airport-runs' },
    { name: 'Tours', href: '/experiences' },
    { name: 'Gatherings', href: '/plan-retreat' },
    { name: 'Healing', href: '/book-now' },
    { name: 'About', href: '/about' },
  ];

  const closeMobile = () => setIsOpen(false);

  const renderProfileButton = (mobile = false) => (
    <button
      className={cn(
        'relative group flex items-center justify-center rounded-full bg-luxury-charcoal border border-[var(--luxury-gold-muted)] hover:border-[var(--luxury-gold)] transition-colors duration-200 focus:outline-none',
        mobile ? 'w-full pl-3 pr-4 py-3 mb-2' : 'w-10 h-10 ml-2'
      )}
      style={{ background: 'var(--luxury-charcoal)' }}
      onClick={() => {
        if (user || isMobile) {
          navigate('/profile');
        } else {
          openProfilePopup();
        }
        closeMobile();
      }}
      aria-label="Profile"
      type="button"
    >
      <User className={cn('text-[var(--luxury-gold-light)] group-hover:text-[var(--luxury-gold)] transition-colors', mobile ? 'h-5 w-5 mr-3' : 'h-5 w-5')} />
      {mobile && <span className="font-medium text-[var(--luxury-cream-muted)]">Profile</span>}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--luxury-gold-muted)]" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" aria-label="Portals of Samadhi Home" className="flex items-center gap-2.5 group">
              <img
                src="/poslogo.webp"
                alt="Portals of Samadhi logo"
                className="h-9 w-9 object-contain"
              />
              <span className="flex flex-col leading-tight min-w-0">
                <span className="luxury-nav-brand group-hover:text-[var(--luxury-gold-light)] transition-colors truncate">
                  Portals of Samadhi
                </span>
                <span className="hidden sm:block luxury-nav-tagline">
                  Explore · Heal · Thrive
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.hash ? `${link.href}#${link.hash}` : link.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] border-b-2 border-transparent hover:border-[var(--luxury-gold)] transition-colors"
                  onClick={(e) => handleNavigation(link, e)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href="https://www.samadhiproductions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-[var(--luxury-gold)] hover:text-[var(--luxury-gold-light)] transition-colors tracking-wide"
            >
              Samadhi Productions
            </a>
            <Link
              to="/book-now"
              className="luxury-btn luxury-btn--gold"
              style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}
            >
              Book free session
            </Link>
            {renderProfileButton()}
            {user && (
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] transition-colors"
                onClick={() => { signOut(); navigate('/'); }}
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {renderProfileButton()}
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <div className={cn('lg:hidden border-t border-[var(--luxury-gold-muted)]', isOpen ? 'block' : 'hidden')} style={{ background: 'var(--luxury-charcoal)' }}>
        <div className="pt-2 pb-4 px-4 max-h-[80vh] overflow-y-auto space-y-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.name}
              to={link.hash ? `${link.href}#${link.hash}` : link.href}
              className="block px-3 py-3 text-base font-medium text-[var(--luxury-cream-muted)] hover:text-[var(--luxury-cream)] rounded-md"
              onClick={(e) => { handleNavigation(link, e); closeMobile(); }}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.samadhiproductions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-3 text-base font-medium text-[var(--luxury-gold)]"
            onClick={closeMobile}
          >
            Samadhi Productions →
          </a>
          <Link
            to="/book-now"
            className="block mt-3 px-4 py-3 text-center luxury-btn luxury-btn--gold"
            onClick={closeMobile}
          >
            Book free session
          </Link>
          <Link
            to="/experiences"
            className="block mt-2 px-4 py-3 text-center luxury-btn luxury-btn--outline"
            onClick={closeMobile}
          >
            Explore tours
          </Link>
          {user && (
            <button
              className="block w-full text-left px-3 py-3 mt-2 text-sm text-[var(--luxury-cream-muted)]"
              onClick={() => { closeMobile(); signOut(); navigate('/'); }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;