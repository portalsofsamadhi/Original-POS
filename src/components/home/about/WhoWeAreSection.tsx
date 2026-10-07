import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/mbg-aesthetics.css";

interface WhoWeAreSectionProps {
  paddingTop?: string;
  marginTop?: string;
  className?: string;
  pageMode?: boolean;
}

const WhoWeAreSection: React.FC<WhoWeAreSectionProps> = ({
  paddingTop = "2rem",
  marginTop = "3.5rem",
  className = "",
  pageMode = false,
}) => {
  const navigate = useNavigate();

  const storyText = `Portals of Samadhi is a living doorway into Jamaica - tours through farms and forests, event planning for retreats, workshops, series, and virtual gatherings, and healing held with the intimacy of home. Our work is rooted in Scotts Hall Maroon lineage, bush medicine, and a lifelong bond with the land - not a packaged itinerary.

We host small groups and gatherings that feel personal: countryside places our families still tend, boutique venues when an event needs them, sound and energy work, and meals that taste like belonging. Our sister studio, Samadhi Productions, carries the same intention into film.`;

  return (
    <section className={`mbg-section mbg-bg-white ${className}`} style={{ paddingTop, marginTop }}>
      <div className="mbg-container">
        {!pageMode && (
          <div className="text-center mb-12 scroll-stagger">
            <div className="mbg-keyword-title" style={{ fontSize: "1.5rem" }}>
              About Us
            </div>
            <h2 className="mbg-heading-xl mb-4">
              Who We <span style={{ color: "var(--mbg-primary-green)" }}>Are</span>
            </h2>
            <h3
              className="mbg-heading-md"
              style={{ color: "var(--mbg-primary-green)", fontStyle: "italic" }}
            >
              Explore. Heal. Thrive.
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-stagger">
          <div className="mbg-text-center">
            <div className="scroll-scale samadhi-about-logo-wrap">
              <img
                src="/poslogo.webp"
                alt="Portals of Samadhi original logo"
                className="samadhi-about-logo"
                width={1024}
                height={1024}
                decoding="async"
              />
            </div>
          </div>

          <div className="scroll-fade-in">
            <p
              className={`mbg-text-lg ${pageMode ? "samadhi-about-story" : ""}`}
              style={{ whiteSpace: "pre-line" }}
            >
              {storyText}
            </p>

            <div className="mbg-mt-lg">
              <button
                className="mbg-btn mbg-btn-primary"
                style={{
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={() => navigate("/experiences")}
              >
                <span>Explore Tours</span>
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
    </section>
  );
};

export default WhoWeAreSection;