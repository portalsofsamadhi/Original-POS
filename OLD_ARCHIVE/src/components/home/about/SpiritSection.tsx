import React from "react";
import "../../../styles/mbg-aesthetics.css";

interface SpiritSectionProps {
  paddingTop?: string;
  className?: string;
}

const SpiritSection: React.FC<SpiritSectionProps> = ({ paddingTop = "2rem", className = "" }) => {
  return (
    <section className={`mbg-section mbg-bg-light about-subsection ethereal-fade ${className}`} style={{ paddingTop, marginTop: '4.5rem' }}>
      <div className="mbg-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-stagger">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* 1. Section Title */}
            <div className="flex items-center justify-center gap-3">
              <div className="mbg-keyword-title text-center" style={{ fontSize: '1.75rem' }}>Spirit</div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                style={{ 
                  background: 'linear-gradient(145deg, #fca5a5, #f87171)',
                  boxShadow: '0 6px 24px rgba(252, 165, 165, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            {/* 2. Heading */}
            <h2 className="mbg-heading-lg text-center mb-6">Nurturing the <span className="mbg-text-accent">Spiritual Essence</span></h2>

            {/* 3. Keywords */}
            <div className="flex items-center gap-4 justify-center">
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Sacred</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Wisdom</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Connection</div>
            </div>

            {/* 4. Image */}
            <div className="text-center">
              <img 
                src="/images - Copy/Phone/1000128624.webp" 
                alt="Spirit - Spiritual Practices and Sacred Ceremonies" 
                className="rounded-lg shadow-lg mx-auto"
                style={{ width: '400px', height: '300px', objectFit: 'cover' }}
              />
            </div>

            {/* 5. Quote */}
            <blockquote className="text-center scroll-fade-in">
              <p className="text-lg italic text-gray-600 mb-2">
                "Spirituality is not theology or ideology. It is simply a way of life, pure and original."
              </p>
              <cite className="text-sm mbg-text-accent font-medium">Haile Selassie</cite>
            </blockquote>

            {/* 6. Heading (repeat) - removed for mobile */}

            {/* 7. Description */}
            <p className="mbg-text-lg text-center">
              Spiritual growth should feel accessible, not distant. We offer guidance and rituals rooted in nature and ancestral wisdom. Find alignment that holds, even when life moves fast.
            </p>

            {/* 8. Book Now Button */}
            <div className="text-center">
              <button
                className="mbg-btn mbg-btn-primary"
                style={{ 
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => {
                  const element = document.getElementById('services');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Programs</span>
                <svg 
                  width="16" 
                  height="8" 
                  viewBox="0 0 40 20" 
                  fill="none" 
                  className="transform transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path 
                    d="M2 10L38 10M38 10L28 2M38 10L28 18" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-8">
            <div className="scroll-slide-right">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="mbg-keyword-title text-left" style={{ fontSize: '1.75rem' }}>Spirit</div>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                    style={{ 
                      background: 'linear-gradient(145deg, #fca5a5, #f87171)',
                      boxShadow: '0 6px 24px rgba(252, 165, 165, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="mbg-heading-lg text-left mb-6">Nurturing the <span className="mbg-text-accent">Spiritual Essence</span></h2>
              <p className="mbg-text-lg">
                Spiritual growth should feel accessible, not distant. We offer guidance and rituals rooted in nature and ancestral wisdom. Find alignment that holds, even when life moves fast.
              </p>
              
              <div className="mt-6">
                <button
                  className="mbg-btn mbg-btn-primary"
                  style={{ 
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => {
                    const element = document.getElementById('services');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Programs</span>
                  <svg 
                    width="16" 
                    height="8" 
                    viewBox="0 0 40 20" 
                    fill="none" 
                    className="transform transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path 
                      d="M2 10L38 10M38 10L28 2M38 10L28 18" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>            <div className="hidden lg:block mbg-text-center">
              <div className="scroll-scale">
                <div className="flex items-center gap-4 mb-4 justify-center">
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Sacred</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Wisdom</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Connection</div>
                </div>
                <img 
                  src="/images - Copy/Phone/1000128624.webp" 
                  alt="Spirit - Spiritual Practices and Sacred Ceremonies" 
                  className="rounded-lg shadow-lg mx-auto"
                  style={{ width: '400px', height: '300px', objectFit: 'cover' }}
                />
                <div className="flex items-center gap-6 mt-6 scroll-stagger justify-center flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Sacred Ceremonies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Traditional Wisdom</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Nature Connection</span>
                  </div>
                </div>
                <blockquote className="mt-6 text-center scroll-fade-in">
                  <p className="text-lg italic text-gray-600 mb-2">
                    "Spirituality is not theology or ideology. It is simply a way of life, pure and original."
                  </p>
                  <cite className="text-sm mbg-text-accent font-medium">Haile Selassie</cite>
                </blockquote>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default SpiritSection;
