import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import { CINEMATIC_SHORTS } from "../data/cinematicShorts";
import "../styles/samadhi-mobile-pages.css";
import "../styles/hero-samadhi.css";

const ShortPreviewPage = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const short = CINEMATIC_SHORTS.find((item) => item.id === shortId);

  if (!short) {
    return (
      <div className="samadhi-mobile-page">
        <div className="samadhi-mobile-page__inner">
          <h1 className="samadhi-mobile-page__title">Preview not found</h1>
          <button type="button" className="samadhi-mobile-page__back" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${short.title} | Cinematic Short | Samadhi Productions`}
        description={`Watch ${short.title}, a cinematic short from Samadhi Productions.`}
        url={`/preview/${short.id}`}
        noindex
      />
      <div className="samadhi-mobile-page samadhi-mobile-page--player">
        <button
          type="button"
          className="samadhi-mobile-page__back samadhi-mobile-page__back--overlay"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="samadhi-mobile-page__player-wrap">
          <video
            className="samadhi-reel-video samadhi-reel-video--portrait samadhi-mobile-page__video"
            src={short.src}
            poster={`${short.poster}?v=2`}
            controls
            playsInline
            autoPlay
          />
          <p className="samadhi-mobile-page__caption">{short.title}</p>
        </div>
      </div>
    </>
  );
};

export default ShortPreviewPage;