import type { ReactNode } from "react";
import "../../styles/luxury-theme.css";

export type PageHeaderVariant =
  | "tours"
  | "events"
  | "courses"
  | "about"
  | "book"
  | "default";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  variant?: PageHeaderVariant;
  meta?: ReactNode;
  actions?: ReactNode;
}

/**
 * Interior page headers - cohesive with the homepage brand language,
 * but each variant has its own visual identity (not a full home hero clone).
 */
const PageHeader = ({
  eyebrow,
  title,
  description,
  variant = "default",
  meta,
  actions,
}: PageHeaderProps) => (
  <header
    className={`luxury-page-banner luxury-page-banner--${variant}`}
    aria-label="Page introduction"
  >
    <div className="luxury-page-banner__accent" aria-hidden="true" />
    <div className="luxury-page-banner__inner">
      {variant === "about" ? (
        <img
          src="/poslogo.webp"
          alt="Portals of Samadhi"
          className="luxury-page-banner__logo"
          width={120}
          height={120}
          decoding="async"
        />
      ) : null}
      <p className="luxury-hero__eyebrow">{eyebrow}</p>
      <h1 className="luxury-page-banner__title">{title}</h1>
      {description ? (
        <p className="luxury-page-banner__desc">{description}</p>
      ) : null}
      {actions ? <div className="luxury-hero__actions luxury-page-banner__actions">{actions}</div> : null}
      {meta ? <div className="luxury-page-banner__meta">{meta}</div> : null}
    </div>
  </header>
);

export default PageHeader;
