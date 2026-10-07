import React, { useEffect, useRef, useState } from 'react';
import OptimizedImage from '../components/ui/OptimizedImage';
import BookingDialogNew from '../components/booking/BookingDialogNew';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '../components/ui/dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';

// Inline ZoomableImage component since import does not exist
function ZoomableImage({ src, alt }) {
  const imgRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [start, setStart] = React.useState({ x: 0, y: 0 });
  const [lastTranslate, setLastTranslate] = React.useState({ x: 0, y: 0 });
  const lastDist = React.useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    let newScale = scale + (e.deltaY < 0 ? 0.15 : -0.15);
    newScale = Math.max(1, Math.min(newScale, 4));
    setScale(newScale);
  };
  const handleMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => {
    setDragging(false);
    setLastTranslate(translate);
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setTranslate({
      x: lastTranslate.x + (e.clientX - start.x),
      y: lastTranslate.y + (e.clientY - start.y),
    });
  };
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDist.current = getDist(e.touches);
    } else if (e.touches.length === 1) {
      setDragging(true);
      setStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };
  const handleTouchEnd = () => {
    setDragging(false);
    setLastTranslate(translate);
    lastDist.current = null;
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = getDist(e.touches);
      if (lastDist.current) {
        let newScale = scale * (dist / lastDist.current);
        newScale = Math.max(1, Math.min(newScale, 4));
        setScale(newScale);
      }
      lastDist.current = dist;
    } else if (e.touches.length === 1 && dragging) {
      setTranslate({
        x: lastTranslate.x + (e.touches[0].clientX - start.x),
        y: lastTranslate.y + (e.touches[0].clientY - start.y),
      });
    }
  };
  function getDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  const handleDoubleClick = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setLastTranslate({ x: 0, y: 0 });
  };
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        touchAction: 'none',
        overflow: 'hidden',
        position: 'relative',
        cursor: scale > 1 ? 'grab' : 'zoom-in',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          maxWidth: '100vw',
          maxHeight: '100vh',
          objectFit: 'contain',
          borderRadius: 0,
          display: 'block',
          position: 'static',
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          transition: dragging ? 'none' : 'transform 0.2s cubic-bezier(.4,2,.3,1)',
          boxShadow: scale > 1 ? '0 0 0 2px #C3998F' : 'none',
          background: '#f8fafc',
          cursor: scale > 1 ? 'grab' : 'zoom-in',
        }}
        draggable={false}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(34,197,94,0.85)',
          color: '#fff',
          padding: '0.5rem 1.25rem',
          borderRadius: '1.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          boxShadow: '0 2px 12px rgba(34,197,94,0.15)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {scale > 1 ? 'Drag to pan. Double tap/click to reset.' : 'Pinch or scroll to zoom.'}
      </div>
    </div>
  );
}
import '../components/home/transitions.css';
import '../styles/mbg-aesthetics.css';

// Schema.org structured data for SEO
const feqadSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dr. Feqad Wolde",
  "jobTitle": "Traditional Healer, Jamaican Wisdom Keeper",
  "image": "/images - Copy/Phone/IMG-20220104-WA0010.webp",
  "description": "Experience transformative traditional healing with Dr. Feqad Wolde. Ancient wisdom meets modern wellness practices for holistic health and spiritual growth.",
  "url": "https://portalsofsamadhi.com/feqad-services",
  "alumniOf": "Jamaican Indigenous Healing Lineage",
  "sameAs": [
  "https://portalsofsamadhi.com/feqad-services"
  ]
};
const _servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Traditional Healing, Wellness Renewal, Ancestral Healing, Spiritual Mentorship, Botany Consultation",
  "provider": {
    "@type": "Person",
    "name": "Dr. Feqad Wolde"
  },
  "areaServed": "Global",
  "url": "https://portalsofsamadhi.com/feqad-services"
};

