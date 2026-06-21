import React from "react";
import "../../../styles/mbg-aesthetics.css";

interface BodySectionProps {
  paddingTop?: string;
  className?: string;
}

const BodySection: React.FC<BodySectionProps> = ({ paddingTop = "2rem", className = "" }) => {
  return (
    <section className={`mbg-section mbg-bg-white about-subsection ethereal-fade ${className}`} style={{ paddingTop, marginTop: '4.5rem' }}>
      <div className="mbg-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-stagger">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* 1. Section Title */}
            <div className="flex items-center justify-center gap-3">
              <div className="mbg-keyword-title text-center" style={{ fontSize: '1.75rem' }}>Body</div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                style={{ 
                  background: 'linear-gradient(145deg, #fef08a, #fde047)',
                  boxShadow: '0 6px 24px rgba(254, 240, 138, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            {/* 2. Heading */}
            <h2 className="mbg-heading-lg text-center mb-6">Honoring the <span className="mbg-text-accent">Physical Vessel</span></h2>

            {/* 3. Keywords */}
            <div className="flex items-center gap-4 justify-center">
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Healing</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Wellness</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Balance</div>
            </div>

            {/* 4. Image */}
            <div className="text-center">
              <img 
                src="/images - Copy/Phone/1000128622.webp" 
                alt="Body - Holistic Healing and Energy Work" 
                className="rounded-lg shadow-lg mx-auto"
                style={{ width: '400px', height: '300px', objectFit: 'cover' }}
              />
            </div>

            {/* 5. Quote */}
            <blockquote className="text-center scroll-fade-in">
              <p className="text-lg italic text-gray-600 mb-2">
                "The body is a sacred vessel where the soul resides."
              </p>
              <cite className="text-sm mbg-text-accent font-medium">Yogiraj SatGurunath Siddhanath</cite>
            </blockquote>

            {/* 6. Heading (repeat) - removed for mobile */}

            {/* 7. Description */}
            <p className="mbg-text-lg text-center">
              Vitality returns when the body is heard. We blend movement, holistic medicine, and practical self-care into routines you can sustain. Less stress. More energy. Renewal that honors your natural rhythm.
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
          <div className="hidden lg:block mbg-text-center order-2 lg:order-1">
              <div className="scroll-scale">
                <div className="flex items-center gap-4 mb-4 justify-center">
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Healing</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Wellness</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Balance</div>
                </div>
                <img 
                  src="/images - Copy/Phone/1000128622.webp" 
                  alt="Body - Holistic Healing and Energy Work" 
                  className="rounded-lg shadow-lg mx-auto"
                  style={{ width: '400px', height: '300px', objectFit: 'cover' }}
                />
                <div className="flex items-center gap-6 mt-6 scroll-stagger justify-center flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Energy Healing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Herbal Medicine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Movement Practices</span>
                  </div>
                </div>
                <blockquote className="mt-6 text-center scroll-fade-in">
                  <p className="text-lg italic text-gray-600 mb-2">
                    "The body is a sacred vessel where the soul resides."
                  </p>
                  <cite className="text-sm mbg-text-accent font-medium">Yogiraj SatGurunath Siddhanath</cite>
                </blockquote>
              </div>
            </div>

          <div className="hidden lg:block space-y-8 order-1 lg:order-2">
            <div className="scroll-slide-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="mbg-keyword-title text-left" style={{ fontSize: '1.75rem' }}>Body</div>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                    style={{ 
                      background: 'linear-gradient(145deg, #fef08a, #fde047)',
                      boxShadow: '0 6px 24px rgba(254, 240, 138, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="mbg-heading-lg text-left mb-6">Honoring the <span className="mbg-text-accent">Physical Vessel</span></h2>
              <p className="mbg-text-lg">
                We help you restore balance and energy through simple routines and personalized support for vibrant health. Our approach blends practical self-care, movement, and holistic medicine into routines you can sustain. Renewal that honors your body’s natural renewal every day.
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default BodySection;
