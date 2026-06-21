import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose
} from "../../ui/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "../../../styles/mbg-aesthetics.css";
import { fullStories } from "./journeyStories";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { buildJourneyPhotoUrl } from "../../../utils/mobileRoutes";
import { JourneyStoryOpener } from "./JourneyMobileHelpers";

interface JourneySectionProps {
  paddingTop?: string;
  marginTop?: string;
  className?: string;
}

const JourneySection: React.FC<JourneySectionProps> = ({ paddingTop = "2rem", marginTop = "5rem", className = "" }) => {
  const [openStory, setOpenStory] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const openPhoto = (src: string, alt: string) => {
    navigate(buildJourneyPhotoUrl(src, alt));
  };
  
  return (
    <>
      <style>
        {`
          .mobile-journey-image {
            display: none;
          }
          
          .desktop-journey-image {
            display: block;
          }
          
          @media (max-width: 768px) {
            .mobile-journey-image {
              display: block;
            }
            .desktop-journey-image {
              display: none;
            }
          }
          
          .journey-experience-text {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0.5rem;
            border-radius: 0.5rem;
          }
          
          .journey-experience-text:hover {
            box-shadow: 0 0 20px rgba(195, 153, 143, 0.45), 0 0 40px rgba(232, 180, 163, 0.28), 0 0 60px rgba(244, 201, 93, 0.12);
            transform: translateY(-2px);
            background: rgba(195, 153, 143, 0.06);
          }
          
          .journey-experience-text h3:hover {
            color: #C3998F !important;
            text-shadow: 0 0 12px rgba(232, 180, 163, 0.45);
          }
          
          .journey-experience-text p:hover {
            color: #E8B4A3 !important;
          }
          
          .journey-popup-content {
            background: white;
            border: 3px solid #C3998F;
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(195, 153, 143, 0.28);
            max-width: 800px;
            width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 2rem;
          }
          
          .journey-popup-content h2 {
            color: #C3998F;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            font-weight: bold;
          }
          
          .journey-popup-content p {
            line-height: 1.7;
            margin-bottom: 1.2rem;
            color: #374151;
          }
        `}
      </style>
      <section className={`mbg-section mbg-bg-white ${className}`} style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always', paddingTop, marginTop }}>
      <div className="mbg-container">
        <div className="mbg-text-center scroll-stagger" style={{ marginBottom: '1.5rem' }}>
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="mbg-keyword-title" style={{ fontSize: '1.5rem', color: 'var(--mbg-primary-green)' }}>Journey</div>
          </div>
          <h2 className="mbg-heading-xl">Our <span style={{ color: 'var(--mbg-primary-green)' }}>Journey</span></h2>
        </div>

        <div className="relative scroll-fade-in journey-timeline">
          {/* Timeline Line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-px journey-timeline-line"
            style={{ background: 'var(--mbg-primary-green)' }}
          ></div>

          {/* Timeline Items */}
          <div className="space-y-8 scroll-stagger journey-timeline__items">
            {/* 2017 - Ethiopia */}
            <div
              className="mbg-flex mbg-items-center justify-between relative scroll-slide-left journey-timeline-item"
              style={{ marginTop: 'calc(-1rem + 2rem)' }}
            >
              <div className="w-5/12 pr-4 text-right relative">
                {isMobile ? (
                  <JourneyStoryOpener storyId="2017">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                      2017 - The Beginning
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                      Founded as "Infinite Vortex of Light" 2 months before moving to Ethiopia, leaving behind the conventional western lifestyle, and embracing our destiny of holistic health and foundational wisdom.
                    </p>
                  </JourneyStoryOpener>
                ) : (
                <Dialog open={openStory === '2017'} onOpenChange={val => setOpenStory(val ? '2017' : null)}>
                  <DialogTrigger asChild>
                    <div className="journey-experience-text">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                        2017 - The Beginning
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                        Founded as "Infinite Vortex of Light" 2 months before moving to Ethiopia, leaving behind the conventional western lifestyle, and embracing our destiny of holistic health and foundational wisdom.
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="journey-popup-content">
                    <DialogHeader>
                      <DialogTitle style={{ textAlign: 'center', width: '100%', color: '#C3998F' }}>2017 - The Beginning : Infinite Vortex of Light</DialogTitle>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0 2rem 0' }}>
                        <img
                          src={"/images - Copy/Phone/DSC_0298_1.webp"}
                          alt="Feq'ad and Mesq'al in garden, Shashamane"
                          style={{
                            maxWidth: '480px',
                            width: '96%',
                            aspectRatio: '16/7',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                            marginBottom: '0.5rem',
                            objectFit: 'cover',
                            objectPosition: 'center 30%',
                            background: '#f8fafc',
                            display: 'block',
                          }}
                        />
                        <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                          Our first day in Ethiopia - Addis Ababa
                        </div>
                      </div>
                      <DialogDescription asChild>
                        <div>
                          {fullStories['2017'].content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0 0 0' }}>
                            <img
                              src={"/images - Copy/Phone/DSC_0062.webp"}
                              alt="Mesq'al picking flowers in yard - Shashamane"
                              style={{
                                maxWidth: '480px',
                                width: '96%',
                                aspectRatio: '16/7',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                                marginBottom: '0.5rem',
                                objectFit: 'cover',
                                objectPosition: 'center 10%', // move image up
                                background: '#f8fafc',
                                display: 'block',
                              }}
                            />
                            <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                              Mesq'al picking flowers in garden, Shashamane
                            </div>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                )}
                <div 
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full scroll-scale border-2 journey-timeline-dot"
                  style={{ 
                    background: 'var(--mbg-primary-green)',
                    borderColor: 'var(--mbg-white)'
                  }}
                />
              </div>
              <div className="w-5/12 pl-4 flex items-center justify-center">
                {isMobile ? (
                  <button
                    type="button"
                    className="border-none bg-transparent p-0"
                    onClick={() => openPhoto("/images - Copy/Phone/1st mobile.webp", "Feq'ad and Mesq'al in Ethiopia, 2017, early journey chapter")}
                    aria-label="View 2017 journey photo"
                  >
                    <img
                      className="mobile-journey-image"
                      src="/images - Copy/Phone/1st mobile.webp"
                      alt="Feq'ad and Mesq'al in Ethiopia, 2017, early journey chapter"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                        cursor: 'pointer',
                        objectFit: 'contain',
                        background: '#f8fafc'
                      }}
                    />
                  </button>
                ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <div style={{ position: 'relative' }}>
                      <img
                        className="desktop-journey-image"
                        src="/images - Copy/Phone/1st.webp"
                        alt="Feq'ad and Mesq'al in Ethiopia, 2017, early journey chapter"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
                      <img
                        className="mobile-journey-image"
                        src="/images - Copy/Phone/1st mobile.webp"
                        alt="Feq'ad and Mesq'al in Ethiopia, 2017, mobile view"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
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
                      <button
                        className="fixed right-4 top-4 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-samadhi-rose-gold/40 bg-samadhi-black/80 text-samadhi-rose-gold-light shadow-lg outline-none transition hover:bg-samadhi-charcoal hover:text-samadhi-cream dialog-close-btn"
                        aria-label="Close"
                      >
                        <Cross2Icon className="h-5 w-5" />
                      </button>
                    </DialogClose>
                    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={isMobile ? "/images - Copy/Phone/1st mobile.webp" : "/images - Copy/Phone/1st.webp"}
                        alt={isMobile ? "Feq'ad and Mesq'al in Ethiopia, 2017, enlarged mobile view" : "Feq'ad and Mesq'al in Ethiopia, 2017, enlarged view"}
                        style={{
                          maxWidth: '100vw',
                          maxHeight: '100vh',
                          objectFit: 'contain',
                          background: '#f8fafc',
                          borderRadius: 0,
                          display: 'block',
                          position: 'static',
                          filter: !isMobile ? 'contrast(1.10) brightness(0.92) saturate(1.18) drop-shadow(0 0 18px #C3998F)' : undefined
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                )}
              </div>
            </div>

            {/* 2019 - Gondar and Lalibela */}
            <div className="mbg-flex mbg-items-center justify-between relative scroll-slide-right journey-timeline-item" style={{ marginTop: '1rem' }}>
              <div className="w-5/12 pr-4 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <div style={{ position: 'relative' }}>
                      <img
                        className="desktop-journey-image"
                        src="/images - Copy/Phone/2nd.webp"
                        alt="Cultural immersion in Ethiopia, 2019"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
                      <img
                        className="mobile-journey-image"
                        src="/images - Copy/Phone/2nd mobile.webp"
                        alt="Cultural immersion in Ethiopia, 2019, mobile view"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
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
                      <button
                        className="fixed right-4 top-4 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-samadhi-rose-gold/40 bg-samadhi-black/80 text-samadhi-rose-gold-light shadow-lg outline-none transition hover:bg-samadhi-charcoal hover:text-samadhi-cream dialog-close-btn"
                        aria-label="Close"
                      >
                        <Cross2Icon className="h-5 w-5" />
                      </button>
                    </DialogClose>
                    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={isMobile ? "/images - Copy/Phone/2nd mobile.webp" : "/images - Copy/Phone/2nd.webp"}
                        alt={isMobile ? "Cultural immersion in Ethiopia, 2019, enlarged mobile view" : "Cultural immersion in Ethiopia, 2019, enlarged view"}
                        style={{
                          maxWidth: '100vw',
                          maxHeight: '100vh',
                          objectFit: 'contain',
                          background: '#f8fafc',
                          borderRadius: 0,
                          display: 'block',
                          position: 'static',
                          filter: !isMobile ? 'contrast(1.15) brightness(1.08) saturate(1.25) drop-shadow(0 0 18px #C3998F)' : undefined
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="w-5/12 pl-4 relative">
                {isMobile ? (
                  <JourneyStoryOpener storyId="2019">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                      2019 - Cultural Immersion
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                      Spent two transformative years in the historic cities of Addis Ababa, Gondar, Shashamane, and Lalibela, crafting exceptional travel experiences and extending admin services to local agencies.
                    </p>
                  </JourneyStoryOpener>
                ) : (
                <Dialog open={openStory === '2019'} onOpenChange={val => setOpenStory(val ? '2019' : null)}>
                  <DialogTrigger asChild>
                    <div className="journey-experience-text">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                        2019 - Cultural Immersion
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                        Spent two transformative years in the historic cities of Addis Ababa, Gondar, Shashamane, and Lalibela, crafting exceptional travel experiences and extending admin services to local agencies.
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="journey-popup-content">
                    <DialogHeader>
                      <DialogTitle style={{ textAlign: 'center', width: '100%', color: '#C3998F' }}>{fullStories['2019'].title}</DialogTitle>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0 2rem 0' }}>
                        <img
                          src={"/images - Copy/Phone/Restorative Yoga.webp"}
                          alt="Restorative Yoga, Lalibela"
                          style={{
                            maxWidth: '480px',
                            width: '96%',
                            aspectRatio: '16/7',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                            marginBottom: '0.5rem',
                            objectFit: 'cover',
                            background: '#f8fafc',
                            display: 'block',
                          }}
                        />
                        <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                          Restorative Yoga, Lalibela
                        </div>
                      </div>
                      <DialogDescription asChild>
                        <div>
                          {fullStories['2019'].content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0 0 0' }}>
                            <img
                              src={"/images - Copy/Phone/Feqad.webp"}
                              alt="Feq'ad high above Lalibela"
                              style={{
                                maxWidth: '480px',
                                width: '96%',
                                aspectRatio: '16/7',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                                marginBottom: '0.5rem',
                                objectFit: 'cover',
                                background: '#f8fafc',
                                display: 'block',
                              }}
                            />
                            <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                              Feq'ad high above Lalibela
                            </div>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                )}
                <div 
                  className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full scroll-scale border-2 journey-timeline-dot"
                  style={{ 
                    background: 'var(--mbg-primary-green)',
                    borderColor: 'var(--mbg-white)'
                  }}
                />
              </div>
            </div>

            {/* 2020 to 2023 - From the Bay to the Bay */}
            <div className="mbg-flex mbg-items-center justify-between relative scroll-slide-left journey-timeline-item" style={{ marginTop: '1rem' }}>
              <div className="w-5/12 pr-4 text-right relative">
                {isMobile ? (
                  <JourneyStoryOpener storyId="2021">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                      2020 to 2023 - From the Bay to the Bay
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                      Returned to the vibrant Bay Area, bringing our enriched perspective to the wellness community, holding wellness retreats, and offering personalized services.
                    </p>
                  </JourneyStoryOpener>
                ) : (
                <Dialog open={openStory === '2021'} onOpenChange={val => setOpenStory(val ? '2021' : null)}>
                  <DialogTrigger asChild>
                    <div className="journey-experience-text">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                        2020 to 2023 - From the Bay to the Bay
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                        Returned to the vibrant Bay Area, bringing our enriched perspective to the wellness community, holding wellness retreats, and offering personalized services.
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="journey-popup-content">
                    <DialogHeader>
                      <DialogTitle style={{ textAlign: 'center', width: '100%', color: '#C3998F' }}>{fullStories['2021'].title}</DialogTitle>
                      <DialogDescription asChild>
                        <div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0 2rem 0' }}>
                            <img
                              src={"/images - Copy/Phone/20200611_CesarChavez_trh_030_w.webp"}
                              alt="Feast of the Ancestors Retreat, Cesar Chavez Calendar - Berkeley, California"
                              style={{
                                maxWidth: '480px',
                                width: '96%',
                                aspectRatio: '16/7',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                                marginBottom: '0.5rem',
                                objectFit: 'cover',
                                objectPosition: 'center 10%', // move image up
                                background: '#f8fafc',
                                display: 'block',
                                marginTop: '24px', // add top margin
                              }}
                            />
                            <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                              Feast of the Ancestors Retreat, Cesar Chavez Calendar - Berkeley, California
                            </div>
                          </div>
                          {fullStories['2021'].content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0 0 0' }}>
                            <img
                              src={"/images - Copy/Phone/IMG_20240123_164838459.webp"}
                              alt="2021 - Planting tree's for our land in Jamaica with children."
                              style={{
                                maxWidth: '480px',
                                width: '96%',
                                aspectRatio: '16/7',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                                marginBottom: '0.5rem',
                                objectFit: 'cover',
                                background: '#f8fafc',
                                display: 'block',
                              }}
                            />
                            <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                              2021 - Planting tree's in Jamaica.
                            </div>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                )}
                <div 
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full scroll-scale border-2 journey-timeline-dot"
                  style={{ 
                    background: 'var(--mbg-primary-green)',
                    borderColor: 'var(--mbg-white)'
                  }}
                />
              </div>
              <div className="w-5/12 pl-4 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <div style={{ position: 'relative' }}>
                      <img
                        className="desktop-journey-image"
                        src="/images - Copy/Phone/3rd.webp"
                        alt="Return to the Bay Area, 2021, new chapter of the journey"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
                      <img
                        className="mobile-journey-image"
                        src="/images - Copy/Phone/3rd mobile.webp"
                        alt="Return to the Bay Area, 2021, mobile view"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
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
                      <button
                        className="fixed right-4 top-4 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-samadhi-rose-gold/40 bg-samadhi-black/80 text-samadhi-rose-gold-light shadow-lg outline-none transition hover:bg-samadhi-charcoal hover:text-samadhi-cream dialog-close-btn"
                        aria-label="Close"
                      >
                        <Cross2Icon className="h-5 w-5" />
                      </button>
                    </DialogClose>
                    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={isMobile ? "/images - Copy/Phone/3rd mobile.webp" : "/images - Copy/Phone/3rd.webp"}
                        alt={isMobile ? "Return to the Bay Area, 2021, enlarged mobile view" : "Return to the Bay Area, 2021, enlarged view"}
                        style={{
                          maxWidth: '100vw',
                          maxHeight: '100vh',
                          objectFit: 'contain',
                          background: '#f8fafc',
                          borderRadius: 0,
                          display: 'block',
                          position: 'static',
                          filter: !isMobile ? 'contrast(1.15) brightness(1.08) saturate(1.25) drop-shadow(0 0 18px #C3998F)' : undefined
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Jamaica */}
            <div className="mbg-flex mbg-items-center justify-between relative scroll-slide-right journey-timeline-item" style={{ marginTop: '-0.5rem' }}>
              <div className="w-5/12 pr-4 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <div style={{ position: 'relative' }}>
                      <img
                        className="desktop-journey-image"
                        src="/images - Copy/Phone/4th.webp"
                        alt="Present-day Jamaica, evolution of Portals of Samadhi"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
                      <img
                        className="mobile-journey-image"
                        src="/images - Copy/Phone/4th mobile.webp"
                        alt="Present-day Jamaica, evolution of Portals of Samadhi, mobile view"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 16px rgba(195, 153, 143, 0.14)',
                          cursor: 'pointer',
                          objectFit: 'contain',
                          background: '#f8fafc'
                        }}
                      />
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
                      <button
                        className="fixed right-4 top-4 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-samadhi-rose-gold/40 bg-samadhi-black/80 text-samadhi-rose-gold-light shadow-lg outline-none transition hover:bg-samadhi-charcoal hover:text-samadhi-cream dialog-close-btn"
                        aria-label="Close"
                      >
                        <Cross2Icon className="h-5 w-5" />
                      </button>
                    </DialogClose>
                    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={isMobile ? "/images - Copy/Phone/4th mobile.webp" : "/images - Copy/Phone/4th.webp"}
                        alt={isMobile ? "Present-day Jamaica, enlarged mobile view" : "Present-day Jamaica, enlarged view"}
                        style={{
                          maxWidth: '100vw',
                          maxHeight: '100vh',
                          objectFit: 'contain',
                          background: '#f8fafc',
                          borderRadius: 0,
                          display: 'block',
                          position: 'static',
                          filter: !isMobile ? 'contrast(1.15) brightness(1.08) saturate(1.25) drop-shadow(0 0 18px #C3998F)' : undefined
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="w-5/12 pl-4 relative">
                {isMobile ? (
                  <JourneyStoryOpener storyId="jamaica">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                      Present - Sanctuary, Studio & Soil
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                      Rooted in Jamaica, Samadhi Productions crafts cinematic worlds while Portals of Samadhi holds sanctuary for healing, retreat, and community.
                    </p>
                  </JourneyStoryOpener>
                ) : (
                <Dialog open={openStory === 'jamaica'} onOpenChange={val => setOpenStory(val ? 'jamaica' : null)}>
                  <DialogTrigger asChild>
                    <div className="journey-experience-text">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--mbg-charcoal)' }}>
                        Present - Sanctuary, Studio & Soil
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--mbg-dark-gray)' }}>
                        Rooted in Jamaica, Samadhi Productions crafts cinematic worlds while Portals of Samadhi holds sanctuary for healing, retreat, and community.
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="journey-popup-content">
                    <DialogHeader>
                      <DialogTitle style={{ textAlign: 'center', width: '100%', color: '#C3998F' }}>{fullStories['jamaica'].title}</DialogTitle>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0 2rem 0' }}>
                        <img
                          src={"/images - Copy/Phone/IMG_20250619_144257012_HDR.webp"}
                          alt="Rum Tour off the beatened path - St Catherine JA"
                          style={{
                            maxWidth: '480px',
                            width: '96%',
                            aspectRatio: '16/7',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                            marginBottom: '0.5rem',
                            objectFit: 'cover',
                            background: '#f8fafc',
                            display: 'block',
                          }}
                        />
                        <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                          Rum Tour off the beatened path, St Catherine JA
                        </div>
                      </div>
                      <DialogDescription asChild>
                        <div>
                          {fullStories['jamaica'].content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0 0 0' }}>
                            <img
                              src={"/images - Copy/Phone/IMG_20250619_155830778.webp"}
                              alt="Rum Tasting"
                              style={{
                                maxWidth: '480px',
                                width: '96%',
                                aspectRatio: '16/7',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 24px rgba(195, 153, 143, 0.2)',
                                marginBottom: '0.5rem',
                                objectFit: 'cover',
                                background: '#f8fafc',
                                display: 'block',
                              }}
                            />
                            <div style={{ fontWeight: 600, color: '#C3998F', fontSize: '1.1rem', marginTop: '0.2rem', textAlign: 'center' }}>
                              Rum Tasting
                            </div>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                )}
                <div 
                  className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full scroll-scale border-2 journey-timeline-dot"
                  style={{ 
                    background: 'var(--mbg-primary-green)',
                    borderColor: 'var(--mbg-white)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default JourneySection;
