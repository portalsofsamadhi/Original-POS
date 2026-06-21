import React, { useEffect, useState, useCallback } from 'react';
import OptimizedImage from '../components/ui/OptimizedImage';
import BookingDialogNew from '../components/booking/BookingDialogNew';
import { Dialog, DialogContent } from '../components/ui/dialog';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';

import '../components/home/transitions.css';
import '../styles/mbg-aesthetics.css';
// Mobile-only style to move Welcome Hero section up by 2rem
const mobileHeroUpCSS = `
  @media (max-width: 1023px) {
    .welcome-hero-mobile-up {
  margin-top: -6rem !important;
      padding-top: 4rem !important; /* Match NavBar height */
    }
  }
`;
// Mobile optimization styles for Mesqal Services page
const mobileMesqalServicesCSS = `
  @media (max-width: 1023px) {
    .mbg-section, .mbg-bg-white, .mbg-container {
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
      padding-top: 2rem !important;
    }
  /* Removed font-size !important overrides for .mbg-heading-xl, .mbg-heading-lg, .mbg-text-lg to allow CSS variable font sizes to work */
    .grid {
      gap: 1.25rem !important;
    }
    .mb-16 {
      margin-bottom: 2rem !important;
    }
    .rounded-lg, .rounded-2xl {
      border-radius: 0.75rem !important;
    }
    .p-4 {
      padding: 1rem !important;
    }
    .px-6 {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
    .py-3 {
      padding-top: 0.75rem !important;
      padding-bottom: 0.75rem !important;
    }
    .aspect-[1/1] {
      aspect-ratio: 1/1 !important;
    }
    
    /* Mobile-specific hero description margin adjustment */
    .mbg-text-lg.text-gray-700.dark\\:text-gray-400[style*="marginTop"] {
      margin-top: 2rem !important; /* Original 1rem + 1rem down = 2rem */
    }
  }
`;

// Adjustable spacing variables for vertical space between elements
// MarginTops for vertical spacing (all in rem units for easy control)
// --- Desktop MarginTops for Welcome Hero and Section Elements ---
const HERO_TITLE_MARGIN_TOP = '0rem'; // Hero main title
const HERO_SUBTITLE_MARGIN_TOP = '0rem'; // Hero subtitle (h2)
const HERO_DESC_MARGIN_TOP = '1.0rem'; // Hero description (p)
const HERO_BUTTON_MARGIN_TOP = '1.5rem'; // Hero button
const HERO_KEYWORDS_MARGIN_TOP = '.5rem'; // Hero keywords/badges
const SECTION_TITLE_MARGIN_TOP = '2.5rem'; // Section main title
const SECTION_DESC_MARGIN_TOP = '1.5rem'; // Section description (p)
const CARD_TITLE_MARGIN_TOP = '2.5rem'; // Card/package title
const CARD_DESC_MARGIN_TOP = '1.2rem'; // Card/package description

// --- Mobile MarginTops for Welcome Hero and Section Elements ---
const MOBILE_HERO_TITLE_MARGIN_TOP = '0rem'; // Mobile hero main title
const MOBILE_HERO_SUBTITLE_MARGIN_TOP = '0rem'; // Mobile hero subtitle (h2)
const MOBILE_HERO_DESC_MARGIN_TOP = '1.0rem'; // Mobile hero description (p)
const MOBILE_HERO_BUTTON_MARGIN_TOP = '.5rem'; // Mobile hero button
const MOBILE_HERO_KEYWORDS_MARGIN_TOP = '.5rem'; // Mobile hero keywords/badges
const _MOBILE_SECTION_TITLE_MARGIN_TOP = '2rem'; // Mobile section main title
const _MOBILE_SECTION_DESC_MARGIN_TOP = '1.2rem'; // Mobile section description (p)
const _MOBILE_CARD_TITLE_MARGIN_TOP = '2rem'; // Mobile card/package title
const _MOBILE_CARD_DESC_MARGIN_TOP = '1rem'; // Mobile card/package description

// --- Typography and Spacing Controls (rem units) ---
// Font sizes (already present, not shown here)

