import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import "../styles/samadhi-mobile-pages.css";

const JourneyPhotoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const src = searchParams.get("src") ?? "";
  const alt = searchParams.get("alt") ?? "Journey photo";

  return (
    <>
      <SEO
        title="Journey Photo | Samadhi Productions"
        description="Journey timeline photo from Portals of Samadhi."
        url="/about/journey/photo"
        noindex
      />
      <div className="samadhi-mobile-page samadhi-mobile-page--media">
        <button
          type="button"
          className="samadhi-mobile-page__back samadhi-mobile-page__back--overlay"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>
        {src ? (
          <img src={src} alt={alt} className="samadhi-mobile-page__photo" />
        ) : (
          <p className="samadhi-mobile-page__empty">Image unavailable.</p>
        )}
        {alt && <p className="samadhi-mobile-page__caption">{alt}</p>}
      </div>
    </>
  );
};

export default JourneyPhotoPage;