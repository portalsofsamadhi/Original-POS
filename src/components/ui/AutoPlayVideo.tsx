import React, { useRef, useEffect, useState } from "react";

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({ src, poster, className = "", style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView && !isEnded) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, isEnded]);

  const handleEnded = () => {
    setIsEnded(true);
  };

  const handlePlay = () => {
    setIsEnded(false);
    const video = videoRef.current;
    if (video) {
      video.volume = 1.0;
    }
  };

  return (
    <div
      className={`relative rounded-3xl border-4 border-green-600 shadow-2xl overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900 dark:via-gray-900 dark:to-green-800 ${className}`}
      style={{ maxWidth: 720, margin: "2rem auto", ...style }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        onEnded={handleEnded}
        onPlay={handlePlay}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: "1.5rem",
          background: "#000",
          filter: "brightness(0.95) contrast(1.12) saturate(1.15)",
        }}
        preload="auto"
        controlsList="nodownload"
      />
      <div className="absolute top-2 right-2 z-10">
        {/* Modern border glow/fancy effect */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 blur-lg opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
};

export default AutoPlayVideo;