const MesqalServicesPage: React.FC = () => {
  // Simple mobile/desktop detection for margin constants
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches);
  useEffect(() => {
    const handler = () => setIsMobile(window.matchMedia('(max-width: 1023px)').matches);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Inject mobile-only hero up CSS
  useEffect(() => {
    const styleId = 'mobile-hero-up-override';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = mobileHeroUpCSS;
      document.head.appendChild(style);
    }
  }, []);
  // Inject mobile optimization CSS
  useEffect(() => {
    const styleId = 'mobile-mesqal-services-override';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = mobileMesqalServicesCSS;
      document.head.appendChild(style);
    }
  }, []);
  // Ensure floating-hover-btn animation is present (injected if not already)
  React.useLayoutEffect(() => {
    const styleId = 'floating-hover-btn-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .floating-hover-btn {
          animation: floatUpDown 1.6s ease-in-out infinite alternate;
          transition: transform 0.3s cubic-bezier(0.4, 0.8, 0.74, 1.2);
        }
        @keyframes floatUpDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // --- Font Size Controls for Welcome Hero Section (Desktop & Mobile) ---
  // Define font size constants (edit these to change all hero font sizes)
  const HERO_TITLE_FONT_SIZE = '3.3rem';
  const HERO_SUBTITLE_FONT_SIZE = '2.5rem';
  const HERO_NAME_FONT_SIZE = '1.7rem';
  const HERO_DESC_FONT_SIZE = '1.23rem';
  const SERVICE_TITLE_FONT_SIZE = '1.8rem'; // Service package titles
  const MOBILE_HERO_TITLE_FONT_SIZE = '1.5rem';
  const MOBILE_HERO_SUBTITLE_FONT_SIZE = '1.45rem';
  const MOBILE_HERO_NAME_FONT_SIZE = '1.50rem';
  const MOBILE_HERO_DESC_FONT_SIZE = '1rem';
  const _MOBILE_SERVICE_TITLE_FONT_SIZE = '1.4rem'; // Mobile service package titles

  // Inject or update CSS variables for hero font sizes (desktop & mobile) on every render
  React.useLayoutEffect(() => {
    const styleId = 'hero-font-size-vars';
    let style = document.getElementById(styleId);
    const css = `
      :root {
        --hero-title-font-size: ${HERO_TITLE_FONT_SIZE};
        --hero-subtitle-font-size: ${HERO_SUBTITLE_FONT_SIZE};
        --hero-name-font-size: ${HERO_NAME_FONT_SIZE};
        --hero-desc-font-size: ${HERO_DESC_FONT_SIZE};
      }
      @media (max-width: 1023px) {
        :root {
          --hero-title-font-size: ${MOBILE_HERO_TITLE_FONT_SIZE};
          --hero-subtitle-font-size: ${MOBILE_HERO_SUBTITLE_FONT_SIZE};
          --hero-name-font-size: ${MOBILE_HERO_NAME_FONT_SIZE};
          --hero-desc-font-size: ${MOBILE_HERO_DESC_FONT_SIZE};
        }
      }
    `;
    if (style) {
      style.textContent = css;
    } else {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = css;
      document.head.appendChild(style);
    }
    // Cleanup: remove style tag on unmount
    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [HERO_TITLE_FONT_SIZE, HERO_SUBTITLE_FONT_SIZE, HERO_NAME_FONT_SIZE, HERO_DESC_FONT_SIZE, MOBILE_HERO_TITLE_FONT_SIZE, MOBILE_HERO_SUBTITLE_FONT_SIZE, MOBILE_HERO_NAME_FONT_SIZE, MOBILE_HERO_DESC_FONT_SIZE]);
  // State for client logo popup
  const [selectedLogo, setSelectedLogo] = useState<{
    src: string;
    alt: string;
    name: string;
  } | null>(null);
  // State for testimonials slideshow
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Stefan Antonsson",
      service: "Research Collaboration",
      details: "Senior Brand Manager Intern at P&G",
      location: "August 2023",
      quote: "Mesq'al was kind enough to share her time and expertise to support me during a pro-bono research project on grocery cooperatives. Her perspective on how to effectively operate and sustainably grow a cooperative grocery store was incredibly valuable for my team and the work we are doing. Mesq'al was engaging, articulate, and our pro-bono consultation really helped us make progress on the research - I would highly recommend working with her!",
      initial: "SA"
    },
    {
      id: 2,
      name: "Vidhya Shanker, PhD",
      service: "Evaluation Scholar, Practitioner & Activist",
      details: "Client",
      location: "January 2023",
      quote: "Mesq'al brings a calm energy to business relationships and takes the time to understand what I'm trying to accomplish. She completed an extensive project for me on time and with great quality. She was communicative throughout the process and I felt very supported. I would definitely work with her again!",
      initial: "VS"
    },
    {
      id: 3,
      name: "Stacyann P. Russell",
      service: "Founder & CEO at The Daraja Collective, LLC",
      details: "Direct Manager",
      location: "February 2021",
      quote: "I had the pleasure of working with Mesq'al for about 8 months in 2020. She is highly organized, creative, and has a keen eye for design. She was able to manage multiple projects simultaneously while maintaining high quality standards. Her positive attitude and willingness to take on new challenges made her a valuable team member. I would not hesitate to work with her again.",
      initial: "SR"
    },
    {
      id: 4,
      name: "Jenny Wong",
      service: "Program Manager @ Renaissance",
      details: "Direct Manager",
      location: "November 2020",
      quote: "Mesq'al came with a different way of thinking and provided innovative ideas and solutions to organizational challenges. She consistently went above and beyond her duties, taking the lead on projects and managing a mini grants program. She revamped our center's social media and marketing efforts, creating visually appealing newsletters and increasing engagement. She was client-focusedpatient and thorough. One client even sent her a thank you card for her help. I highly recommend Mesq'al.",
      initial: "JW"
    },
    {
      id: 5,
      name: "Selah",
      service: "Freelance & Social Media Guidance",
      details: "Client",
      location: "2023",
      quote: "I definitely recommend her services. She helped direct me to more freelance projects and taught me how to utilize my LinkedIn and Facebook accounts",
      initial: "S"
    }
  ];

  // Process data for each Creative Support Package
  
  // Slideshow navigation functions
  const nextTestimonial = useCallback(() => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonialIndex(index);
  };

  const toggleSlideShowPause = () => {
    setIsSlideShowPaused(!isSlideShowPaused);
  };

  // Auto-advance slideshow
  useEffect(() => {
    if (!isSlideShowPaused) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change slide every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isSlideShowPaused, currentTestimonialIndex, nextTestimonial]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  // Client logos data
  const clientLogos = [
    { src: '/client-logos/bakaberg-logo.webp', alt: 'Bakaberg', name: 'Bakaberg' },
    { src: '/client-logos/bella-logo.webp', alt: 'Bella', name: 'Bella' },
    { src: '/client-logos/blm-boston-logo.webp', alt: 'BLM Boston', name: 'BLM Boston' },
    { src: '/client-logos/black-storytelling-week-logo.svg', alt: 'Black Storytelling Week', name: 'Black Storytelling Week' },
    { src: '/client-logos/rastafari-tv-logo.webp', alt: 'Rastafari TV', name: 'Rastafari TV' },
    { src: '/client-logos/daraja-logo.webp', alt: 'Daraja', name: 'Daraja' },
    { src: '/client-logos/entrepreneurs-playground-logo.webp', alt: 'Entrepreneurs Playground', name: 'Entrepreneurs Playground' },
    { src: '/client-logos/idea-to-pitch-logo.webp', alt: 'Idea to Pitch', name: 'Idea to Pitch' },
    { src: '/client-logos/lion-pub-logo.webp', alt: 'Lion Pub', name: 'Lion Pub' },
    { src: '/client-logos/site-media-logo.webp', alt: 'Site Media', name: 'Site Media' },
    { src: '/client-logos/slfnd-logo.webp', alt: 'SLFND', name: 'SLFND' },
    { src: '/client-logos/Screenshot 2024-05-26 122411.webp', alt: 'Vivero', name: 'Vivero' }
  ];
  const _servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Virtual Assistant Services",
    "provider": {
      "@type": "Person",
      "name": "Mesq'al Kebra"
    },
    "description": "Professional virtual assistant services for impact driven practitioners and wellness professionals",
    "serviceType": "Virtual Assistant",
    "areaServed": "Global"
  };

  return (
    <>
      <SEO
        title={PAGE_SEO["/mesqal-services"].title}
        description={PAGE_SEO["/mesqal-services"].description}
        image={PAGE_SEO["/mesqal-services"].image}
        imageAlt={PAGE_SEO["/mesqal-services"].imageAlt}
        imageWidth={1200}
        imageHeight={630}
        url="/mesqal-services"
        keywords={[
          'mesqal kebra virtual assistant',
          'wellness industry virtual assistant',
          'virtual assistant healers coaches',
          'creative business support wellness',
          'administrative support wellness practitioners',
          'virtual assistant spiritual business',
          'wellness entrepreneur business support',
          'holistic practitioner virtual assistant',
          'remote business management wellness',
          'virtual assistant wellness industry',
          'creative services wellness business',
          'administrative excellence wellness',
          'business support healing practitioners',
          'virtual assistant coaching industry',
          'wellness business optimization',
          'strategic planning wellness practitioners',
          'project management wellness business',
          'virtual assistant spiritual entrepreneurs',
          'creative solutions wellness industry',
          'business development wellness sector',
          'administrative services holistic health',
          'virtual assistant global wellness',
          'business support international healers',
          'wellness practice management virtual',
          'creative business solutions wellness',
          'virtual assistant remote wellness',
          'strategic support wellness entrepreneurs',
          'business optimization wellness industry',
          'virtual administrative wellness services',
          'creative assistance wellness professionals'
        ]}
        type="Service"
        schemaType="Service"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Mesqal Kebra Virtual Assistant & Creative Business Support',
          description: 'Specialized virtual assistant and creative business support services for wellness practitioners, healers, coaches, and impact-driven entrepreneurs worldwide.',
          provider: {
            '@type': 'Person',
            name: 'Mesqal Kebra',
            jobTitle: 'Virtual Assistant & Creative Business Strategist',
            description: 'Experienced virtual assistant and business strategist specializing in supporting wellness practitioners, healers, and impact-driven entrepreneurs with administrative excellence and creative solutions.',
            knowsAbout: [
              'Virtual Assistant Services',
              'Business Strategy',
              'Project Management',
              'Creative Solutions',
              'Wellness Industry Support',
              'Administrative Excellence',
              'Strategic Planning',
              'Business Development'
            ],
            hasOccupation: {
              '@type': 'Occupation',
              name: 'Virtual Assistant',
              occupationLocation: {
                '@type': 'Place',
                name: 'Global (Remote)'
              }
            }
          },
          serviceType: [
            {
              '@type': 'Service',
              name: 'Virtual Administrative Support',
              description: 'Comprehensive administrative support for wellness practitioners including scheduling, client management, and business operations'
            },
            {
              '@type': 'Service',
              name: 'Creative Business Solutions',
              description: 'Creative design, content creation, and innovative business solutions tailored for the wellness industry'
            },
            {
              '@type': 'Service',
              name: 'Strategic Business Planning',
              description: 'Strategic planning and business development services for wellness entrepreneurs and healing practitioners'
            },
            {
              '@type': 'Service',
              name: 'Project Management',
              description: 'Professional project management for wellness programs, retreats, and business initiatives'
            }
          ],
          areaServed: [
            { '@type': 'Place', name: 'Global' },
            { '@type': 'Place', name: 'North America' },
            { '@type': 'Place', name: 'Europe' },
            { '@type': 'Place', name: 'Australia' },
            { '@type': 'Place', name: 'Caribbean' },
            { '@type': 'Place', name: 'Worldwide Remote Services' }
          ],
          audience: [
            { '@type': 'Audience', audienceType: 'Wellness Practitioners' },
            { '@type': 'Audience', audienceType: 'Healing Practitioners' },
            { '@type': 'Audience', audienceType: 'Life Coaches' },
            { '@type': 'Audience', audienceType: 'Spiritual Entrepreneurs' },
            { '@type': 'Audience', audienceType: 'Holistic Health Professionals' },
            { '@type': 'Audience', audienceType: 'Impact-Driven Entrepreneurs' }
          ]
        }}
        locale="en_US"
        siteName="Portals of Samadhi"
      />
      <div className="samadhi-service-page bg-samadhi-black">
        {/* Clean, Minimalist Hero Section - Theme Aware */}
        <section 
          className="mbg-section mbg-bg-white scroll-fade-in mobile-hero-section-up welcome-hero-mobile-up"
          style={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '4rem', // Match NavBar height
            marginTop: '0'
          }}
        >
          {/* Mobile CSS ensures hero starts below NavBar */}
          <style>{mobileHeroUpCSS}</style>
          <div className="mbg-container w-full scroll-slide-up" style={{ marginTop: '0' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 items-center">
              <div className="space-y-6 scroll-fade-in scroll-delay-100 lg:order-1">
                <h1 
                  className="mbg-heading-xl scroll-slide-left scroll-delay-200"
                  style={{ 
                    fontSize: 'calc(var(--hero-title-font-size) * 0.92)',
                    wordSpacing: '0em', 
                    marginTop: isMobile ? MOBILE_HERO_TITLE_MARGIN_TOP : HERO_TITLE_MARGIN_TOP, 
                    textAlign: 'left',
                  }}
                >
                  <span className="text-green-700 dark:text-green-500 font-semibold">Operational Clarity</span> for the <span className="text-green-700 dark:text-green-500 font-semibold"> Impact Driven</span>.
                </h1>
                {/* Mobile image below title */}
                <div className="block lg:hidden">
                  <div className="relative scroll-slide-right scroll-delay-400" style={{ marginTop: '.7rem' }}>
                    <div className="aspect-[1/1] overflow-hidden rounded-2xl shadow-2xl scroll-scale scroll-delay-500">
                      <img 
                        src="/images - Copy/Site Files/13315_1369e9efd35a8daf5c2382e05edaec5f-1_8_2024 1_27_12 PM.webp" 
                        alt="Mesq'al Kebra - Virtual Assistant Services" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Move words closer to image on mobile */}
                  <div className="mobile-hero-below-img">
                    <style>{`
                      @media (max-width: 1023px) {
                        .mobile-hero-below-img { margin-top: -8rem !important; }
                        .mobile-hero-below-img h2, .mobile-hero-below-img p { margin-top: 1.5rem !important; }
                      }
                    `}</style>
                    <h2 className="mbg-heading-lg scroll-slide-left scroll-delay-300 text-gray-900 dark:text-white"
                      style={{ 
                        fontSize: 'var(--hero-subtitle-font-size)', 
                        wordSpacing: '0em', 
                        marginTop: isMobile ? MOBILE_HERO_SUBTITLE_MARGIN_TOP : HERO_SUBTITLE_MARGIN_TOP, 
                        textAlign: 'left' 
                      }}>
                      Bring Your Vision to Life
                    </h2>
                    <hr style={{ border: 'none', borderTop: '2px solid #C3998F', margin: '1.2rem 0 0.7rem 0', width: '180px' }} />
                    <div style={{ textAlign: 'left', fontWeight: 700, color: '#C3998F', fontSize: 'var(--hero-name-font-size)', margin: '0.5rem 0 0.5rem 0' }}>
                      with Mesq'al Kebra
                    </div>
                    <p className="mbg-text-lg text-gray-700 dark:text-gray-400 leading-relaxed scroll-fade-in scroll-delay-400 mobile-hero-desc"
                      style={{ fontSize: 'var(--hero-desc-font-size)', wordSpacing: '0em', marginTop: isMobile ? MOBILE_HERO_DESC_MARGIN_TOP : HERO_DESC_MARGIN_TOP, textAlign: 'left' }}>
                      Crafting seamless backend solutions for intricate systems, dynamic launches, and captivating live events with elegance.
                    </p>
                  </div>
                </div>
                {/* End mobile image and words */}
                {/* Desktop/Tablet: words remain outside image block */}
                <div className="hidden lg:block">
                  <h2 className="mbg-heading-lg scroll-slide-left scroll-delay-300 text-gray-900 dark:text-white"
                    style={{ 
                      fontSize: 'var(--hero-subtitle-font-size)', 
                      wordSpacing: '0em', 
                      marginTop: isMobile ? MOBILE_HERO_SUBTITLE_MARGIN_TOP : HERO_SUBTITLE_MARGIN_TOP, 
                      textAlign: 'left' 
                    }}>
                    Bring Your Vision to Life
                  </h2>
                  <hr style={{ border: 'none', borderTop: '2px solid #C3998F', margin: '1.2rem 0 0.7rem 0', width: '180px' }} />
                  <div style={{ textAlign: 'left', fontWeight: 700, color: '#C3998F', fontSize: 'var(--hero-name-font-size)', margin: '0.5rem 0 0.5rem 0' }}>
                    with Mesq'al Kebra
                  </div>
                  <p className="mbg-text-lg text-gray-700 dark:text-gray-400 leading-relaxed scroll-fade-in scroll-delay-400"
                    style={{ fontSize: 'var(--hero-desc-font-size)', wordSpacing: '0em', marginTop: isMobile ? MOBILE_HERO_DESC_MARGIN_TOP : HERO_DESC_MARGIN_TOP, textAlign: 'left' }}>
                    Crafting seamless backend <span className="text-green-700 dark:text-green-500 font-semibold">solutions</span> for <span className="text-green-700 dark:text-green-500 font-semibold">intricate systems</span>, <span className="text-green-700 dark:text-green-500 font-semibold">dynamic launches</span>, and captivating <span className="text-green-700 dark:text-green-500 font-semibold">live events</span> with elegance.
                  </p>
                </div>
                <div className="flex items-center gap-4 scroll-scale scroll-delay-500" style={{ marginTop: isMobile ? MOBILE_HERO_BUTTON_MARGIN_TOP : HERO_BUTTON_MARGIN_TOP, justifyContent: 'flex-start' }}>
                  <button
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl floating-hover-btn"
                    onClick={() => {
                      const element = document.getElementById('core-services');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Explore Services</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 pt-4 items-center" style={{ marginTop: isMobile ? MOBILE_HERO_KEYWORDS_MARGIN_TOP : HERO_KEYWORDS_MARGIN_TOP, textAlign: 'left', justifyContent: 'flex-start' }}>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    <span>Digital Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    <span>Virtual Services</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    <span>Process Optimization</span>
                  </div>
                </div>
              </div>
              {/* Desktop only: show image in right column */}
              <div className="hidden lg:block lg:order-2">
                <div className="relative scroll-slide-right scroll-delay-400" style={{ marginTop: '1rem' }}>
                  <div className="aspect-[1/1] overflow-hidden rounded-2xl shadow-2xl scroll-scale scroll-delay-500">
                    <img 
                      src="public/images - Copy/Site Files/13315_1369e9efd35a8daf5c2382e05edaec5f-1_8_2024 1_27_12 PM.webp" 
                      alt="Mesq'al Kebra - Virtual Assistant Services" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Main Content - Theme Aware */}
        <div className="mbg-section mbg-bg-white" style={{
          marginTop: '0rem' // Adjustable: Services section margin
        }}>
          {/* Artisan Creative Support Section */}
          <section 
            id="core-services" 
            className="mbg-section scroll-fade-in"
            style={{
              marginTop: '-6rem' // Adjustable: Core services subsection margin
            }}
          >
            <div className="mbg-container">              <div className="text-center mb-16 scroll-slide-up">
                <div className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-6" style={{
                  backgroundColor: 'var(--mbg-light-green)',
                  color: 'var(--mbg-primary-green)',
                  border: '1px solid var(--mbg-primary-green)'
                }}>
                  Artisan Creative Support
                </div>
                <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif', fontSize: HERO_TITLE_FONT_SIZE, wordSpacing: '0em', marginTop: SECTION_TITLE_MARGIN_TOP }}>Creative Partnership Excellence</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: SECTION_DESC_MARGIN_TOP }}>
                  Dedicated support designed for creators, visionaries, and change-makers who seek to amplify their impact while maintaining authenticity. Our specialized packages address the unique challenges faced by purpose-driven professionals in today's creative economy.
                </p>
              </div><div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger scroll-fade-in scroll-delay-200">              {/* A Helping Hand Package - Theme Aware */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-green-900 dark:to-blue-900 rounded-lg p-6 group scroll-scale scroll-delay-100 border-2 border-green-300 dark:border-green-600 hover:border-green-500 transition-all duration-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontSize: SERVICE_TITLE_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_TITLE_MARGIN_TOP }}>A Helping Hand</h3>
                  <div className="inline-block px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-xs font-medium border border-green-300 dark:border-green-600">
                    MONTHLY • VIRTUAL ASSISTANCE + STRATEGIC CONSULTING
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed" style={{ fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_DESC_MARGIN_TOP }}>
                    Perfect for those drowning in tasks, struggling with workflow, or unsure how to integrate automation and AI effectively. You've got momentum, but need focused, intelligent support to keep your head above water with a thoughtful custom setup and strategic guidance.
                  </p>                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    {[
                      "Workflow evaluation and optimization",
                      "Tool and software setup",
                      "Email/website automations",
                      "Strategic consulting sessions",
                      "Calendar, client, and data management",
                      "Documentation and delegation systems"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul><div className="mt-auto">
                    <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$2,800–$4,500</div>                        <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">Monthly • Strategic Partnership</div>
                      </div>
                    </div>
                    <BookingDialogNew 
                      serviceName="A Helping Hand Package"
                      serviceDuration="Monthly Service"
                      servicePrice={2800}
                      practitionerName="Mesq'al Kebra"
                      buttonClassName="w-full bg-white text-green-600 border border-black font-medium py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>              {/* Finish What You Started Package - Theme Aware */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-green-900 dark:to-blue-900 rounded-lg p-6 group relative scroll-scale scroll-delay-200 border-2 border-green-300 dark:border-green-600 hover:border-green-500 transition-all duration-300 shadow-lg">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                </div>                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontSize: SERVICE_TITLE_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_TITLE_MARGIN_TOP }}>Finish What You Started</h3>
                  <div className="inline-block px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-xs font-medium border border-green-300 dark:border-green-600">
                    PROJECT-BASED • DIGITAL PRODUCT COMPLETION + LAUNCH
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed" style={{ fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_DESC_MARGIN_TOP }}>
                    You began something worth finishing: an online course, a landing page, a book, or a service portal, now it's time to finish it. This package bridges the gap between concept and public release with deep build work requiring skilled design, tech stack integration, and content strategy.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    {[
                      "Project audit and scope alignment",
                      "Website or product build (up to 5 pages/modules)",
                      "Copywriting + content refinement",
                      "Testing, launch sequence setup",
                      "Integration with payment or delivery systems",
                      "Light branding or style polishing"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>                  <div className="mt-auto">
                    <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$4,500–$7,500+</div>
                        <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">Per Project • Complete Transformation</div>
                      </div>
                    </div>
                    <BookingDialogNew 
                      serviceName="Finish What You Started Package"
                      serviceDuration="Project-Based Service"
                      servicePrice={4500}
                      practitionerName="Mesq'al Kebra"
                      buttonClassName="w-full bg-white text-green-600 border border-black font-medium py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>              {/* Gather Package - Theme Aware */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-green-900 dark:to-blue-900 rounded-lg p-6 group scroll-scale scroll-delay-300 border-2 border-green-300 dark:border-green-600 hover:border-green-500 transition-all duration-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontSize: SERVICE_TITLE_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_TITLE_MARGIN_TOP }}>Gather</h3>
                  <div className="inline-block px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-xs font-medium border border-green-300 dark:border-green-600">
                    EVENT-BASED • EVENT DESIGN + HOSTING SUPPORT
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed" style={{ fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: CARD_DESC_MARGIN_TOP }}>
                    Ideal for educators and community builders hosting online/hybrid courses, webinars, or immersive experiences. We provide full-service production support, handling your tech stack, session program, and outreach plan so you can focus on delivering impact.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    {[
                      "Event planning + tech setup",
                      "Registration and promotion system",
                      "Branded assets (graphics, copy, visuals)",
                      "Backend support during event",
                      "Pre/post communications and follow-ups",
                      "Optional co-hosting/moderation"                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                    <div className="mt-auto">
                    <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$3,200–$5,800+</div>
                        <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">Per Event • Curated Experience</div>
                      </div>
                    </div>
                    <BookingDialogNew 
                      serviceName="Gather Package"
                      serviceDuration="Event-Based Service"
                      servicePrice={3200}
                      practitionerName="Mesq'al Kebra"
                      buttonClassName="w-full bg-white text-green-600 border border-black font-medium py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>{/* Pricing Philosophy */}            <div className="mt-16 text-center scroll-slide-up scroll-delay-400">
              {/* Philosophy box removed as requested */}
            </div>

            {/* Custom Package Option */}
            <div className="mt-8 text-center scroll-slide-up scroll-delay-500">
              <div className="bg-green-50 dark:bg-green-800 rounded-lg p-6 border border-green-300 dark:border-green-600 max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium" style={{ fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: SECTION_DESC_MARGIN_TOP }}>
                  Doesn't fit your budget? Contact us for custom package. We cater to all.
                </p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                    💳 Pay As You Go Available
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Can't afford the entire package? No problem! You can pay for each session individually as you go, making your administrative support more accessible and flexible.
                  </p>
                </div>
                <div className="mt-4">
                  {/* BookingDialogNew: Custom Package Consultation (Full Package tab removed) */}
                  <BookingDialogNew 
                    serviceName="Custom Package Consultation"
                    serviceDuration="Consultation"
                    servicePrice={0}
                    practitionerName="Mesq'al Kebra"
                    buttonClassName="bg-white text-green-600 border border-black font-medium py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
                  />
                </div>
              </div>
              {/* Other Services Button - now outside the green box */}
              <div className="mt-8 text-center scroll-slide-up scroll-delay-500">
                <a
                  href="/experiences#services"
                  onClick={e => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-white text-green-600 border border-green-500 font-medium py-3 px-8 rounded-lg hover:bg-green-100 transition-colors duration-300 text-lg shadow-md hover:shadow-lg"
                  aria-label="Go to Service Packages and Booking section"
                  style={{ marginTop: '1.5rem' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Other Services
                </a>
              </div>
            </div>
            {/* Removed duplicate Custom Package Option below 'Other Services' button */}
          </div>
        </section>
        </div>        {/* Past Clients & Collaborators Section - Theme Aware */}
        <div className="mbg-section mbg-bg-white" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          paddingTop: '0.0rem',
          marginTop: '-4rem' // Tighter: Clients section margin
        }}>
          <section 
            className="mbg-section scroll-fade-in"
            style={{
              marginTop: '0'
            }}
          >
            <div className="mbg-container">              <div className="text-center space-y-12 scroll-slide-up">
                {/* Keyword Title */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-medium mb-4 border border-green-300 dark:border-green-600">
                    Clientele
                  </div>
                
                  <div className="space-y-4">                    <h2 className="mbg-heading-lg text-gray-900 dark:text-white">
                      Past Clients & Collaborators
                    </h2>
                    <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Trusted by leading organizations and innovative entrepreneurs
                    </p>
                  </div>
                </div>
                
                {/* Client Logos Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center scroll-stagger scroll-scale scroll-delay-200">
                  {clientLogos.map((logo, index) => (
                    <div                      key={index}
                      className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedLogo(logo)}
                  >                    <OptimizedImage
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-16 w-auto object-contain filter grayscale group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
                <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Ready to join our growing network of successful partnerships?
                </p>
              </div>
            </div>
          </div>
        </section>
        </div>        {/* Testimonials Section - Theme Aware */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          paddingTop: '0.0rem',
          marginTop: '-4rem' // Tighter: Testimonials section margin
        }}>
          <section 
            className="mbg-section scroll-fade-in"
            style={{
              marginTop: '-3'
            }}
          >          <div className="mbg-container">
            <div className="text-center space-y-12 scroll-slide-up">              <div className="space-y-4">
                    <h2 className="mbg-heading-lg text-gray-900 dark:text-white text-center" style={{ fontSize: HERO_TITLE_FONT_SIZE, wordSpacing: '0em', marginTop: SECTION_TITLE_MARGIN_TOP }}>
                  What Clients Say
                </h2>
                    <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center" style={{ fontSize: HERO_DESC_FONT_SIZE, wordSpacing: '0em', marginTop: SECTION_DESC_MARGIN_TOP }}>
                  Hear from professionals who have experienced the value of our virtual assistant services
                </p>
              </div>
              
              {/* Testimonials Slideshow */}
              <div className="relative max-w-4xl mx-auto mb-16">
                {/* Main Testimonial Card */}
                <div 
                  className="bg-white dark:bg-gradient-to-br dark:from-green-900 dark:to-blue-900 rounded-xl p-8 shadow-lg border border-gray-300 dark:border-green-700 min-h-[300px] flex items-center transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="w-full flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-6">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-300 hover:scale-110 mx-auto">
                        {testimonials[currentTestimonialIndex].initial}
                      </div>
                    </div>
                    <div className="max-w-3xl mx-auto">
                      <div className="mb-6">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-opacity duration-300">
                          {testimonials[currentTestimonialIndex].name}
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-300 font-medium mb-1 transition-opacity duration-300">
                          {testimonials[currentTestimonialIndex].service}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 transition-opacity duration-300">
                          {testimonials[currentTestimonialIndex].details}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-opacity duration-300">
                          {testimonials[currentTestimonialIndex].location}
                        </p>
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-200 italic leading-relaxed text-lg transition-opacity duration-300">
                        "{testimonials[currentTestimonialIndex].quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>                {/* Navigation Arrows */}
                <button
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-300 dark:border-green-600 hover:border-gray-400 dark:hover:border-green-500 hover:scale-110 active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-300 dark:border-green-600 hover:border-gray-400 dark:hover:border-green-500 hover:scale-110 active:scale-95"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={toggleSlideShowPause}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-12 h-12 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-300 dark:border-green-600 hover:border-gray-400 dark:hover:border-green-500 hover:scale-110 active:scale-95"
                  aria-label={isSlideShowPaused ? "Resume slideshow" : "Pause slideshow"}
                >
                  {isSlideShowPaused ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v9a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                        index === currentTestimonialIndex
                          ? 'bg-green-500 dark:bg-green-400 shadow-lg scale-125'
                          : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 h-1 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${((currentTestimonialIndex + 1) / testimonials.length) * 100}%` 
                    }}
                  ></div>
                </div>

                {/* Slide Counter */}
                <div className="absolute top-4 right-6 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 text-white dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  style={{ animation: 'floatUpDown 2.5s ease-in-out infinite' }}>
                  {currentTestimonialIndex + 1} / {testimonials.length}
                </div>
              </div>
              
              <div className="text-center scroll-fade-in" style={{ animation: 'floatUpDown 2.5s ease-in-out infinite' }}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                </p>
              </div>
            </div>
          </div>
        </section>
        </div>        {/* Call to Action Section - Theme Aware */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" style={{
          minHeight: '0',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '2rem' // Reduced margin to bring CTA closer to footer
        }}>
          <section 
            className="mbg-section scroll-fade-in"
            style={{
              marginTop: '0.5rem', // Reduced margin for CTA subsection
              marginBottom: '0' // Remove extra space below
            }}
          >
            <div className="mbg-container">
              <div className="text-center space-y-8 scroll-slide-up">
                <h2 className="mbg-heading-lg text-gray-900 dark:text-white scroll-fade-in scroll-delay-100">
                  Ready to focus on what you do best?
                </h2>
                <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto scroll-fade-in scroll-delay-200">
                  Let us handle the administrative details while you focus on serving your clients and growing your practice.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade-in scroll-delay-300">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white block mb-3">30 minutes • Free</span>
                  <BookingDialogNew 
                    serviceName="Discovery Call"
                    serviceDuration="30 minutes"
                    servicePrice={0}
                    practitionerName="Mesq'al Kebra"
                    buttonClassName="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    hideFullPackageTab={true}
                  />
                </div>
                
                <button
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    const element = document.getElementById('core-services');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >Learn More
                </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Client Logo Popup Dialog */}
      {selectedLogo && (
        <Dialog open={!!selectedLogo} onOpenChange={() => setSelectedLogo(null)}>
          <DialogContent className="max-w-2xl">
            <div className="flex flex-col items-center space-y-6 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedLogo.name}
                </h3>
                <p className="text-gray-600">
                  Trusted Client & Collaborator
                </p>
              </div>
              
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg w-full">
                <OptimizedImage
                  src={selectedLogo.src}
                  alt={selectedLogo.alt}
                  className="max-h-48 w-auto object-contain"
                />
              </div>
              
              <div className="text-center max-w-md">
                <p className="text-gray-700 leading-relaxed">
                  We've had the privilege of working with {selectedLogo.name} to provide 
                  professional virtual assistant services, helping them focus on their core 
                  mission while we handle the administrative details.
                </p>
              </div>
              <button
                onClick={() => setSelectedLogo(null)}
                className="bg-white text-green-600 border border-black font-medium py-2 px-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          /* CTA Book Now & Learn More button mobile sizing and fix grey spot */
          @media (max-width: 640px) {
            button.cta-btn-mobile,
            .cta-btn-mobile,
            .cta-btn-mobile:active,
            .cta-btn-mobile:focus {
              width: 100% !important;
              display: block !important;
              box-sizing: border-box !important;
              margin: 0 0 8px 0 !important;
              padding: 0.85rem 1.5rem !important;
              background: linear-gradient(90deg, #C3998F 0%, #16a34a 100%) !important;
              border: none !important;
              color: #fff !important;
              border-radius: 0.75rem !important;
              box-shadow: 0 4px 16px rgba(34,197,94,0.12), 0 1.5px 8px 0 rgba(16,185,129,0.10) !important;
              font-weight: 600 !important;
              font-size: 1.1rem !important;
              letter-spacing: 0.01em !important;
              transition: background 0.2s, color 0.2s, box-shadow 0.2s !important;
              outline: none !important;
            }
            button.cta-btn-mobile:hover,
            .cta-btn-mobile:hover {
              background: linear-gradient(90deg, #16a34a 0%, #C3998F 100%) !important;
              color: #fff !important;
              box-shadow: 0 8px 24px rgba(34,197,94,0.18), 0 2px 12px 0 rgba(16,185,129,0.12) !important;
            }
          }
          /* Scroll snapping styles */
          html {
            scroll-snap-type: none;
            scroll-behavior: smooth;
          }
          
          section {
            scroll-snap-align: none;
          }

          /* Base scroll animation styles */
          .scroll-fade-in {
            opacity: 0;
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .scroll-fade-in.active {
            opacity: 1;
          }

          .scroll-slide-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .scroll-slide-left.active {
            opacity: 1;
            transform: translateX(0);
          }

          .scroll-slide-right {
            opacity: 0;
            transform: translateX(50px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .scroll-slide-right.active {
            opacity: 1;
            transform: translateX(0);
          }

          .scroll-slide-up {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .scroll-slide-up.active {
            opacity: 1;
            transform: translateY(0);
          }

          .scroll-scale {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .scroll-scale.active {
            opacity: 1;
            transform: scale(1);
          }

          .scroll-blur-reveal {
            opacity: 0;
            filter: blur(10px);
            transition: opacity 0.8s ease-out, filter 0.8s ease-out;
          }
          
          .scroll-blur-reveal.active {
            opacity: 1;
            filter: blur(0);
          }

          .scroll-stagger {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          
          .scroll-stagger.active {
            opacity: 1;
            transform: translateY(0);
          }

          /* Delay classes for staggered animations */
          .scroll-delay-100 { transition-delay: 0.1s; }
          .scroll-delay-200 { transition-delay: 0.2s; }
          .scroll-delay-300 { transition-delay: 0.3s; }
          .scroll-delay-400 { transition-delay: 0.4s; }
          .scroll-delay-500 { transition-delay: 0.5s; }
          .scroll-delay-600 { transition-delay: 0.6s; }
          .scroll-delay-700 { transition-delay: 0.7s; }
          .scroll-delay-800 { transition-delay: 0.8s; }
          .scroll-delay-900 { transition-delay: 0.9s; }

          .reveal-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          
          .reveal-on-scroll.active {
            opacity: 1;
            transform: translateY(0);
          }

          .fade-in {
            transition-delay: 0.2s;
          }

          .glass-effect {
            backdrop-filter: blur(8px);
            background-color: rgba(255, 255, 255, 0.7);
          }

          @supports not (backdrop-filter: blur(8px)) {
            .glass-effect {
              background-color: rgba(255, 255, 255, 0.95);
            }
          }

          /* Smooth scrolling for all elements */
          * {
            scroll-behavior: smooth;
          }

          /* Enhanced scroll snapping */
          .scroll-snap-container {
            scroll-snap-type: none;
            overflow-y: scroll;
            height: 100vh;
          }
          
          .scroll-snap-section {
            scroll-snap-align: none;
            scroll-snap-stop: normal;
          }

          /* Ensure stagger effects work properly */
          .scroll-stagger:nth-child(1) { transition-delay: 0.1s; }
          .scroll-stagger:nth-child(2) { transition-delay: 0.2s; }
          .scroll-stagger:nth-child(3) { transition-delay: 0.3s; }
          .scroll-stagger:nth-child(4) { transition-delay: 0.4s; }
          .scroll-stagger:nth-child(5) { transition-delay: 0.5s; }

          /* Featured badge responsive styling */
          .featured-badge-responsive {
            /* Mobile: plain green text */
            color: #C3998F;
            background: transparent;
            padding: 0;
            border-radius: 0;
            box-shadow: none;
            margin-top: -1.5rem;
          }

          /* Desktop: green oval background */
          @media (min-width: 768px) {
            .featured-badge-responsive {
              background: linear-gradient(to right, #059669, #10b981);
              color: white;
              padding: 0.25rem 1rem;
              border-radius: 9999px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              margin-top: 0;
            }
          }

          @media (max-width: 767px) {
            #core-services,
            #core-services .mbg-container,
            #core-services .grid,
            #core-services [class*='grid'],
            #core-services * {
              overflow: visible !important;
              overflow-x: visible !important;
              overflow-y: visible !important;
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            #core-services::-webkit-scrollbar,
            #core-services .mbg-container::-webkit-scrollbar,
            #core-services .grid::-webkit-scrollbar,
            #core-services [class*='grid']::-webkit-scrollbar,
            #core-services *::-webkit-scrollbar {
              display: none !important;
            }
            /* Remove scroll bars from testimonials section on mobile */
            .bg-white.dark\\:bg-gray-800,
            .bg-white.dark\\:bg-gray-800 .mbg-container,
            .bg-white.dark\\:bg-gray-800 .mbg-section,
            .bg-white.dark\\:bg-gray-800 * {
              overflow: visible !important;
              overflow-x: visible !important;
              overflow-y: visible !important;
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            .bg-white.dark\\:bg-gray-800::-webkit-scrollbar,
            .bg-white.dark\\:bg-gray-800 .mbg-container::-webkit-scrollbar,
            .bg-white.dark\\:bg-gray-800 .mbg-section::-webkit-scrollbar,
            .bg-white.dark\\:bg-gray-800 *::-webkit-scrollbar {
              display: none !important;
            }
          }
        `
      }} />

    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
    </>
  );
};

export default MesqalServicesPage;