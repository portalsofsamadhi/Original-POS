import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import { fullStories } from "../components/home/about/journeyStories";
import "../styles/samadhi-sections.css";
import "../styles/samadhi-mobile-pages.css";

const JourneyStoryPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const story = storyId ? fullStories[storyId] : null;

  if (!story) {
    return (
      <div className="samadhi-mobile-page">
        <div className="samadhi-mobile-page__inner">
          <p className="samadhi-mobile-page__eyebrow">Our Journey</p>
          <h1 className="samadhi-mobile-page__title">Story not found</h1>
          <Link to="/about" className="samadhi-mobile-page__back">
            <ArrowLeft size={16} /> Back to About
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${story.title} | Our Journey | Samadhi Productions`}
        description={story.content.slice(0, 155)}
        url={`/about/journey/${storyId}`}
        noindex
      />
      <div className="samadhi-mobile-page">
        <div className="samadhi-mobile-page__inner">
          <button
            type="button"
            className="samadhi-mobile-page__back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <p className="samadhi-mobile-page__eyebrow">Our Journey</p>
          <h1 className="samadhi-mobile-page__title">{story.title}</h1>
          <div className="samadhi-mobile-page__body">
            {story.content.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JourneyStoryPage;