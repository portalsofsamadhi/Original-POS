import React from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { buildJourneyPhotoUrl, buildJourneyStoryUrl } from "../../../utils/mobileRoutes";

interface JourneyStoryOpenerProps {
  storyId: string;
  className?: string;
  children: React.ReactNode;
}

export const JourneyStoryOpener = ({
  storyId,
  className = "journey-experience-text",
  children,
}: JourneyStoryOpenerProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <button
      type="button"
      className={`${className} w-full text-left border-none bg-transparent p-0`}
      onClick={() => navigate(buildJourneyStoryUrl(storyId))}
    >
      {children}
    </button>
  );
};

interface JourneyPhotoOpenerProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  imageClassName?: string;
}

export const JourneyPhotoOpener = ({
  src,
  alt,
  className,
  style,
  imageClassName,
}: JourneyPhotoOpenerProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!isMobile) {
    return (
      <img
        src={src}
        alt={alt}
        className={imageClassName}
        style={style}
      />
    );
  }

  return (
    <button
      type="button"
      className={className ?? "border-none bg-transparent p-0 w-full"}
      onClick={() => navigate(buildJourneyPhotoUrl(src, alt))}
      aria-label={`View larger: ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className={imageClassName ?? "mobile-journey-image"}
        style={{
          maxWidth: "100%",
          width: "100%",
          maxHeight: 220,
          borderRadius: "1rem",
          boxShadow: "0 4px 16px rgba(195, 153, 143, 0.14)",
          objectFit: "cover",
          background: "#f8fafc",
          display: "block",
          ...style,
        }}
      />
    </button>
  );
};