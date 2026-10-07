import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import BookingDialogNew from '../components/booking/BookingDialogNew';
import OptimizedImage from '../components/ui/OptimizedImage';
import { Dialog, DialogContent } from '../components/ui/dialog';

import '../styles/mbg-aesthetics.css';
// --- MOBILE BOOK NOW MODAL ADJUSTMENTS ---
// To adjust the mobile modal size or style, edit the .mobile-booknow-modal class in src/styles/mobile-booknow-modal.css
import '../styles/mobile-booknow-modal.css';
// Example usage: <BookingDialogNew ... dialogClassName="mobile-booknow-modal" />
// This keeps all mobile modal tweaks in one place for easy maintenance.

// Testimonials array (top-level, outside of any JSX/component)
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
    id: 8,
    name: "Vidhya Shanker, PhD",
    service: "Evaluation Scholar, Practitioner & Activist",
    details: "Client",
    location: "January 2023",
    quote: "Mesq'al brings a calm energy to business relationships and takes the time to understand what I'm trying to accomplish. She completed an extensive project for me on time and with great quality. She was communicative throughout the process and I felt very supported. I would definitely work with her again!",
    initial: "VS"
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
    id: 10,
    name: "Jenny Wong",
    service: "Program Manager @ Renaissance",
    details: "Direct Manager",
    location: "November 2020",
    quote: "Mesq'al came with a different way of thinking and provided innovative ideas and solutions to organizational challenges. She consistently went above and beyond her duties, taking the lead on projects and managing a mini grants program. She revamped our center's social media and marketing efforts, creating visually appealing newsletters and increasing engagement. She was client-focused, patient and thorough. One client even sent her a thank you card for her help. I highly recommend Mesq'al.",
    initial: "JW"
  },
  {
    id: 7,
    name: "Stefan Antonsson",
    service: "Research Collaboration",
    details: "Senior Brand Manager Intern at P&G",
    location: "August 2023",
    quote: "Mesq'al was kind enough to share her time and expertise to support me during a pro-bono research project on grocery cooperatives. Her perspective on how to effectively operate and sustainably grow a cooperative grocery store was incredibly valuable for my team and the work we are doing. Mesq'al was engaging, articulate, and our pro-bono consultation really helped us make progress on the research - I would highly recommend working with her!",
    initial: "SA"
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
    id: 9,
    name: "Stacyann P. Russell",
    service: "Founder & CEO at The Daraja Collective, LLC",
    details: "Direct Manager",
    location: "February 2021",
    quote: "I had the pleasure of working with Mesq'al for about 8 months in 2020. She is highly organized, creative, and has a keen eye for design. She was able to manage multiple projects simultaneously while maintaining high quality standards. Her positive attitude and willingness to take on new challenges made her a valuable team member. I would not hesitate to work with her again.",
    initial: "SR"
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
    id: 6,
    name: "Roberto",
    service: "Magickal Healing Experience",
    details: "Client",
    location: "2021",
    quote: "This experience was amazing, every part of it. the magick and the power you get from this is simply majestic. thanks for opening my world to this extraordinary feeling.",
    initial: "R"
  },
  {
    id: 11,
    name: "Selah",
    service: "Freelance & Social Media Guidance",
    details: "Client",
    location: "2023",
    quote: "Portals of Samadhi!!!!! I would definitely recommend their services. They helped direct me to more freelance projects and helped me learn how to utilize my LinkedIn and Facebook accounts better. I definitely will need more help in the coming months.",
    initial: "S"
  }
];

