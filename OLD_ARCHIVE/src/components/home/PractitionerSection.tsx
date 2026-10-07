import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ParticleButton as _ParticleButton } from "../ui/particle-button";
import { scrollToElement as _scrollToElement } from "../../utils/scrollUtils";
import "../../styles/mbg-aesthetics.css";

// Define types for the practitioners
interface Practitioner {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  image?: string;
  specialties?: string[];
}

interface PractitionerSectionProps {
  practitioners: Practitioner[] | Practitioner;
  onSelectPractitioner?: (id: string) => void;
  selectedPractitioner?: string;
  setCurrentStep?: (step: "services" | "home" | "booking") => void;
}

const PractitionerSection: React.FC<PractitionerSectionProps> = ({
  practitioners = [
    {
      id: "Feqad",
      name: "Feq'ad Wolde",
      image: "/feqad-wolde.webp",
      bio: "Certified master healer,retreat facilitator and spiritual guide specializing in chakra alignment using sacred tools, spiritual counseling, trauma relief, and sacred ceremonies. Offers deep soul work, tantric, and ancestral healing, with over 20+ years of experience in transformative botanical healing practices, yoga, and energy work.",
      specialties: [
        "Energy Healing",
        "Spiritual Counseling",
        "Chakra Alignment",
      ],
    },    {
      id: "Mesqal",
      name: "Mesq'al Kebra",
      image: "/mesqal-kebra.webp",
      bio: "MK is a program design specialist, digital product developer, and holistic health advocate who combines her expertise in creating transformative spaces and events with a strong background in business development. Her services span from marketing and branding to management and execution, all aimed at supporting personal and professional growth.",
      specialties: [
        "Business Consulting",
        "Project Management",
        "Strategic Planning",
      ],
    },
  ],
  onSelectPractitioner: _onSelectPractitioner = (id) => console.log(`Selected practitioner: ${id}`),
  setCurrentStep: _setCurrentStep
}) => {
  const _sectionRef = useRef<HTMLElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  
  // Toggle bio expansion
  const toggleBio = (practitionerId: string) => {
    setExpandedBios(prev => ({
      ...prev,
      [practitionerId]: !prev[practitionerId]
    }));
  };
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate opacity based on scroll position with improved seamless behavior
  // Start fading only after scrolling past 80% of viewport height
  const startFadePosition = window.innerHeight * 0.8;
  // Slow down the fade rate significantly for more seamless transition
  const fadeRate = window.innerHeight * 3.0;
  
  // Keep opacity at 1 until reaching startFadePosition, then fade slowly
  // Maintain minimum opacity of 0.2 to keep section partially visible
  const _opacity = scrollPosition <= startFadePosition 
    ? 1 
    : Math.max(0.2, 1 - (scrollPosition - startFadePosition) / fadeRate);

  // Ensure practitioners is always an array
  const practitionersArray = Array.isArray(practitioners) 
    ? practitioners 
    : practitioners ? [practitioners] : [];
  // Apply enhanced scroll behavior and earthy color scheme
  // Create a parallax effect by moving the section slightly as user scrolls
  const _parallaxOffset = scrollPosition * 0.15; // Subtle parallax effect
  
  return (
    <section className="mbg-section mbg-bg-white" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      paddingTop: '2rem',
      paddingBottom: '7rem'
    }}>
      <div className="mbg-container" style={{ width: '100%' }}>
        {/* Header section with green keyword title */}
        <div className="mbg-grid-2 mbg-items-center" style={{ marginBottom: '1rem', gap: '2rem' }}>
          {/* Left: Large Typography */}
          <div className="scroll-slide-left">
            <div className="mbg-keyword-title" style={{ fontSize: '1.45rem', marginBottom: '1.5rem' }}>Holistic & Admin Guides</div>
            <h2 className="mbg-heading-xl" style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0' }}>
              Meet Our<br />
              <span style={{ color: 'var(--mbg-primary-green)' }}>Team</span>
            </h2>
          </div>

          {/* Right: Description */}
          <div className="scroll-slide-right">
            <p className="mbg-text-lg" style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              <span className="mbg-text-accent" style={{ fontWeight: 600 }}>Streamlined efficiency meets personalized well-being.</span> We handle scheduling, email, and organization with precision while supporting your physical and mental health through tailored wellness plans.
            </p>
            <p className="mbg-text-lg" style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '0' }}>
              Our approach saves time, reduces stress, and boosts productivity so busy professionals and entrepreneurs thrive with less overwhelm and more balance.
            </p>
          </div>
        </div>

        {/* Practitioners Grid */}
        <div className="mbg-grid-2 scroll-stagger" style={{ gap: '2rem', maxHeight: '60vh' }}>
          {practitionersArray.map((practitioner, _index) => (
            <div 
              key={practitioner.id} 
              className={`mbg-card scroll-scale`}
              style={{ padding: '1rem', height: 'fit-content' }}
            >              <div style={{ marginBottom: '.5rem' }}>                <img
                  src={practitioner.image}
                  alt={
                    practitioner.id === "Feqad"
                      ? "Dr. Feq'ad Wolde — Jamaican traditional healer and spiritual guide"
                      : "Mesq'al Kebra — strategic facilitator and virtual assistant specialist"
                  }
                  className="mbg-image-hero"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'contain', 
                    objectPosition: 'center',
                    borderRadius: '0.5rem',
                    marginTop: '0rem',
                    marginBottom: '0.75rem',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div>                <div className="mbg-keyword-title" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {practitioner.id === "Feqad" ? "Spiritual Guide" : "Strategic Facilitator"}
                </div>
                  <div className="mbg-flex mbg-items-center mbg-gap-md" style={{ alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 className="mbg-heading-md" style={{ fontSize: '1.5rem', marginBottom: '0' }}>
                    {practitioner.name}
                  </h3>
                  <Link 
                    to={practitioner.id === "Feqad" ? "/feqad-services" : "/mesqal-services"}
                    className="mbg-btn mbg-btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    Book Now
                    <svg 
                      width="16" 
                      height="8" 
                      viewBox="0 0 40 20" 
                      fill="none" 
                      className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path 
                        d="M2 10L38 10M38 10L28 2M38 10L28 18" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
                
                {practitioner.specialties && (
                  <div className="mbg-flex mbg-gap-sm" style={{ flexWrap: 'wrap', marginBottom: '.5rem', gap: '0.75rem' }}>
                    {practitioner.specialties.map((specialty, i) => (
                      <div className="mbg-flex mbg-items-center mbg-gap-xs" key={i}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--mbg-primary-green)' }}></div>
                        <span className="mbg-text-base" style={{ 
                          fontSize: '0.75rem', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em',
                          color: 'var(--mbg-dark-gray)',
                          fontWeight: 500
                        }}>
                          {specialty}
                        </span>
                      </div>
                    ))}
                  </div>
                )}                
                <div className="mbg-text-base" style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5', 
                  marginBottom: '1.25rem'
                }}>
                  {!expandedBios[practitioner.id] && practitioner.bio && practitioner.bio.length > 150 ? (
                    <p style={{ margin: 0 }}>
                      {practitioner.bio.substring(0, 150)}...{' '}
                      <button
                        onClick={() => toggleBio(practitioner.id)}
                        className="mbg-text-accent hover:underline focus:outline-none focus:underline"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: 'var(--mbg-primary-green)'
                        }}
                      >
                        Read more
                      </button>
                    </p>
                  ) : (
                    <p style={{ margin: 0 }}>
                      {practitioner.bio || "Professional practitioner specializing in holistic healing and wellness services."}
                      {expandedBios[practitioner.id] && practitioner.bio && practitioner.bio.length > 150 && (
                        <>
                          {' '}
                          <button
                            onClick={() => toggleBio(practitioner.id)}
                            className="mbg-text-accent hover:underline focus:outline-none focus:underline"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              color: 'var(--mbg-primary-green)'
                            }}
                          >
                            Read less
                          </button>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PractitionerSection;
