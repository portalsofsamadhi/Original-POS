import React from "react";
import "../../../styles/mbg-aesthetics.css";

interface MindSectionProps {
  _paddingTop?: string;
  className?: string;
}

const MindSection: React.FC<MindSectionProps> = ({ _paddingTop = "2rem", className = "" }) => {
  return (
    <section className={`mbg-section mbg-bg-light about-subsection ethereal-fade ${className}`} style={{ paddingTop: '2.8rem', marginTop: '2rem' }}>
      <div className="mbg-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-stagger">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* 1. Section Title */}
            <div className="flex items-center justify-center gap-3">
              <div className="mbg-keyword-title text-center" style={{ fontSize: '1.75rem' }}>Mind</div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                style={{ 
                  background: 'linear-gradient(145deg, #C3998F, #E8B4A3)',
                  boxShadow: '0 6px 24px rgba(195, 153, 143, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>

            {/* 2. Heading */}
            <h2 className="mbg-heading-lg text-center mb-6">Cultivating <span className="mbg-text-accent">Mental Clarity</span></h2>

            {/* 3. Keywords */}
            <div className="flex items-center gap-4 justify-center">
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Clarity</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Awareness</div>
              <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
              <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Intelligence</div>
            </div>

            {/* 4. Image */}
            <div className="text-center">
              <img 
                src="/images - Copy/Phone/1000128600.webp" 
                alt="Mind - Mental Clarity and Meditation" 
                className="rounded-lg shadow-lg mx-auto"
                style={{ width: '400px', height: '300px', objectFit: 'cover' }}
              />
            </div>

            {/* 5. Quote */}
            <blockquote className="text-center">
              <p className="text-lg italic text-gray-600 mb-2">
                "The mind is everything. What you think you become."
              </p>
              <cite className="text-sm mbg-text-accent font-medium">Buddha</cite>
            </blockquote>

            {/* 6. Heading (repeat) - removed for mobile */}

            {/* 7. Description */}
            <div className="text-center space-y-4">
              <p className="mbg-text-lg">
                A calmer mind changes everything. We guide you toward focus, presence, and mental ease with practices that fit real life.
              </p>
              <p className="mbg-text-lg">
                Clarity builds confidence. Challenges feel lighter. Joy becomes easier to reach.
              </p>
            </div>

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
            <div className="scroll-slide-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="mbg-keyword-title text-left" style={{ fontSize: '1.75rem' }}>Mind</div>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center scroll-scale"
                    style={{ 
                      background: 'linear-gradient(145deg, #C3998F, #E8B4A3)',
                      boxShadow: '0 6px 24px rgba(195, 153, 143, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="mbg-heading-lg text-left mb-6">Cultivating <span className="mbg-text-accent">Mental Clarity</span></h2>
              <p className="mbg-text-lg">
                A calmer mind changes everything. We guide you toward focus, presence, and mental ease with practices that fit real life.
              </p>
              <p className="mbg-text-lg">
                Clarity builds confidence. Challenges feel lighter. Joy becomes easier to reach.
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
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Clarity</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Awareness</div>
                  <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                  <div className="mbg-keyword-title" style={{ fontSize: '1rem' }}>Intelligence</div>
                </div>
                <img 
                  src="/images - Copy/Phone/1000128600.webp" 
                  alt="Mind - Mental Clarity and Meditation" 
                  className="rounded-lg shadow-lg mx-auto"
                  style={{ width: '400px', height: '300px', objectFit: 'cover' }}
                />
                <div className="flex items-center gap-6 mt-6 scroll-stagger justify-center flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Mindfulness & Meditation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Mental Health Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full samadhi-about-dot"></div>
                    <span className="mbg-text-base">Cognitive Wellness</span>
                  </div>
                </div>
              </div>
              <blockquote className="mt-6 text-center">
                <p className="text-lg italic text-gray-600 mb-2">
                  "The mind is everything. What you think you become."
                </p>
                <cite className="text-sm mbg-text-accent font-medium">Buddha</cite>
              </blockquote>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MindSection;