const LifestyleShiftPage = () => {
  // Testimonial slider state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSlideShowPaused, setIsSlideShowPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // State for client logos modal
  const [selectedLogo, setSelectedLogo] = useState(null);
  
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

  // State for certificate modal
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextTestimonial();
    if (isRightSwipe) prevTestimonial();
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonialIndex(index);
  };

  const toggleSlideShowPause = () => {
    setIsSlideShowPaused(!isSlideShowPaused);
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (!isSlideShowPaused) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isSlideShowPaused, currentTestimonialIndex]);

  // Page-specific modal styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-snap-type: none;
        scroll-behavior: smooth;
      }
      
      section {
        scroll-snap-align: none;
      }

      @media (max-width: 1023px) {
        html, body, .mbg-section, .mbg-bg-white, .mbg-container, section, div {
          scroll-snap-type: none !important;
          scroll-behavior: auto !important;
          scroll-snap-align: none !important;
          min-height: unset !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }

        .mbg-section, div[style*="minHeight"], div[style*="scrollSnapAlign"] {
          min-height: unset !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }

        ::-webkit-scrollbar {
          display: none !important;
        }
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

      * { scroll-behavior: smooth; }

      @media (max-width: 1023px) {
        * { scroll-behavior: auto !important; }
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

      /* Modal specific styles */
      .dialog-content {
        max-height: 90vh !important;
        overflow-y: auto !important;
        width: 90vw !important;
        max-width: 600px !important;
        margin: auto !important;
        position: relative !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }

      @media (max-width: 768px) {
        .dialog-content {
          width: 95vw !important;
          max-width: 95vw !important;
          max-height: 85vh !important;
          padding: 1rem !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  // SEO Schema
  const _lifestyleShiftSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Lifestyle Shift - Integrated Wellness & Strategic Excellence',
    provider: {
      '@type': 'Organization',
      name: 'Portals of Samadhi',
      url: 'https://portalsofsamadhi.com'
    },
    description: 'Transform your life through our integrated approach combining traditional healing wisdom with strategic business excellence.',
    serviceType: 'Holistic Wellness & Strategic Consulting',
    areaServed: 'Worldwide',
    availableLanguage: 'English'
  };

  return (
    <>
      <SEO
        title="Lifestyle Shift | Integrated Holistic Healing & Strategic Business Excellence | Complete Life Transformation"
        description="Transform your entire lifestyle through our unique integrated approach combining authentic Jamaican healing wisdom with strategic business excellence. Comprehensive packages merging spiritual wellness, professional development, and life optimization for global entrepreneurs and wellness seekers."
        image="/lifestyle-shift-banner.jpg"
        imageAlt="Lifestyle Shift - Integrated Holistic Healing and Strategic Business Excellence"
        imageWidth={1200}
        imageHeight={630}
        url="/lifestyle-shift"
        keywords={[
          'lifestyle transformation integrated approach',
          'holistic healing business strategy combined',
          'spiritual wellness professional development',
          'complete life transformation program',
          'integrated healing business excellence',
          'holistic entrepreneur coaching program',
          'spiritual business development integration',
          'lifestyle shift healing strategy',
          'comprehensive wellness business program',
          'integrated approach lifestyle change',
          'holistic professional transformation',
          'spiritual entrepreneur development',
          'complete lifestyle optimization program',
          'integrated wellness business coaching',
          'holistic life business transformation',
          'spiritual professional excellence program',
          'lifestyle shift comprehensive package',
          'integrated healing strategic planning',
          'holistic entrepreneur life coaching',
          'complete transformation healing business',
          'spiritual wellness business integration',
          'lifestyle change professional development',
          'integrated approach wellness success',
          'holistic transformation business strategy',
          'complete life business optimization',
          'spiritual professional lifestyle shift',
          'integrated wellness strategic excellence',
          'holistic life professional transformation',
          'comprehensive lifestyle business program',
          'complete transformation integrated approach'
        ]}
        schemaType="Service"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'EducationalProgram',
          name: 'Lifestyle Shift - Integrated Transformation Program',
          description: 'Comprehensive lifestyle transformation program integrating authentic healing wisdom with strategic business excellence for complete life optimization.',
          provider: {
            '@type': 'Organization',
            name: 'Portals of Samadhi',
            description: 'Leading provider of integrated wellness and business transformation services worldwide.'
          },
          educationalProgramMode: ['Online', 'Virtual', 'In-Person'],
          programType: 'Lifestyle Transformation',
          teaches: [
            'Holistic Healing Integration',
            'Strategic Business Development', 
            'Spiritual Professional Excellence',
            'Complete Life Optimization',
            'Wellness Business Integration',
            'Personal Professional Transformation'
          ],
          audience: [
            { '@type': 'Audience', audienceType: 'Wellness Entrepreneurs' },
            { '@type': 'Audience', audienceType: 'Spiritual Professionals' },
            { '@type': 'Audience', audienceType: 'Holistic Practitioners' },
            { '@type': 'Audience', audienceType: 'Conscious Business Leaders' },
            { '@type': 'Audience', audienceType: 'Lifestyle Transformation Seekers' }
          ],
          offers: [
            {
              '@type': 'Offer',
              name: 'Foundation Package',
              description: 'Essential integration of healing and strategic planning for lifestyle transformation beginners'
            },
            {
              '@type': 'Offer',
              name: 'Professional Package', 
              description: 'Comprehensive healing and business development for established professionals seeking integration'
            },
            {
              '@type': 'Offer',
              name: 'Elite Package',
              description: 'Complete transformation program with intensive healing, strategic excellence, and ongoing support'
            }
          ],
          areaServed: [
            { '@type': 'Place', name: 'Global' },
            { '@type': 'Place', name: 'Worldwide Virtual Services' },
            { '@type': 'Place', name: 'Jamaica In-Person Options' }
          ]
        }}
        locale="en_US"
        siteName="Portals of Samadhi"
      />
      
      <div className="mbg-bg-white hero-mobile-top-fix" style={{
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
              min-height: unset !important;
              overflow: visible !important;
              scroll-snap-align: none !important;
              scroll-snap-stop: unset !important;
            }
          }
        `}</style>

        {/* Welcome Hero Section with Banner */}
        <style>{`
          @media (max-width: 1023px) {
            .welcome-hero-mobile-up {
              margin-top: -4rem !important;
            }
          }
        `}</style>
        <section
          className="mbg-section mbg-bg-white scroll-fade-in welcome-hero-mobile-up"
          style={{
            minHeight: window.innerWidth < 1024 ? 'auto' : '100vh',
            scrollSnapAlign: window.innerWidth < 1024 ? 'none' : 'start',
            scrollSnapStop: window.innerWidth < 1024 ? 'unset' : 'always',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 0,
            marginTop: 0
          }}
        >
          <div className="mbg-container w-full scroll-slide-up" style={{ marginTop: 0 }}>
            <div className="text-center space-y-8">
              <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl p-0 m-0" style={{background: 'none', boxShadow: 'none'}}>
                <img 
                  src="/images%20-%20Copy/Phone/Picsart_25-08-05_13-46-45-906.webp" 
                  alt="Lifestyle Shift - Integrated Wellness & Strategic Excellence" 
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '16/8', background: 'none', marginTop: '4rem' }}
                />
              </div>
              
              <div className="space-y-6 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-light text-green-700 dark:text-green-400" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Where Healing Wisdom Meets Strategic Excellence
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-200 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  Experience the unprecedented integration of Feq'ad's transformative healing arts with Mesq'al's strategic business excellence. This revolutionary approach addresses every dimension of your life: spiritual, physical, mental, and professional. Sustainable transformation that honors both your inner meditation and outer success.
                </p>
              </div>
            </div>
          </div>
        </section>

  {/* Path To Wholeness Section */}
        <div className="mbg-section mbg-bg-white" style={{
          paddingTop: '4rem',
          minHeight: 'unset',
          height: 'auto',
          overflow: 'visible',
        }}>
        <style>{`
          @media (max-width: 1023px) {
            .mbg-section, .mbg-bg-white, .mbg-container {
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;
              padding-top: 1.5rem !important;
            }
            .text-4xl, .md:text-5xl {
              font-size: 2rem !important;
            }
            .text-xl {
              font-size: 1rem !important;
            }
            .grid {
              gap: 1.25rem !important;
            }
            .mb-16 {
              margin-bottom: 2rem !important;
            }
            .rounded-lg {
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
          }
        `}</style>
          <style>{`
            @media (max-width: 1023px) {
              html, body, .mbg-section, .mbg-bg-white, .mbg-container, .grid, .mbg-content-fit, .mbg-services-grid, section, div {
                overflow: visible !important;
                max-height: none !important;
                min-height: unset !important;
                height: auto !important;
              }
              ::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                background: transparent !important;
              }
            }
          `}</style>
          <section id="integrated-packages" className="mbg-section scroll-fade-in" style={{ minHeight: 'unset', height: 'auto', overflow: 'visible' }}>
            <div className="mbg-container" style={{ minHeight: 'unset', height: 'auto', overflow: 'visible' }}>
              <div className="text-center mb-16 scroll-slide-up">
                <div className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600 mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Path To Wholeness
                </div>
                <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-green-100" style={{ fontFamily: 'Georgia, serif' }}>
                  The Synergy
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Experience the synergy of our practitioners' combined expertise. Each package seamlessly blends Indigenous healing methodology with strategic business insights, creating a holistic approach to personal and professional transformation.
                </p>
              </div>
              
              <div className="flex justify-center">
                {/* Ultimate Path to Wholeness Package */}
                <div className="mbg-card group relative scroll-scale scroll-delay-200 border-2 border-green-700 hover:border-green-600 transition-all duration-300 bg-white dark:bg-gray-700 max-w-2xl">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    
                  </div>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-green-300 mx-auto mb-4 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>The Complete Path to Wholeness</h3>
                    <div className="inline-block px-4 py-2 bg-green-800 text-green-300 rounded-full text-sm font-medium">
                      6 MONTH PROGRAM • TOTAL LIFE MASTERY
                    </div>
                  </div>
                  <div className="space-y-8">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                      The ultimate transformation experience combining every aspect of our expertise. This comprehensive 6-month journey integrates advanced spiritual mastery, strategic excellence, and holistic healing for complete life transformation.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Spiritual Mastery with Feq'ad</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          {[
                            "Advanced energy assessment & spiritual alignment (Monthly sessions)",
                            "Ancestral healing & lineage clearing (Bi-weekly sessions)",
                            "Soul purpose activation & spiritual leadership (Monthly sessions)",
                            "Custom herbal protocols & botanical medicine",
                            "Sacred plant ceremonies & rituals",
                            "Chakra balancing & energy optimization"
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Strategic Excellence with Mesq'al</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          {[
                            "Executive life planning & strategic visioning (Monthly sessions)",
                            "Business optimization & leadership coaching (Bi-weekly sessions)",
                            "Creative project completion & manifestation (Monthly sessions)",
                            "Personal brand & thought leadership development",
                            "Digital presence optimization & automation",
                            "Workflow mastery & productivity systems"
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-30 rounded-lg p-6 border border-green-200 dark:border-green-700">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>Exclusive Premium Benefits</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {[
                          "6-month VIP support program with unlimited email access",
                          "Bi-weekly integration calls throughout the program",
                          "Monthly intensive review sessions",
                          "Priority booking for all future services & retreats",
                          "Exclusive mastermind group with other Path to Wholeness clients",
                          "Custom resource library & personalized practices",
                          "Direct practitioner access via private messaging",
                          "Complimentary 3-month follow-up support after program completion",
                          "Remote service; however, you can come to us, or we can come to you. If you choose this option, you must provide accommodation, plane tickets, and partial food expenses for the practitioners.",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 mb-6 border border-green-500 dark:border-green-600 shadow-lg">
                        <div className="text-center">
                          <div className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>$4,999</div>
                          <div className="text-sm text-green-100 uppercase tracking-wider font-medium">6 Month Program • Complete Life Mastery</div>
                        </div>
                      </div>
                      <BookingDialogNew 
                        serviceName="The Complete Path to Wholeness"
                        serviceDuration="6 Month Program"
                        servicePrice={4999}
                        practitionerName="Feq'ad & Mesq'al"
                        buttonClassName="w-full bg-gray-700 text-white border border-green-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-base"
                        dialogClassName="mobile-booknow-modal"
                        forceMobileStandalone={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customized Healing Service Box with Pay as you go info */}
              <div className="mt-16 text-center scroll-slide-up scroll-delay-400">
                <div className="bg-green-50 dark:bg-green-800 dark:bg-opacity-60 rounded-lg p-8 shadow-sm border border-green-300 dark:border-green-600 max-w-4xl mx-auto">
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    Need a customized healing service? Contact us for bespoke wellness solutions designed specifically for your unique journey.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                      💳 Pay As You Go Available
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Can't afford the entire package? No problem! You can pay for each session individually as you go, making your transformation journey more accessible and flexible.
                    </p>
                  </div>
                  <div className="mt-4">
                    <BookingDialogNew 
                      serviceName="Custom Lifestyle Program Consultation"
                      serviceDuration="Consultation"
                      servicePrice={0}
                      practitionerName="Lifestyle Transformation Team"
                      buttonClassName="bg-gray-600 text-white border border-green-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300 text-base"
                      dialogClassName="mobile-booknow-modal"
                      forceMobileStandalone={true}
                      hideFullPackageTab={true}
                    />
                  </div>
                </div>
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

        {/* Past Clients & Collaborators Section */}
        <div className="mbg-section mbg-bg-white" style={{
          minHeight: window.innerWidth < 1024 ? 'auto' : '100vh',
          scrollSnapAlign: window.innerWidth < 1024 ? 'none' : 'start',
          scrollSnapStop: window.innerWidth < 1024 ? 'unset' : 'always',
          paddingTop: '0.0rem',
          marginTop: '-4rem'
        }}>
          <section 
            className="mbg-section scroll-fade-in"
            style={{
              marginTop: '0'
            }}
          >
            <div className="mbg-container">
              <div className="text-center space-y-12 scroll-slide-up">
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-medium mb-4 border border-green-300 dark:border-green-600">
                    Clientele
                  </div>
                
                  <div className="space-y-4">
                    <h2 className="mbg-heading-lg text-gray-900 dark:text-white">
                      Past Clients & Collaborators
                    </h2>
                    <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Trusted by leading organizations and innovative entrepreneurs
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center scroll-stagger scroll-scale scroll-delay-200">
                  {clientLogos.map((logo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-gray-300 dark:border-gray-600"
                      onClick={() => setSelectedLogo(logo)}
                    >
                      <OptimizedImage
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
        </div>

        {/* Meet Our Practitioners Section - Dr. Feqad */}
        <div className="bg-gray-800 text-white" style={{
          minHeight: window.innerWidth < 1024 ? 'auto' : '100vh',
          scrollSnapAlign: window.innerWidth < 1024 ? 'none' : 'start',
          scrollSnapStop: window.innerWidth < 1024 ? 'unset' : 'always',
          marginTop: '-5.5rem',
        }}>
          <section className="mbg-section scroll-fade-in scroll-stagger">
            <div className="mbg-container">
              <div className="text-center mb-8 scroll-fade-in">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 rounded-full text-sm font-medium mb-6">
                  Feq'ad's Certifications
                </div>
              </div>
              
              <div className="text-center mb-16 scroll-slide-up">
                <h2 className="mbg-heading-lg mb-4 text-gray-900 dark:text-white">Dr. Feq'ad Wolde (Darrian Williams)</h2>
                <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  With over 20 years dedicated to traditional Jamaican healing, Dr. Feqad bridges ancient wisdom 
                  with modern wellness approaches. His practice honors ancestral techniques while incorporating 
                  evidence-based methods to create truly integrated healing experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 scroll-stagger">
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program.webp",
                      alt: "Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program",
                      title: "Yin Yoga Teacher"
                    })}
                  >
                    <img 
                      src="/images - Copy/certifications/Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program.webp" 
                      alt="Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Yin Yoga Teacher</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/Darrian Williams's NLP Life Coach Certification-1.webp",
                      alt: "Darrian Williams's NLP Life Coach Certification",
                      title: "NLP Life Coach"
                    })}
                  >
                    <img 
                      src="/images - Copy/certifications/Darrian Williams's NLP Life Coach Certification-1.webp" 
                      alt="Darrian Williams's NLP Life Coach Certification" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">NLP Life Coach</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp",
                      alt: "image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp",
                      title: "Certification 3"
                    })}
                  >
                    <img 
                      src="/images - Copy/certifications/image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp" 
                      alt="image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.webp" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Certification 3</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp",
                      alt: "image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp",
                      title: "Certification 4"
                    })}
                  >
                    <img 
                      src="/images - Copy/certifications/image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp" 
                      alt="image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.webp" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Certification 4</p>
                </div>
                <div className="text-center scroll-fade-in scroll-scale">
                  <div 
                    className="w-full max-w-48 h-64 mx-auto mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 p-2 cursor-pointer border border-gray-300 dark:border-gray-600"
                    onClick={() => setSelectedCertificate({
                      src: "/images - Copy/certifications/Reiki 1 2 Master Certificate - Darrian Ishmael Williams-1.webp",
                      alt: "Reiki 1 2 Master Certificate - Darrian Ishmael Williams-1.webp",
                      title: "Reiki Master Certificate"
                    })}
                  >
                    <img 
                      src="/images - Copy/certifications/Reiki 1 2 Master Certificate - Darrian Ishmael Williams-1.webp" 
                      alt="Reiki 1 2 Master Certificate - Darrian Ishmael Williams-1.webp" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reiki Master Certificate</p>
                </div>
              </div>
              
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
                  Learn More About Dr. Feqad
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Combined Testimonials Section */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" style={{
          minHeight: window.innerWidth < 1024 ? 'auto' : '100vh',
          scrollSnapAlign: window.innerWidth < 1024 ? 'none' : 'start',
          scrollSnapStop: window.innerWidth < 1024 ? 'unset' : 'always',
          marginTop: '-4rem'
        }}>
          <section className="mbg-section scroll-fade-in">
            <div className="mbg-container">
              <div className="text-center space-y-12 scroll-slide-up">
                <div className="space-y-4">
                  <h2 className="mbg-heading-lg text-gray-900 dark:text-white text-center">
                    Client Transformations
                  </h2>
                  <p className="mbg-text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center">
                    Real experiences from clients who have experienced our integrated approach to transformation
                  </p>
                </div>
                
                <div className="relative max-w-4xl mx-auto mb-16">
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
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 transition-opacity duration-300">
                            {testimonials[currentTestimonialIndex].name}
                          </h4>
                          <div className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                            {testimonials[currentTestimonialIndex].service}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {testimonials[currentTestimonialIndex].details}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                            {testimonials[currentTestimonialIndex].location}
                          </div>
                        </div>
                        <blockquote className="text-gray-700 dark:text-gray-200 italic leading-relaxed text-lg transition-opacity duration-300">
                          "{testimonials[currentTestimonialIndex].quote}"
                        </blockquote>
                      </div>
                    </div>
                  </div>

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

                  <div className="mt-6 w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 h-1 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${((currentTestimonialIndex + 1) / testimonials.length) * 100}%` 
                      }}
                    ></div>
                  </div>

                  <div className="absolute top-4 right-6 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 text-white dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                    {currentTestimonialIndex + 1} / {testimonials.length}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
            <DialogContent className="dialog-content max-w-4xl bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex flex-col items-center space-y-6 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedCertificate.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Professional Certification
                  </p>
                </div>
                
                <div className="flex items-center justify-center w-full">
                  <OptimizedImage
                    src={selectedCertificate.src}
                    alt={selectedCertificate.alt}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
                
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-black dark:border-green-600 font-medium py-2 px-6 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Client Logo Popup Dialog */}
        {selectedLogo && (
          <Dialog open={!!selectedLogo} onOpenChange={() => setSelectedLogo(null)}>
            <DialogContent className="dialog-content max-w-2xl bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex flex-col items-center space-y-6 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedLogo.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Trusted Client & Collaborator
                  </p>
                </div>
                
                <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg w-full">
                  <OptimizedImage
                    src={selectedLogo.src}
                    alt={selectedLogo.alt}
                    className="max-h-48 w-auto object-contain"
                  />
                </div>
                
                <div className="text-center max-w-md">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    We've had the privilege of working with {selectedLogo.name} to provide 
                    professional virtual assistant services, helping them focus on their core 
                    mission while we handle the administrative details.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLogo(null)}
                  className="bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-black dark:border-green-600 font-medium py-2 px-6 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default LifestyleShiftPage;