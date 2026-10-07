import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const SplashScreen = ({ onFinished, duration = 2000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Start video playback when component mounts
    if (videoRef.current) {
      // Set playback quality to improve performance
      videoRef.current.playbackRate = 0.75; // Slightly slower for a more elegant effect
      
      // Start video 2 seconds ahead
      videoRef.current.currentTime = 2;
      
      // Handle video loaded
      videoRef.current.onloadeddata = () => {
        setIsVideoLoaded(true);
      };
      
      videoRef.current.play().catch(err => {
        console.error("Video playback failed:", err);
        // Set video loaded even if there's an error to show fallback
        setIsVideoLoaded(true);
      });
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinished, 500); // Allow exit animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-[9999] w-screen h-screen splash-no-scroll"
          style={{ overflow: 'hidden' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hide scrollbars for all browsers */}
          <style>{`
            .splash-no-scroll, .splash-no-scroll * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            .splash-no-scroll::-webkit-scrollbar, .splash-no-scroll *::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              background: transparent !important;
            }
          `}</style>
          {/* Video Background - Full page coverage */}
          <div className="fixed inset-0 w-screen h-screen video-container mobile-w-full mobile-h-full mobile-max-h-screen splash-no-scroll" style={{ overflow: 'hidden' }}>
            <motion.video
              ref={videoRef}
              className="video-background w-screen h-screen fullscreen-fixed object-cover mobile-w-full mobile-h-full mobile-max-h-screen splash-no-scroll"
              autoPlay
              muted
              loop
              playsInline
              poster="/Welcome.webp" // Fallback image while video loads
              initial={{ opacity: 0 }}
              animate={{ opacity: isVideoLoaded ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              style={{ overflow: 'hidden' }}
            >
              <source src="/videos/13279103_3840_2160_24fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>
            {/* Simple dark overlay without any green tint */}
            <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 mobile-w-full mobile-h-full mobile-max-h-screen splash-no-scroll" style={{ overflow: 'hidden' }}></div>
          </div>
          {/* Content */}
          <motion.div
            className="flex flex-col items-center relative z-10 splash-no-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.5
            }}
          >
            <motion.p
              className="text-[0.65rem] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-[#E8B4A3]/80 mb-4 text-center px-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Premium Cinematic Content
            </motion.p>
            <motion.img
              src="/samadhi-productions-logo.webp"
              alt="Samadhi Productions"
              className="w-48 h-48 object-contain mb-4"
              animate={{
                filter: [
                  "drop-shadow(0 0 24px rgba(195, 153, 143, 0.35))",
                  "drop-shadow(0 0 40px rgba(232, 180, 163, 0.5))",
                  "drop-shadow(0 0 24px rgba(195, 153, 143, 0.35))",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
            <motion.h1
              className="text-3xl md:text-4xl text-[#F5F0E8] font-display font-medium tracking-wide"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              Samadhi Productions
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base text-[#E8B4A3]/90 mt-3 text-center px-6 max-w-md font-display italic"
            >
              Thoughtful Media. Immersive Worlds.
            </motion.p>
            <motion.p
              className="text-xs text-[#F5F0E8]/45 mt-2 tracking-widest uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Portals of Samadhi
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
