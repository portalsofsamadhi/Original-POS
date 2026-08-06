import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Plane } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import {
  AIRPORT_LOCATIONS,
  AIRPORT_RUNS_INTRO,
  packagesForLocation,
  buildAirportBookParams,
  type AirportRunPackage,
} from "../data/airportRuns";
import "../styles/luxury-theme.css";

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Choose your airport",
    text: "Kingston (KIN) or Montego Bay (MBJ). Rates reflect distance from our Yallahs Bay, St. Thomas base.",
  },
  {
    n: "02",
    title: "Pick pickup, drop-off, or round-trip",
    text: "Round-trips include a built-in discount versus booking two one-ways.",
  },
  {
    n: "03",
    title: "Share flight details after booking",
    text: "We confirm timing and meet you with the same host care as our tours.",
  },
];

const AirportRunsPage: React.FC = () => {
  const navigate = useNavigate();

  const bookPackage = (pkg: AirportRunPackage) => {
    navigate(`/booking?${buildAirportBookParams(pkg).toString()}`);
  };

  return (
    <>
      <SEO
        title={PAGE_SEO["/airport-runs"].title}
        description={PAGE_SEO["/airport-runs"].description}
        image={PAGE_SEO["/airport-runs"].image}
        imageAlt={PAGE_SEO["/airport-runs"].imageAlt}
        url="/airport-runs"
        keywords={PAGE_SEO["/airport-runs"].keywords}
      />

      <div className="luxury-page">
        <PageHeader
          variant="tours"
          eyebrow="Portals of Samadhi · Airport Runs"
          title={
            <>
              Airport Runs That <em>Land Well</em>
            </>
          }
          description={AIRPORT_RUNS_INTRO}
          actions={
            <>
              <a href="#airport-packages" className="luxury-btn luxury-btn--gold">
                View runs
                <ArrowRight size={14} />
              </a>
              <Link to="/book-now" className="luxury-btn luxury-btn--outline">
                Talk with us first
              </Link>
            </>
          }
          meta={
            <>
              <span>
                <Plane size={14} /> KIN (Kingston) &amp; MBJ (Montego Bay)
              </span>
              <span>Based in Yallahs Bay, St. Thomas</span>
              <span>From $95 one-way at KIN</span>
            </>
          }
        />

        <div className="luxury-page-body">
          <section className="luxury-section" style={{ paddingTop: "2.5rem" }}>
            <div className="luxury-section__header">
              <p className="luxury-hero__eyebrow">Why book with us</p>
              <h2 className="luxury-section__title">
                Not a random cab. <em>A proper welcome.</em>
              </h2>
              <p className="luxury-section__lead">
                Airport Runs sit beside our tours and stays, the same family hosts, the same care.
                You are not shopping a generic transfer app. You are starting (or ending) a journey
                with people who will know your name when you land.
              </p>
            </div>

            <ol className="luxury-how__grid" style={{ marginBottom: "0.5rem" }}>
              {HOW_IT_WORKS.map((step) => (
                <li key={step.n} className="luxury-how__card">
                  <span className="luxury-how__num">{step.n}</span>
                  <h3 className="luxury-how__title">{step.title}</h3>
                  <p className="luxury-how__text">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section
            id="airport-packages"
            className="luxury-section"
            style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
            aria-label="Airport run packages by location"
          >
            <div className="luxury-section__header" style={{ marginBottom: "1.75rem" }}>
              <p className="luxury-hero__eyebrow">Packages by airport</p>
              <h2 className="luxury-section__title">
                Clear prices. <em>Easy to book.</em>
              </h2>
              <p className="luxury-section__lead">
                Choose the airport you fly into. Montego Bay rates are higher because of distance
                and fuel from our Yallahs Bay, St. Thomas base. Round-trips always cost less than
                two one-ways.
              </p>
            </div>

            {AIRPORT_LOCATIONS.map((loc) => (
              <div key={loc.id} style={{ marginBottom: "2.5rem" }}>
                <div className="luxury-section__header" style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                  <p className="luxury-hero__eyebrow">{loc.code}</p>
                  <h3 className="luxury-section__title" style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)" }}>
                    {loc.name}
                  </h3>
                  <p className="luxury-section__lead" style={{ maxWidth: "36rem", margin: "0.35rem 0 0" }}>
                    {loc.city}. {loc.note}
                  </p>
                </div>
                <div className="luxury-exp-grid">
                  {packagesForLocation(loc.id).map((pkg) => (
                    <article key={pkg.id} className="luxury-exp-card" id={pkg.id}>
                      {pkg.badge ? (
                        <span className="luxury-exp-card__badge">{pkg.badge}</span>
                      ) : (
                        <span className="luxury-exp-card__badge luxury-exp-card__badge--soft">
                          <Plane size={12} style={{ marginRight: 6, display: "inline" }} />
                          {pkg.airportCode}
                        </span>
                      )}
                      <h3 className="luxury-exp-card__title">{pkg.name}</h3>
                      <p className="luxury-exp-card__desc">{pkg.summary}</p>
                      <p className="luxury-exp-card__meta">
                        ${pkg.price} · {pkg.duration}
                      </p>
                      <ul className="luxury-airport-includes">
                        {pkg.includes.map((line) => (
                          <li key={line}>
                            <Check size={14} aria-hidden />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="luxury-exp-card__actions">
                        <button
                          type="button"
                          className="luxury-btn luxury-btn--gold"
                          onClick={() => bookPackage(pkg)}
                        >
                          Book {pkg.name}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="luxury-section" style={{ paddingTop: "1rem" }}>
            <div className="luxury-panel" style={{ maxWidth: "40rem", margin: "0 auto" }}>
              <p className="luxury-hero__eyebrow">Pair with your stay</p>
              <h2 className="luxury-panel__title" style={{ marginBottom: "0.65rem" }}>
                Landing is only the start
              </h2>
              <p className="luxury-panel__subtitle" style={{ marginBottom: "1.25rem" }}>
                Many guests combine our Airport Run with a Simple Custom Retreat, a Welcome Home
                stay, or a fully custom tour. We can connect your arrival and your time on the land
                into one seamless plan.
              </p>
              <div className="luxury-hero__actions" style={{ justifyContent: "center" }}>
                <Link to="/experiences" className="luxury-btn luxury-btn--gold">
                  Explore tours &amp; stays
                </Link>
                <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline">
                  Plan a full event
                </Link>
              </div>
            </div>
          </section>

          <ConversionClose variant="airport" />
        </div>
      </div>
    </>
  );
};

export default AirportRunsPage;