const FeqadServicesPage: React.FC = () => {
  // State for certificate popup
  const [selectedCertificate, setSelectedCertificate] = useState<{
    src: string;
    alt: string;
    title: string;
  } | null>(null);
  // State for testimonials slideshow
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);
  
  // Removed process modal state
  // Testimonials data
  const testimonials = [
    {
      id: 2,
      name: "Yusef",
      service: "7 Chakra Attunement Ceremony",
      details: "Chakra tuning, Reiki Massage, Sound Bath, Divine Healing",
      location: "Jamaica • 2024",
      quote: "Thank you so much brother, I feel like a new person after every session, plus the alkaline food is really healing my body",
      initial: "Y"
    },
    {
      id: 3,
      name: "Diana",
      service: "Trauma Relief Session",
      details: "NLP Hypnotherapy, Guided Meditation",
      location: "SF Bay Area • 2023",
      quote: "Thank you for checking on me! I am feeling good! I am so grateful for the love I felt... was a very positive experience. Thank you so much for the positive male energy!",
      initial: "D"
    },
    {
      id: 4,
      name: '"uhuru" hilton',
      service: "Sound Reiki Healing & Dietary Guidance",
      details: "Trust, Play, Sanctuary & Liberation Strategy",
      location: "March 14, 2023",
      quote: "I felt lighter after each of the 4 healing sessions with Feq'ad Wolde! In each session, we explored my needs, reviewed dietary guidance and Feq'ad offered an incredible sound Reiki healing and a tarot reading. I would become completely relaxed and feel completely free and safe. The rest I experienced during and following those sessions was remarkably deep and replenishing. I could ask any question and be met with an earnest and studied response from Feq'ad. I would go back for the attunement and the dietary recommendations which continue to support my healing.",
      initial: "U"
    },
    {
      id: 5,
      name: "Ijahla K.",
      service: "Detox & Wellness Program",
      details: "Fruit Diet Detox, Nutritional Guidance",
      location: "2017",
      quote: "After the week detox on the fruit menu /diet you recommended I felt very light and lost some weight. I had a lot of energy. I was doing a lot physically as well. So towards the end of the week I was so looking forward to the squash rundown with veg. I really enjoyed it. The bulge on my breast reduced significantly. I have since did another week fast using same method u showed me, which seems to be working.",
      initial: "I"
    },
    {
      id: 6,
      name: "Roberto",
      service: "Magickal Healing Experience",
      details: "Client",
      location: "2021",
      quote: "This experience was amazing, every part of it. the magick and the power you get from this is simply majestic. thanks for opening my world to this extraordinary feeling.",
      initial: "R"
    }
  ];

  // Removed processData object
  
  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

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
        setCurrentTestimonialIndex((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 6000); // Change slide every 6 seconds

      return () => clearInterval(interval);
    }
  }, [isSlideShowPaused, currentTestimonialIndex, testimonials.length]);

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
    }  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Traditional Healing Services",
    "provider": {
      "@type": "Person",
      "name": "Dr. Feqad Wolde"
    },
    "serviceType": "Traditional Healing",
    "availableChannel": {
      "@type": "ServiceChannel",
      "availableLanguage": ["English"],
      "serviceLocation": {
        "@type": "Place",
        "name": "Portals of Samadhi"
      }
    },    "offers": [
      {
        "@type": "Offer",
        "name": "Premium Energy Restoration",
        "price": "285",
        "priceCurrency": "USD",
        "description": "75-minute premium energy healing session"
      },
      {
        "@type": "Offer", 
        "name": "Spiritual Mentorship",
        "price": "395",
        "priceCurrency": "USD",
        "description": "90-minute spiritual guidance session"
      },
      {
        "@type": "Offer",
        "name": "Master Botanist Consultation", 
        "price": "325",
        "priceCurrency": "USD",
        "description": "90-minute master botanist consultation"
      }
    ]
  };

  React.useLayoutEffect(() => {
    const styleId = 'scroll-effects-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Scroll snapping styles */
        html {
          scroll-snap-type: none;
          scroll-behavior: smooth;
        }
        section {
          scroll-snap-align: none;
        }
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
        .fade-in { transition-delay: 0.2s; }
        .glass-effect {
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.7);
        }
        @supports not (backdrop-filter: blur(8px)) {
          .glass-effect {
            background-color: rgba(255, 255, 255, 0.95);
          }
        }
        * { scroll-behavior: smooth; }
        .scroll-snap-container {
          scroll-snap-type: none;
          overflow-y: scroll;
          height: 100vh;
        }
        .scroll-snap-section {
          scroll-snap-align: none;
          scroll-snap-stop: normal;
        }
        .scroll-stagger:nth-child(1) { transition-delay: 0.1s; }
        .scroll-stagger:nth-child(2) { transition-delay: 0.2s; }
        .scroll-stagger:nth-child(3) { transition-delay: 0.3s; }
        .scroll-stagger:nth-child(4) { transition-delay: 0.4s; }
        .scroll-stagger:nth-child(5) { transition-delay: 0.5s; }
      `;
      document.head.appendChild(style);
    }
  }, []);
  return (
    <>
      <SEO
        title={PAGE_SEO["/feqad-services"].title}
        description={PAGE_SEO["/feqad-services"].description}
        image={PAGE_SEO["/feqad-services"].image}
        imageAlt={PAGE_SEO["/feqad-services"].imageAlt}
        imageWidth={1200}
        imageHeight={630}
        url="/feqad-services"
        keywords={[
          'feqad wolde jamaican healer',
          'traditional jamaican healing online',
          'authentic indigenous healing virtual',
          'jamaican spiritual guidance global',
          'traditional energy healing practitioner',
          'jamaican chakra healing virtual',
          'indigenous spiritual mentor online',
          'authentic traditional healer jamaica',
          'virtual jamaican healing sessions',
          'global traditional healing services',
          'jamaican indigenous practices online',
          'traditional spiritual guidance virtual',
          'authentic healing practitioner worldwide',
          'jamaican energy healer online',
          'traditional healing virtual consultations',
          'indigenous jamaican healing global',
          'spiritual transformation healing jamaica',
          'traditional healer virtual sessions',
          'jamaican healing wisdom online',
          'authentic spiritual guidance virtual',
          'traditional indigenous healing worldwide',
          'jamaican healer global reach',
          'virtual traditional healing jamaica',
          'authentic energy healing online',
          'jamaican spiritual practitioner global',
          'traditional healing methods virtual',
          'indigenous wisdom healing online',
          'jamaican traditional medicine virtual',
          'spiritual healer jamaica worldwide',
          'traditional healing booking online'
        ]}
        schemaType="Service"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'Dr. Feqad Wolde Traditional Healing Services',
          description: 'Authentic Jamaican traditional healing and spiritual guidance services offered globally through virtual sessions and in-person retreats.',
          provider: {
            '@type': 'Person',
            name: 'Dr. Feqad Wolde',
            jobTitle: 'Traditional Healing Practitioner & Spiritual Guide',
            description: 'Master traditional healer with over 20 years of experience in Jamaican indigenous healing practices, energy work, and spiritual transformation.',
            nationality: 'Jamaican',
            knowsAbout: [
              'Traditional Jamaican Healing',
              'Indigenous Spiritual Practices', 
              'Energy Healing',
              'Chakra Alignment',
              'Spiritual Guidance',
              'Traditional Medicine',
              'Holistic Wellness'
            ]
          },
          serviceType: [
            {
              '@type': 'MedicalTherapy',
              name: 'Traditional Energy Healing',
              description: 'Authentic Jamaican energy healing sessions for spiritual, emotional, and physical wellness'
            },
            {
              '@type': 'Service',
              name: 'Chakra Alignment & Balancing',
              description: 'Traditional chakra healing and energy center alignment using indigenous Jamaican methods'
            },
            {
              '@type': 'Service', 
              name: 'Spiritual Guidance & Mentorship',
              description: 'Personal spiritual guidance and mentorship rooted in Jamaican indigenous wisdom traditions'
            },
            {
              '@type': 'Service',
              name: 'Traditional Healing Consultations',
              description: 'Comprehensive traditional healing consultations combining ancient wisdom with personalized care'
            }
          ],
          areaServed: [
            { '@type': 'Place', name: 'Global' },
            { '@type': 'Place', name: 'Jamaica' },
            { '@type': 'Place', name: 'North America' },
            { '@type': 'Place', name: 'Europe' },
            { '@type': 'Place', name: 'Caribbean' },
            { '@type': 'Place', name: 'Worldwide Virtual Services' }
          ],
          availableChannel: [
            {
              '@type': 'ServiceChannel',
              serviceType: 'Virtual Healing Sessions',
              availableLanguage: 'English'
            },
            {
              '@type': 'ServiceChannel', 
              serviceType: 'In-Person Sessions',
              serviceLocation: {
                '@type': 'Place',
                name: 'Jamaica'
              }
            }
          ]
        }}
        locale="en_US"
        siteName="Portals of Samadhi"
      />
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(feqadSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');`
      }} />
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=G-XXXXXXXXXX" height="0" width="0" style={{display:'none',visibility:'hidden'}} title="Google Tag Manager"></iframe>
      </noscript>
      <div className="samadhi-service-page bg-samadhi-black hero-mobile-top-fix" style={{
        paddingTop: 0,
        marginTop: 0,
        position: 'relative',
        overflow: 'visible'
      }}>
      <style>{`
        @media (max-width: 1023px) {
          .hero-mobile-top-fix {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .mbg-section {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
        <style>{`
          @media (max-width: 1023px) {
            .welcome-hero-mobile-up { margin-top: -2.5rem !important; }
          }
        `}</style>
        {/* Clean, Minimalist Hero Section - Theme Aware */}
        <section
          className="mbg-section mbg-bg-white scroll-fade-in welcome-hero-mobile-up"
          style={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 0,
            marginTop: 0
          }}
        >
          <div className="mbg-container w-full scroll-slide-up" style={{ marginTop: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-center">
              {/* Mobile: Title, then Image, then rest. Desktop: Title and Image side by side */}
              {/* Mobile only: show image below title */}
              <div className="space-y-6 scroll-fade-in scroll-delay-100 lg:order-1">
                <h1
                  className="mbg-heading-xl scroll-slide-left scroll-delay-200"
                  style={{
                    fontSize: `calc(2.8rem * 1.08)`,
                    wordSpacing: '0em',
                    marginTop: '3rem',
                    textAlign: 'left',
                  }}
                >
                  <span className="text-green-700 dark:text-green-500 font-semibold">Timeless Healing</span> for <span className="text-green-700 dark:text-green-500 font-semibold">Modern Vitality</span>.
                </h1>
                {/* Mobile image below title */}
                <div className="block lg:hidden">
                  <div
                    className="relative scroll-slide-right scroll-delay-400 hero-img-col"
                  >
                    <style>{`
                      @media (max-width: 1023px) {
                        .hero-img-col { margin-top: 0 !important; }
                      }
                      @media (min-width: 1024px) {
                        .hero-img-col { margin-top: 4.8rem !important; }
                      }
                    `}</style>
                    <div
                      className="aspect-[1/1] overflow-hidden rounded-2xl shadow-2xl scroll-scale scroll-delay-500 relative hero-img-mobile-size"
                      style={{ position: 'relative', overflow: 'hidden', minHeight: '100%' }}
                    >
                      {/* Background image behind Welcome image */}
                      <img
                        src="/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp"
                        alt="Background Scenic Jamaica"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          width: '100%',
                          height: '100%',
                          minHeight: '100%',
                          objectFit: 'cover',
                          zIndex: 0,
                          opacity: 1,
                          pointerEvents: 'none',
                        }}
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                      />
                      <img
                        src="/images - Copy/Site Files/For Course_edited_edited.webp"
                        alt="Dr. Feqad Wolde - Traditional Jamaica Healer"
                        className="w-full h-full object-contain mx-auto my-auto"
                        style={{ position: 'relative', zIndex: 1, opacity: 0.85, display: 'block' }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <style>{`
                      @media (max-width: 1023px) {
                        .hero-img-mobile-size {
                          width: 100%;
                          max-width: 400px;
                          margin-left: auto;
                          margin-right: auto;
                          aspect-ratio: 1/1;
                        }
                      }
                    `}</style>
                  </div>
                </div>
                {/* End mobile image */}
                <div className="mt-0 lg:mt-0" style={{ marginTop: 0 }}>
                  {/* Mobile only: add 1rem margin above this block */}
                  <style>{`
                    @media (max-width: 1023px) {
                      .mobile-hero-below-img { margin-top: 1rem !important; }
                    }
                  `}</style>
                  <div className="mobile-hero-below-img">
                    <h2 className="mbg-heading-lg scroll-slide-left scroll-delay-300 text-gray-900 dark:text-white"
                      style={{ fontSize: `calc(2.2rem * 1.05)`, wordSpacing: '0em', marginTop: '0rem', textAlign: 'left' }}
                    >
                      Unlock Your Health
                    </h2>
                    <hr style={{ border: 'none', borderTop: '2px solid #C3998F', margin: '1.2rem 0 0.7rem 0', width: '180px' }} />
                    <div style={{ textAlign: 'left', fontWeight: 700, color: '#C3998F', fontSize: '1.90rem', margin: '0.5rem 0 0.5rem 0' }}>
                      with Dr. Feq'ad Wolde
                    </div>
                    <p className="mbg-text-lg text-gray-600 dark:text-gray-200 leading-relaxed scroll-fade-in scroll-delay-400"
                      style={{ fontSize: '1.15rem', wordSpacing: '0em', marginTop: '1.0rem', textAlign: 'left' }}
                    >
                       <span className="text-green-700 dark:text-green-300 font-medium">Culturally-rooted methodologies</span> and <span className="text-green-700 dark:text-green-300 font-medium">personalized transformation</span> for mind, body, and spirit, crafted for today's world. Discover the art of <span className="text-green-700 dark:text-green-300 font-medium">integrative healing</span>.
                    </p>
                    <div className="flex items-center gap-4 scroll-scale scroll-delay-500" style={{ marginTop: '1.5rem' }}>
                      <button
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl floating-hover-btn focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 focus-visible:ring-opacity-70 min-h-[40px] min-w-[40px]"
                      onClick={() => {
                          const element = document.getElementById('wellness-programs-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        tabIndex={0}
                        aria-label="Scroll to Healing Services section"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span>Begin Your Journey</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4" style={{ marginTop: '.5rem' }}>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span>Integrative Healing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span>Ancestral Science</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span>Personalized Renewal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Desktop only: show image in right column */}
              <div className="hidden lg:block lg:order-2">
                <div
                  className="relative scroll-slide-right scroll-delay-400 hero-img-col"
                >
                  <style>{`
                    @media (max-width: 1023px) {
                      .hero-img-col { margin-top: 0 !important; }
                    }
                    @media (min-width: 1024px) {
                      .hero-img-col { margin-top: 4.8rem !important; }
                    }
                  `}</style>
                  <div
                    className="aspect-[1/1] overflow-hidden rounded-2xl shadow-2xl scroll-scale scroll-delay-500 relative"
                    style={{ position: 'relative' }}
                  >
                    {/* Background image behind Welcome image */}
                    <img
                      src="/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp"
                      alt="Background Scenic Jamaica"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      style={{ opacity: 1 }}
                      loading="lazy"
                      decoding="async"
                      aria-hidden="true"
                    />
                    <img
                      src="/images - Copy/Site Files/For Course_edited_edited.webp"
                      alt="Dr. Feqad Wolde - Traditional Jamaica Healer"
                      className="w-full h-full object-contain mx-auto my-auto relative z-10"
                      style={{ opacity: 0.85, display: 'block' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Main Content - Theme Aware */}
        <div className="mbg-section mbg-bg-white" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '0rem', // negative margin to pull section up
          paddingTop: '4rem',
        }}>
          {/* Comprehensive Packages Section - MindBodyGreen Style */}
          <section id="wellness-programs-section" className="mbg-section scroll-fade-in" style={{marginTop: 0, paddingTop: 0}}>
            <div className="mbg-container" style={{marginTop: 0, paddingTop: 0}}>              <div className="text-center mb-4 scroll-slide-up">
                <div className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600">
                  Wellness Programs
                </div><h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-green-100" style={{ fontFamily: 'Georgia, serif' }}>Wellness Renewal Journey</h2>
                <p className="text-xl text-gray-600 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Experience profound transformation through our signature healing mastery programs, each designed as a complete journey to address the multiple dimensions of the living being. These comprehensive packages offer deep healing opportunities with exceptional value and lasting results for those seeking veracious transformation.
                </p>
              </div>
              {/* Wellness Programs Video */}
              <div className="mb-6 text-center" aria-label="Wellness Programs Video Section">
                <h2 className="text-2xl md:text-3xl font-semibold text-green-700 dark:text-green-400 mb-2" style={{ fontFamily: 'Georgia, serif' }} id="wellness-programs-video-heading">
                  Watch: Wellness Renewal in Action
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-200 mb-4 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  This short video offers a glimpse into the immersive, holistic experience that awaits you.
                </p>
                <div
                  className="relative rounded-3xl border-4 border-green-600 shadow-2xl overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900 dark:via-gray-900 dark:to-green-800 mb-12"
                  style={{ 
                    maxWidth: 720, 
                    margin: "2rem auto", 
                    boxShadow: '0 8px 32px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(16,185,129,0.12)' 
                  }}
                  aria-labelledby="wellness-programs-video-heading"
                >
                  <iframe
                    src="https://drive.google.com/file/d/1UIn7bb0EMK1uKQcqWQfkLIFUb_aXObCl/preview"
                    width="100%"
                    height="400"
                    allow="autoplay"
                    style={{
                      borderRadius: "1.5rem",
                      border: "none"
                    }}
                    title="Wellness Renewal Programs Video"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 blur-lg opacity-60 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">                {/* Soul Mastery Transformation Program */}
                <div className="mbg-card group scroll-scale scroll-delay-100 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Soul Intensive</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      6-WEEK TRANSFORMATION
                    </div>
                  </div>
                  <div className="space-y-6">                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      A focused 6-week journey blending ancient Jamaican healing and modern therapeutic practices. Release old patterns, reclaim your power, and awaken your highest spiritual potential through a guided, supportive process designed for deep soul renewal.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Initial soul assessment & energy mapping (90 min)",
                        "Past life regression & trauma clearing (2 sessions)",
                        "Ancestral healing & lineage restoration (90 min)",
                        "Energy restoration sessions (3 sessions)",
                        "Spiritual power reclamation ceremony (90 min)",
                        "Integration coaching & life alignment (2 sessions)",
                        "Custom herbal support protocol included",
                        "24/7 spiritual emergency support line",
                        "Post-program 3-month maintenance plan"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>                    <div className="mt-auto">
                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$2,500</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">6 Weeks • Complete Soul Transformation</div>
                        </div>
                      </div>
                      <BookingDialogNew 
                        serviceName="Soul Mastery Transformation Program"
                        serviceDuration="6-week intensive program"
                        servicePrice={2500}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>                {/* Premium Wellness Renewal */}
                <div className="mbg-card group relative scroll-scale scroll-delay-200 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  </div>                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Holistic Wellness</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      3-MONTH COMPREHENSIVE PROGRAM
                    </div>
                  </div>
                  <div className="space-y-6">                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      A complete 3-month program for total mind-body-spirit renewal. Integrating advanced healing, herbal medicine, and spiritual mentorship, this package supports physical vitality, emotional resilience, and conscious leadership. Ideal for those seeking sustainable transformation and peak performance.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Comprehensive health & energy assessment (2 hours)",
                        "Weekly premium energy restoration (12 sessions)",
                        "Bi-weekly premium spiritual mentorship (6 sessions)",
                        "Monthly master botanist consultations (3 sessions)",
                        "Chakra mastery & sound healing integration (4 sessions)",
                        "Stress mastery & peak performance protocols",
                        "Custom herbal formulations & tinctures",
                        "VIP 24/7 practitioner access & support",
                        "Quarterly wellness maintenance program",
                        "Premium retreat experience included"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>                    <div className="mt-auto">
                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$4,500</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">3 Months • Optimum Transformation</div>
                        </div>
                      </div>
                      <BookingDialogNew 
                        serviceName="Wellness Renewal Journey"
                        serviceDuration="3-month comprehensive program"
                        servicePrice={4500}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>                {/* Ancestral Healing Legacy Program */}
                <div className="mbg-card group scroll-scale scroll-delay-300 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Ancestral Healing</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      FAMILY & GENERATIONAL HEALING
                    </div>
                  </div>
                  <div className="space-y-6">                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      A unique family-centered program to heal generational patterns and restore harmony. Blending traditional Jamaican lineage work with modern family systems healing, this package offers a powerful path to resolve ancestral trauma and create lasting positive change for you and future generations.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Family lineage assessment & trauma mapping",
                        "Ancestral healing ceremonies (4 sessions)",
                        "Family member healing sessions (up to 4 people)",
                        "Generational pattern interruption work",
                        "Sacred family plant medicine protocols",
                        "Family unity & communication restoration",
                        "Legacy protection & spiritual strengthening",
                        "Family altar creation & maintenance training",
                        "Ongoing family support & guidance (6 months+)"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$3,400</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">Family Program • Generational Healing</div>
                        </div>
                      </div>
                      <BookingDialogNew 
                        serviceName="Ancestral Healing Legacy Program"
                        serviceDuration="Family-based healing program"
                        servicePrice={3400}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Program Philosophy */}
              <div className="mt-16 text-center scroll-slide-up scroll-delay-400">
                {/* Philosophy box removed as requested */}
              </div>
              {/* Custom Program Option */}
              <div className="mt-8 text-center scroll-slide-up scroll-delay-500">
                <div className="bg-green-50 dark:bg-green-800 rounded-lg p-6 border border-green-300 dark:border-green-600 max-w-2xl mx-auto">
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                    Need a customized healing program? Contact us for bespoke wellness solutions designed specifically for your unique journey.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                      💳 Pay As You Go Available
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Can't afford the entire package? No problem! You can pay for each session individually as you go, making your healing journey more accessible and flexible.
                    </p>
                  </div>
                  <div className="mt-4">
                    <BookingDialogNew 
                      serviceName="Custom Program Consultation"
                      serviceDuration="Consultation"
                      servicePrice={0}
                      practitionerName="Feq'ad Wolde"
                      buttonClassName="bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
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
                    className="inline-flex items-center gap-2 bg-white text-green-600 border border-green-500 font-medium py-4 px-8 rounded-lg hover:bg-green-100 transition-colors duration-300 text-lg shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 focus-visible:ring-opacity-70 min-h-[48px] min-w-[48px]"
                    tabIndex={0}
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
            </div>
        </section>
        </div>
        <div className="mbg-section mbg-bg-white" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '-2.5rem', // negative margin to pull up Wellness Services
          paddingTop: '0',
        }}>
          {/* Core Services Section */}
          <section id="healing-services" className="mbg-section scroll-fade-in">
            <div className="mbg-container">              <div className="text-center mb-16 scroll-slide-up">
                <div className="inline-block px-6 py-3 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold mb-6 border border-green-300 dark:border-green-600">
                  Wellness Services
                </div><h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>Indigenous Healing</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Our holistic approach combines ancestral wisdom and modern wellness practices to create a personalized healing experience for mind, body, and spirit. Each session is designed to honor your unique journey while providing profound transformation.
                </p>
              </div>              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger scroll-fade-in scroll-delay-200">                {/* Premium Energy Restoration */}
                <div className="mbg-card group scroll-scale scroll-delay-100 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>7 Chakra Attunement</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      75 MINUTES • MASTER LEVEL
                    </div>
                  </div>
                  <div className="space-y-6">                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Experience deep energetic transformation through the 7 Chakra Attunement. This intensive session combines ancient healing techniques with advanced chakra work to clear blockages, activate your energy centers, and restore your natural vitality at the cellular level.
                    </p>                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Advanced chakra system assessment & deep clearing",
                        "Multi-dimensional chakra balancing & activation",
                        "Aura reconstruction & energetic protection",
                        "Ancestral trauma release & healing integration",
                        "Personalized energy maintenance protocol",
                        "14-day integration support included"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$285</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">75 Minutes • Master Level Attunement</div>
                        </div>
                      </div>
                      {/* Removed per-session pricing */}
                      <BookingDialogNew 
                        serviceName="7 Chakra Attunement"
                        serviceDuration="75 minutes"
                        servicePrice={285}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>                  {/* Spiritual Mentorship */}
                <div className="mbg-card group relative scroll-scale scroll-delay-200 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  </div>                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Spiritual Mentorship</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      90 MINUTES • LEADERSHIP MASTERY
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Elevate your leadership and life purpose through spiritual mentorship. This transformative session combines Indigenous Jamaican wisdom with modern success principles to unlock your highest potential and authentic power as a conscious leader.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Life purpose discovery & strategic alignment",
                        "Advanced spiritual practice development & mastery",
                        "Ancestral wisdom integration for modern leadership",
                        "Personal power reclamation & authentic authority",
                        "High-performance mindset cultivation",
                        "30-day personalized success protocol",
                        "VIP follow-up coaching session included"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>                    <div className="mt-auto">                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$395</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">90 Minutes • Leadership Development</div>
                        </div>
                      </div>
                      {/* Removed per-session pricing */}
                      <BookingDialogNew 
                        serviceName="Spiritual Mentorship"
                        serviceDuration="90 minutes"
                        servicePrice={395}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
                  {/* Master Botanist Consultation */}
                <div className="mbg-card group scroll-scale scroll-delay-300 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700">                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-3 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Botany Consultation</h3>
                    <div className="inline-block px-2 py-1 bg-green-800 text-green-300 rounded-full text-xs font-medium">
                      90 MINUTES • PLANT MASTERY
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Receive a comprehensive plant medicine consultation from a master botanist with 30+ years of traditional Jamaica herbal expertise. This intensive session creates your personalized healing protocol using rare, ethically-sourced botanical formulations.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {[
                        "Advanced holistic health assessment & analysis",
                        "Master-level personalized herbal protocol design",
                        "Rare plant medicine formulation & preparation",
                        "Traditional Jamaican preparation methods training",
                        "Comprehensive lifestyle integration guidance",
                        "Custom herbal blend creation included",
                        "3-month follow-up support & protocol adjustments"                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">                      <div className="bg-green-600 dark:bg-gradient-to-r dark:from-green-800 dark:to-emerald-800 rounded-lg p-4 mb-4 border border-green-500 dark:border-green-600">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>$325</div>
                          <div className="text-sm text-green-100 dark:text-gray-300 uppercase tracking-wider font-medium">90 Minutes • Master Plant Medicine</div>
                        </div>
                      </div>
                      {/* Removed per-session pricing */}
                      <BookingDialogNew 
                        serviceName="Master Botanist Consultation"
                        serviceDuration="90 minutes"
                        servicePrice={325}
                        practitionerName="Feq'ad Wolde"
                        buttonClassName="w-full bg-gray-600 text-white border border-green-500 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>              {/* Indigenous Healing Philosophy */}
              <div className="mt-16 text-center scroll-slide-up scroll-delay-400">
                <div className="bg-green-50 dark:bg-green-800 dark:bg-opacity-60 rounded-lg p-8 shadow-sm border border-green-300 dark:border-green-600 max-w-4xl mx-auto">
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    Our healing approach honors the profound mastery of Jamaica's most sacred Indigenous practices while delivering world-class transformation for discerning clients. Each session represents decades of expertise distilled into a personalized journey of authentic healing and conscious evolution.
                    <span className="text-green-600 dark:text-green-400 font-medium"> Experience the pinnacle of traditional healing artistry.</span>
                  </p>
                </div>
              </div>
            </div>
          </section>        </div>        {/* Booking Process Section - Theme Aware */}
  {/* Additional Services - Theme Aware */}
  {/* Credentials & About - Dark Mode */}
        <div className="bg-gray-800 text-white" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '0', // removed negative margin to eliminate gap
        }}>
          <section className="mbg-section scroll-fade-in scroll-stagger">
            <div className="mbg-container">              {/* Keyword Title */}
              <div className="text-center mb-8 scroll-fade-in">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-medium mb-6">
                  About
                </div>
              </div>
                <div className="text-center mb-16 scroll-slide-up">
                <h2 className="mbg-heading-lg mb-4 text-gray-900 dark:text-white">Meet Dr. Feqad Wolde (Darrian Williams)</h2>
                <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  With over 20 years dedicated to traditional Jamaican healing, Dr. Feqad bridges ancient wisdom 
                  with modern wellness approaches. His practice honors ancestral techniques while incorporating 
                  evidence-based methods to create truly integrated healing experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 scroll-stagger">                <div className="text-center scroll-fade-in scroll-scale">                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program.webp",
                      alt: "60-Hour Yin Yoga Teacher Training Certificate",
                      title: "Yin Yoga Teacher Training"
                    })}
                  >
                    <OptimizedImage 
                      src="/images - Copy/certifications/Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program.webp" 
                      alt="60-Hour Yin Yoga Teacher Training Certificate" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div><p className="text-sm text-gray-600 dark:text-gray-300">Yin Yoga Teacher</p>
                </div>                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/Darrian Williams's NLP Life Coach Certification-1.webp",
                      alt: "NLP Life Coach Certification",
                      title: "NLP Life Coach"
                    })}
                  >
                    <OptimizedImage 
                      src="/images - Copy/certifications/Darrian Williams's NLP Life Coach Certification-1.webp" 
                      alt="NLP Life Coach Certification" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">NLP Life Coach</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images/certifications/Reiki 1 2 Master Certificate - Darrian Ishmael Williams-3.webp",
                      alt: "Reiki Master Certificate",
                      title: "Reiki Master"
                    })}
                  >
                    <OptimizedImage 
                      src="/images - Copy/certifications/Reiki 1 2 Master Certificate - Darrian Ishmael Williams-3.webp" 
                      alt="Reiki Master Certificate" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reiki Master</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images/certifications/image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp",
                      alt: "Mental Health Certification",
                      title: "Mental Health"
                    })}
                  >
                    <OptimizedImage 
                      src="/images - Copy/certifications/image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp" 
                      alt="Mental Health Certification" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Mental Health</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images/certifications/image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp",
                      alt: "Meditation Teacher Certification",
                      title: "Meditation Teacher"
                    })}
                  >
                    <OptimizedImage 
                      src="/images - Copy/certifications/image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp" 
                      alt="Meditation Teacher Certification" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Meditation Teacher</p>
                </div>
              </div>                {/* Healing Testimonials Section */}
              <div className="mt-32 scroll-fade-in scroll-stagger" style={{marginTop: '9rem'}}>
                <div className="text-center mb-12 scroll-slide-up">
                  <h3 className="mbg-heading-lg text-gray-900 dark:text-white mb-4">Healing Testimonials</h3>
                  <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Real experiences from clients who have experienced Dr. Feqad's transformative healing work
                  </p>
                </div>
                  {/* Testimonials Slideshow */}
                <div className="relative max-w-4xl mx-auto mb-16">                  {/* Main Testimonial Card */}
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
                  </div>                  {/* Navigation Arrows */}
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
                  </button>{/* Dots Indicator */}
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
                  <div className="absolute top-4 right-6 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 text-white dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                    {currentTestimonialIndex + 1} / {testimonials.length}
                  </div>
                </div>                  <div className="text-center scroll-fade-in">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Ready to experience your own transformation?
                  </p>
                </div></div>
                <div className="text-center mt-6 scroll-fade-in" style={{ opacity: 1 }}>
                  <a 
                    href="https://www.linkedin.com/in/feqadwolde/" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Learn More About Dr. Feqad                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {/* Polaroid Collage beneath Testimonials section */}
                  <div className="mt-8 flex justify-center" style={{ marginBottom: '3rem' }}>
                    <div className="flex flex-row gap-6 justify-center items-end w-full max-w-4xl polaroid-collage-row" style={{ paddingBottom: '2.5rem' }}>
                      {[
                        {
                          src: '/images - Copy/Phone/IMG-20220104-WA0010.webp',
                          caption: 'Healing Session',
                        },
                        {
                          src: '/images - Copy/Phone/IMG-20220104-WA0012.webp',
                          caption: 'Client Reflection',
                        },
                        {
                          src: '/images - Copy/Phone/IMG-20220104-WA0013.webp',
                          caption: 'Energy Work',
                        },
                        {
                          src: '/images - Copy/Phone/IMG-20220104-WA0014.webp',
                          caption: 'Transformation',
                        },
                      ].map((img, idx) => (
                        <Dialog key={img.src}>
                          <DialogTrigger asChild>
                            <div
                              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col items-center px-2 pb-3 pt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
                              style={{
                                width: '140px',
                                minHeight: '180px',
                                transform: `rotate(${idx % 2 === 0 ? -4 : 4}deg) scale(1)`,
                                boxShadow: '0 8px 24px rgba(34,197,94,0.10)',
                                marginBottom: idx % 2 === 0 ? '0px' : '16px',
                              }}
                            >
                              <img
                                src={img.src}
                                alt={img.caption}
                                className="polaroid-collage-img"
                                style={{
                                  width: '120px',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 2px 8px rgba(34,197,94,0.12)',
                                  marginBottom: '0.5rem',
                                  background: '#f8fafc',
                                }}
                              />
                              <div
                                className="text-xs text-gray-700 dark:text-gray-200 font-semibold text-center"
                                style={{
                                  fontFamily: 'Georgia, serif',
                                  marginTop: '0.25rem',
                                  letterSpacing: '0.02em',
                                }}
                              >
                                {img.caption}
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent
                            className="mbg-card"
                            style={{
                              padding: 0,
                              background: 'var(--mbg-white)',
                              border: 'none',
                              maxWidth: 'none',
                              maxHeight: 'none',
                              width: '100vw',
                              height: '100vh',
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 9999,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              transform: 'none',
                            }}
                          >
                            <DialogClose asChild>
                              <button className="dialog-x-desktop" aria-label="Close" style={{position:'fixed',right:'1.5rem',top:'1.5rem',zIndex:100,background:'white',border:'2px solid #C3998F',borderRadius:'50%',padding:'0.5rem',boxShadow:'0 2px 8px rgba(34,197,94,0.10)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <Cross2Icon className="h-5 w-5" />
                              </button>
                            </DialogClose>
                            <ZoomableImage
                              src={img.src}
                              alt={`${img.caption} - Enlarged View`}
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                  {/* Mobile-only: Shorten polaroid images at the bottom */}
                  <style>{`
                    @media (max-width: 767px) {
                        .polaroid-collage-row {
                          flex-direction: column !important;
                          align-items: center !important;
                          gap: 1.5rem !important;
                        }
                        .polaroid-collage-img {
                          height: 80px !important;
                          min-height: 80px !important;
                          max-height: 80px !important;
                          width: 100px !important;
                          min-width: 100px !important;
                          max-width: 100px !important;
                        }
                        .polaroid-collage-row > div {
                          min-height: 120px !important;
                          max-height: 140px !important;
                        }
                    }
                  `}</style>
                </div>
            </div>
          </section>
        </div>

        {/* Join us in Jamaica - Theme Aware */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-24" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '-5.5rem', // negative margin to bring closer to testimonials
          paddingTop: '0',
        }}>
          <section className="mbg-section scroll-fade-in scroll-stagger">
            <div className="mbg-container">
              {/* Keyword Title */}
              <div className="text-center mb-8 scroll-fade-in">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-medium mb-6">
                  Join us in Jamaica
                </div>
              </div>
              <div className="text-center mb-16 scroll-slide-up">
                <h2 className="mbg-heading-lg mb-4 text-gray-900 dark:text-white">Retreat Tours in Jamaica</h2>
                <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Experience the heart of Jamaica with our family-led Retreat Tours. Immerse yourself in vibrant culture, breathtaking nature, and authentic healing practices. Our tours offer a unique blend of adventure, wellness, and personal connection. Explore hidden gems, enjoy ital meals, and discover the island's spiritual wisdom. Join us for a transformative journey in paradise!
                </p>
              </div>
              
              <div className="flex justify-center scroll-stagger">
                <div className="mbg-card scroll-fade-in scroll-scale bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 max-w-3xl w-full mx-auto px-12 py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-green-300 flex-shrink-0 text-2xl font-bold">
                      🌴
                    </div>
                    <div>
                      <h3 className="mbg-heading-md mb-2 text-gray-900 dark:text-white">Join us in Jamaica</h3>
                      <p className="mbg-text-base text-gray-600 dark:text-gray-300 mb-2">
                        Ready for a life-changing adventure? Our Retreat Tours are your invitation to experience Jamaica like family. Connect with the land, the people, and yourself, guided by those who call the island home. <br/><br/>
                        <strong>• Family-led journeys</strong> <br/>
                        <strong>• Hidden gems & healing destinations</strong> <br/>
                        <strong>• Ital meals, teas, and spiritual practices</strong> <br/>
                        <strong>• Real connection, real transformation</strong>
                      </p>
                      <a href="/retreat-tours-workshops" className="text-green-500 hover:text-green-400 font-semibold text-base transition-colors duration-200">
                        Discover Retreat Tours →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Disclaimer Section - Theme Aware */}
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mb-24" style={{
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          marginTop: '-1rem', // move up by 1rem
        }}>
          <section className="mbg-section scroll-fade-in">
            <div className="mbg-container">
              <div className="text-center space-y-6 scroll-slide-up">                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Important Disclaimer</h3>
                  <div className="max-w-4xl mx-auto text-sm text-gray-700 dark:text-gray-200 leading-relaxed space-y-4">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      "I am a bush doctor who traditionally uses the title Dr."
                    </p>
                    
                    <div className="text-left space-y-3">
                      <p>
                        <strong>Professional Status:</strong> The title "Dr." as used by Feqad Wolde refers to traditional healing practices and bush medicine knowledge passed down through ancestral traditions. This title does not indicate a medical degree from an accredited medical institution or authorization to practice conventional medicine.
                      </p>
                      
                      <p>
                        <strong>Services Provided:</strong> All services offered including but not limited to chakra attunement, Reiki healing, sound baths, guided meditation, NLP hypnotherapy, tarot readings, and traditional healing practices are considered complementary and alternative wellness services. These services are not intended to diagnose, treat, cure, or prevent any medical condition or disease.
                      </p>
                      
                      <p>
                        <strong>Medical Advice Disclaimer:</strong> The information and services provided do not constitute medical advice and should not be used as a substitute for professional medical consultation, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
                      </p>
                      
                      <p>
                        <strong>No Medical Claims:</strong> No guarantees, warranties, or assurances of any kind are made regarding the outcome of any session or service. Individual results may vary significantly. The effectiveness of alternative healing practices varies from person to person.
                      </p>
                      
                      <p>
                        <strong>Client Responsibility:</strong> Clients are responsible for their own health and wellbeing decisions. If you are currently under medical care or taking medication, please consult with your healthcare provider before participating in any alternative healing sessions.
                      </p>
                      
                      <p>
                        <strong>Testimonials Disclaimer:</strong> Client testimonials reflect individual experiences and results may not be typical. These testimonials are not intended to represent or guarantee that anyone will achieve the same or similar results.
                      </p>
                      
                      <p>
                        <strong>Regulatory Compliance:</strong> Services are provided for spiritual, educational, and entertainment purposes only. This practice operates in accordance with applicable local laws regarding alternative healing and wellness services.
                      </p>
                    </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-4 border-t border-gray-400 dark:border-gray-600">
                      By booking any service, you acknowledge that you have read, understood, and agree to this disclaimer. 
                      Last updated: {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @media (max-width: 767px) {
          #wellness-programs-section,
          #wellness-programs-section .mbg-container,
          #wellness-programs-section .grid,
          #wellness-programs-section [class*='grid'],
          #wellness-programs-section * {
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          #wellness-programs-section::-webkit-scrollbar,
          #wellness-programs-section .mbg-container::-webkit-scrollbar,
          #wellness-programs-section .grid::-webkit-scrollbar,
          #wellness-programs-section [class*='grid']::-webkit-scrollbar,
          #wellness-programs-section *::-webkit-scrollbar {
            display: none !important;
          }
          #healing-services,
          #healing-services .mbg-container,
          #healing-services .grid,
          #healing-services [class*='grid'],
          #healing-services * {
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          #healing-services::-webkit-scrollbar,
          #healing-services .mbg-container::-webkit-scrollbar,
          #healing-services .grid::-webkit-scrollbar,
          #healing-services [class*='grid']::-webkit-scrollbar,
          #healing-services *::-webkit-scrollbar {
            display: none !important;
          }
          /* Remove scroll bars from testimonials section on mobile */
          .bg-gray-800,
          .bg-gray-800 .mbg-container,
          .bg-gray-800 .mbg-section,
          .bg-gray-800 * {
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .bg-gray-800::-webkit-scrollbar,
          .bg-gray-800 .mbg-container::-webkit-scrollbar,
          .bg-gray-800 .mbg-section::-webkit-scrollbar,
          .bg-gray-800 *::-webkit-scrollbar {
            display: none !important;
          }
          /* Remove scroll bars from "Join Us in Jamaica" section on mobile */
          .bg-white.dark\\:bg-gray-800,
          .bg-white.dark\\:bg-gray-800 .mbg-container,
          .bg-white.dark\\:bg-gray-800 .mbg-section,
          .bg-white.dark\\:bg-gray-800 *,
          .bg-white.text-gray-900,
          .bg-white.text-gray-900 .mbg-container,
          .bg-white.text-gray-900 .mbg-section,
          .bg-white.text-gray-900 * {
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .bg-white.dark\\:bg-gray-800::-webkit-scrollbar,
          .bg-white.dark\\:bg-gray-800 .mbg-container::-webkit-scrollbar,
          .bg-white.dark\\:bg-gray-800 .mbg-section::-webkit-scrollbar,
          .bg-white.dark\\:bg-gray-800 *::-webkit-scrollbar,
          .bg-white.text-gray-900::-webkit-scrollbar,
          .bg-white.text-gray-900 .mbg-container::-webkit-scrollbar,
          .bg-white.text-gray-900 .mbg-section::-webkit-scrollbar,
          .bg-white.text-gray-900 *::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>

      {/* Certificate Popup Dialog */}
      {selectedCertificate && (
        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-gray-800 border-gray-600">
            <div className="flex flex-col items-center space-y-6 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedCertificate.title}
                </h3>
                <p className="text-gray-300">
                  Professional Certification
                </p>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded-lg shadow-lg p-4 w-full border border-gray-600">
                <OptimizedImage
                  src={selectedCertificate.src}
                  alt={selectedCertificate.alt}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              <div className="text-center max-w-md">
                <p className="text-gray-300 leading-relaxed">
                  This certification demonstrates Dr. Feqad Wolde's professional expertise and 
                  commitment to excellence in {selectedCertificate.title.toLowerCase()} practice.
                </p>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="mbg-btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-2"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      
    </>
  );
};

export default FeqadServicesPage;
