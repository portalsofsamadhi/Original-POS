import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../styles/luxury-theme.css';

const SamadhiProductionsOverlay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setHasClosed(true);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  if (hasClosed) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed bottom-4 right-4 z-[9999]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Expanded overlay panel */}
      <div
        className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ease-out ${
          isExpanded
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
        style={{
          width: '280px',
          borderRadius: '20px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--luxury-gold-muted)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--luxury-charcoal)] transition-colors cursor-pointer"
          aria-label="Close Samadhi Productions overlay"
        >
          <X className="h-4 w-4 text-[var(--luxury-cream-muted)]" />
        </button>

        <div className="p-5 text-center">
          <img
            src="/samadhi-productions-logo.webp"
            alt="Samadhi Productions"
            className="h-12 w-12 object-contain mx-auto mb-3"
          />
          <p
            className="text-[var(--luxury-cream)] text-sm font-medium leading-relaxed"
          >
            Check out our thoughtful media:
          </p>
          <a
            href="https://www.samadhiproductions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[var(--luxury-gold)] text-sm font-semibold hover:text-[var(--luxury-gold-light)] transition-colors"
          >
            Samadhi Productions
          </a>
        </div>
      </div>

      {/* Floating logo button */}
      <button
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
          isExpanded ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--luxury-gold-muted)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
        aria-label="Samadhi Productions"
      >
        <img
          src="/samadhi-productions-logo.webp"
          alt="Samadhi Productions"
          className="h-7 w-7 object-contain"
        />
      </button>
    </div>
  );
};

export default SamadhiProductionsOverlay;
