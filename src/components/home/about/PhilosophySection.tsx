import React from "react";
import "../../../styles/mbg-aesthetics.css";

interface PhilosophySectionProps {
  paddingTop?: string;
  className?: string;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({ paddingTop: _paddingTop = "2rem", className = "" }) => {
  return (
    <section
      className={`mbg-section mbg-bg-white philosophy-section ${className}`}
      style={{ paddingTop: "2rem", paddingBottom: "2rem", marginTop: 0 }}
    >
      <div className="mbg-container mbg-text-center">
        <div className="scroll-stagger">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mbg-mb-md scroll-scale"
            style={{
              background: "linear-gradient(145deg, #C3998F, #E8B4A3)",
              boxShadow:
                "0 8px 32px rgba(195, 153, 143, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>

          <div className="flex justify-center items-center gap-4 mb-3">
            <div className="mbg-keyword-title" style={{ fontSize: "1.25rem" }}>
              Philosophy
            </div>
          </div>
          <h2 className="mbg-heading-lg mbg-mb-md scroll-slide-right">
            Our <span style={{ color: "var(--mbg-primary-green)" }}>Purpose</span>
          </h2>

          <div className="max-w-4xl mx-auto scroll-blur-reveal px-1">
            <p className="mbg-text-lg">
              We exist to reconnect people with land, lineage, and their own quiet center.
              Portals of Samadhi opens intimate doors into Jamaica - family tours, sacred
              gatherings, and healing held with Maroon memory and island hospitality. Our
              sister studio, Samadhi Productions, carries that same intention into film. When
              beauty meets purpose, people feel more alive - on the land and in life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
