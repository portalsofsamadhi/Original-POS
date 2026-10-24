import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import "../styles/luxury-theme.css";

type PlaceholderProps = {
  path: string;
  title: string;
  eyebrow: string;
  description: string;
  cta: string;
  to: string;
};

const ServicePlaceholderPage = ({ path, title, eyebrow, description, cta, to }: PlaceholderProps) => (
  <>
    <SEO title={`${title} | Portals of Samadhi`} description={description} url={path} />
    <div className="luxury-page">
      <PageHeader
        variant="tours"
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Link to={to} className="luxury-btn luxury-btn--gold">
            {cta}
            <ArrowRight size={14} />
          </Link>
        }
      />
    </div>
  </>
);

export const TransportationPage = () => (
  <ServicePlaceholderPage
    path="/transportation"
    title="Transportation"
    eyebrow="A familiar face when you land"
    description="Private rides from Sangster (MBJ) and Norman Manley (KIN). One-way from $95, with someone who knows your name waiting at the airport."
    cta="Book an Airport Transfer"
    to="/airport-transfers"
  />
);

export const ToursTravelPage = () => (
  <ServicePlaceholderPage
    path="/tours-travel"
    title="Tours & Travel"
    eyebrow="Excursions"
    description="Three excursions: Farms and Forests, a day at Jamaica's famous sights, or an itinerary for the three cities you choose."
    cta="Explore Tours"
    to="/experiences"
  />
);
