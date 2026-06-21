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

  const storyText = `Portals of Samadhi is a sanctuary for healing arts, meditative experiences, cultural immersion, and transformative journeys in Jamaica and beyond. We hold space for energy work, sound healing, retreat tours, and virtual assistance rooted in indigenous wisdom and spiritual intention.

Our sister studio, Samadhi Productions, extends this vision into cinematic storytelling — pairing creative imagination with refined audio-visual craft to bring bold concepts to life.`;

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
              Thoughtful Media. Immersive Worlds.
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-stagger">
          <div className="mbg-text-center">
            <div className="scroll-scale samadhi-about-logo-wrap">
              <img
                src="/samadhi-transparent-logo.png"
                alt="Samadhi Productions phoenix emblem"
                className="samadhi-about-logo"
                width={4096}
                height={2848}
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
                <span>Explore Experiences</span>
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