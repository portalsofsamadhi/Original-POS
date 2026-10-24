import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import { EXCURSIONS } from "../data/excursions";
import "../styles/luxury-theme.css";

const ExperiencesPage: React.FC = () => {
  return (
    <>
      <SEO
        title={PAGE_SEO["/experiences"].title}
        description={PAGE_SEO["/experiences"].description}
        image={PAGE_SEO["/experiences"].image}
        imageAlt={PAGE_SEO["/experiences"].imageAlt}
        url="/experiences"
        keywords={PAGE_SEO["/experiences"].keywords}
      />

      <div className="luxury-page">
        <PageHeader
          variant="tours"
          eyebrow="Excursions"
          title="Farms, sights, or your three cities"
          description="Three excursions. Each one says where you go, what the day includes, and what to tell us. We confirm the plan and the price by email."
          actions={
            <a href="#packages" className="luxury-btn luxury-btn--gold">
              See the three
              <ArrowRight size={14} />
            </a>
          }
          meta={
            <>
              <span>
                <MapPin size={14} /> Jamaica
              </span>
              <span>
                <Users size={14} /> Small groups
              </span>
              <span>
                <Calendar size={14} /> Date confirmed by email
              </span>
            </>
          }
        />

        <div className="luxury-page-body" id="packages">
          <section className="luxury-section" style={{ paddingTop: "2.5rem", paddingBottom: "1rem" }}>
            <div className="luxury-section__header" style={{ marginBottom: "1.75rem" }}>
              <p className="luxury-hero__eyebrow">Three excursions</p>
              <h2 className="luxury-section__title">
                Choose the <em>Excursion</em>
              </h2>
            </div>

            <div className="luxury-exp-grid">
              {EXCURSIONS.map((excursion) => (
                <article className="luxury-exp-card" id={excursion.id} key={excursion.id}>
                  <span className="luxury-exp-card__badge">{excursion.badge}</span>
                  <h3 className="luxury-exp-card__title">{excursion.title}</h3>
                  <p className="luxury-exp-card__desc">{excursion.summary}</p>
                  <p className="luxury-exp-card__meta">{excursion.meta}</p>
                  <ul className="luxury-exp-card__list">
                    {excursion.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="luxury-exp-card__bring">{excursion.bring}</p>
                  <div className="luxury-exp-card__actions">
                    <Link
                      to={`/book-now?excursion=${excursion.id}`}
                      className="luxury-btn luxury-btn--gold"
                    >
                      Plan this excursion
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ConversionClose variant="tours" />
        </div>
      </div>
    </>
  );
};

export default ExperiencesPage;
