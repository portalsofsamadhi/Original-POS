import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import "../styles/luxury-theme.css";

const AccommodationsPage = () => (
  <>
    <SEO
      title="Farm stays | Portals of Samadhi"
      description="Off-the-beaten-path farm stays with Portals of Samadhi are opening soon. Tours and getaway packages are ready now."
      url="/accommodations"
    />
    <div className="luxury-page">
      <PageHeader
        variant="book"
        eyebrow="Coming soon"
        title="Farm stays"
        description="Off-the-beaten-path farm stays are opening soon. Quiet, close to the land, and easy to settle into. Tours and sweet getaway packages are ready while you wait."
        actions={
          <>
            <Link to="/experiences" className="luxury-btn luxury-btn--gold">
              Explore Tours
              <ArrowRight size={14} />
            </Link>
            <Link to="/book-now" className="luxury-btn luxury-btn--outline">
              Book a session
            </Link>
          </>
        }
      />
    </div>
  </>
);

export default AccommodationsPage;
