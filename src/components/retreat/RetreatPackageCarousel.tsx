import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  RETREAT_PACKAGES,
  RETREAT_PACKAGE_CATEGORIES,
  type RetreatPackage,
} from "../../data/retreatPackages";
import { HEALING_ARTS_CONTENT } from "../../data/healingArtsContent";
import "../../styles/samadhi-service-pages.css";

interface RetreatPackageCarouselProps {
  onSelectPackage?: (pkg: RetreatPackage) => void;
  selectedIds?: string[];
}

const CATEGORY_ORDER: Array<keyof typeof RETREAT_PACKAGE_CATEGORIES> = [
  "activities",
  "indigenous",
  "healing",
];

const CategoryCarousel = ({
  category,
  packages,
  onSelectPackage,
  selectedIds,
}: {
  category: keyof typeof RETREAT_PACKAGE_CATEGORIES;
  packages: RetreatPackage[];
  onSelectPackage?: (pkg: RetreatPackage) => void;
  selectedIds: string[];
}) => {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = useCallback((direction: "prev" | "next") => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(260, rail.clientWidth * 0.72);
    rail.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  }, []);

  return (
    <div className="samadhi-service-carousel" style={{ marginBottom: "2rem" }}>
      <div className="samadhi-service-carousel__head">
        <div className="samadhi-service-carousel__head-copy">
          <p
            className={`samadhi-service-carousel__label${
              category === "healing" ? " samadhi-service-carousel__label--title-case" : ""
            }`}
          >
            {category === "healing"
              ? HEALING_ARTS_CONTENT.title
              : RETREAT_PACKAGE_CATEGORIES[category]}
          </p>
          {category === "healing" && (
            <p className="samadhi-healing-arts__desc">{HEALING_ARTS_CONTENT.description}</p>
          )}
        </div>
        <div className="samadhi-service-carousel__nav">
          <button
            type="button"
            className="samadhi-service-carousel__nav-btn"
            onClick={() => scrollRail("prev")}
            aria-label={`Scroll ${RETREAT_PACKAGE_CATEGORIES[category]} left`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="samadhi-service-carousel__nav-btn"
            onClick={() => scrollRail("next")}
            aria-label={`Scroll ${RETREAT_PACKAGE_CATEGORIES[category]} right`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="samadhi-service-carousel__rail" ref={railRef} role="list">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    role="listitem"
                    className={`samadhi-service-card${
                      selectedIds.includes(pkg.id) ? " samadhi-service-card--selected" : ""
                    }`}
                    onClick={() => onSelectPackage?.(pkg)}
                    aria-label={`Select ${pkg.title}, ${pkg.price} dollars`}
                  >
                    <h3 className="samadhi-service-card__title">{pkg.title}</h3>
                    <p className="samadhi-service-card__summary">{pkg.summary}</p>
                    <span className="samadhi-service-card__price">
                      ${pkg.price.toLocaleString()}
                    </span>
                  </button>
                ))}
      </div>
    </div>
  );
};

const RetreatPackageCarousel = ({
  onSelectPackage,
  selectedIds = [],
}: RetreatPackageCarouselProps) => (
  <div id="premium-packages" className="samadhi-services-wrap" style={{ scrollMarginTop: "72px" }}>
    <div
      className="mbg-container scroll-stagger"
      style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}
    >
      <p className="samadhi-section__eyebrow scroll-fade-in">Retreat Activities</p>
      <h2 className="samadhi-services-layout__title scroll-fade-in scroll-slide-up">
        Premium Service Packages
      </h2>
      <p className="samadhi-services-layout__desc scroll-fade-in" style={{ marginBottom: "1.5rem" }}>
        Curated retreat activities across nature, indigenous wisdom, and healing arts.
        Browse the carousel and tap a card to add it to your retreat plan.
      </p>

      {CATEGORY_ORDER.map((category) => {
        const packages = RETREAT_PACKAGES.filter((p) => p.category === category);
        if (packages.length === 0) return null;
        return (
          <CategoryCarousel
            key={category}
            category={category}
            packages={packages}
            onSelectPackage={onSelectPackage}
            selectedIds={selectedIds}
          />
        );
      })}
    </div>
  </div>
);

export default RetreatPackageCarousel;