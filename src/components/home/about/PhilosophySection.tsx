import React from "react";
import "../../../styles/mbg-aesthetics.css";

interface PhilosophySectionProps {
  paddingTop?: string;
  className?: string;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({ paddingTop: _paddingTop = "2rem", className = "" }) => {
  return (
    <section className={`mbg-section mbg-bg-white ${className} philosophy-section-mobile-spacing`} style={{ paddingTop: '3rem', marginTop: '3rem' }}>
      <div className="mbg-container mbg-text-center">
        <div className="scroll-stagger">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mbg-mb-md scroll-scale"
            style={{ 
              background: 'linear-gradient(145deg, #C3998F, #E8B4A3)',
              boxShadow: '0 8px 32px rgba(195, 153, 143, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </div>

          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="mbg-keyword-title" style={{ fontSize: '1.5rem' }}>Philosophy</div>
          </div>
          <h2 className="mbg-heading-lg mbg-mb-md scroll-slide-right">Our <span style={{ color: 'var(--mbg-primary-green)' }}>Purpose</span></h2>

          <div className="max-w-4xl mx-auto scroll-blur-reveal">
            <p className="mbg-text-lg">
              We exist to lift the spirit. Through Samadhi Productions, we craft cinematic
              content that awakens wonder, reflection, and joy. Portals of Samadhi is the
              sanctuary: a place for healing, retreat, and creative collaboration rooted in
              the same intention. When beauty meets purpose, people feel more alive, on
              screen and in life.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .philosophy-section-mobile-spacing {
            margin-bottom: 9rem !important;
            margin-top: 9rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PhilosophySection;
