import { useState } from "react";
import { Play } from "lucide-react";
import type { ProductionProof } from "../../data/productionSales";

interface ProductionProofPlayerProps {
  items: ProductionProof[];
}

const ProductionProofPlayer = ({ items }: ProductionProofPlayerProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) return null;

  const isPortrait = active.format === "short-form";

  return (
    <div className="samadhi-prod-proof-shell">
      <div className="samadhi-prod-proof-layout">
        <div
          className={`samadhi-prod-proof-player${
            isPortrait ? " samadhi-prod-proof-player--portrait" : ""
          }`}
        >
          {active.youtubeId ? (
            <iframe
              key={active.youtubeId}
              src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
              title={active.title}
              className="samadhi-prod-proof-player__iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={active.id}
              className="samadhi-prod-proof-player__video"
              src={active.videoSrc}
              poster={active.poster}
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>

        <div className="samadhi-prod-proof-picker" role="tablist" aria-label="Portfolio samples">
          {items.map((item) => {
            const isActive = item.id === active.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`samadhi-prod-proof-picker__item${
                  isActive ? " samadhi-prod-proof-picker__item--active" : ""
                }`}
                onClick={() => setActiveId(item.id)}
              >
                <span className="samadhi-prod-proof-picker__thumb-wrap">
                  <img
                    src={
                      item.poster ??
                      `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
                    }
                    alt={`${item.title} selected work thumbnail`}
                    className="samadhi-prod-proof-picker__thumb"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="samadhi-prod-proof-picker__play" aria-hidden="true">
                    <Play size={10} fill="currentColor" />
                  </span>
                </span>
                <span className="samadhi-prod-proof-picker__copy">
                  <span className="samadhi-prod-proof-picker__title">{item.title}</span>
                  <span className="samadhi-prod-proof-picker__meta">
                    {item.format === "mid-form" ? "Mid-form" : "Short-form"} · {item.duration}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="samadhi-prod-proof-context">
        <p className="samadhi-prod-proof-context__deliverable">{active.deliverable}</p>
        <p className="samadhi-prod-proof-context__fit">{active.buyerFit}</p>
      </div>
    </div>
  );
};

export default ProductionProofPlayer;