import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Plane } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import ConversionClose from "../components/layout/ConversionClose";
import { PAGE_SEO } from "../data/seoConfig";
import {
  AIRPORT_RUN_PACKAGES,
  AIRPORT_RUNS_INTRO,
  buildAirportBookParams,
  type AirportRunPackage,
} from "../data/airportRuns";
import "../styles/luxury-theme.css";

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Choose your run",
    text: "Pickup, drop-off, or both ways. Clear prices. No surprise add-ons at the curb.",
  },
  {
    n: "02",
    title: "Book and share flight details",
    text: "After you book, we confirm and collect flight number, terminal, and stay address.",
  },
  {
    n: "03",
    title: "We meet you",
    text: "Private transfer with a host who knows the roads and the land you are heading toward.",
  },
];

const AirportRunsPage = () => {
  const navigate = useNavigate();

  const bookPackage = (pkg: AirportRunPackage) => {
    navigate(`/booking-payment?${buildAirportBookParams(pkg).toString()}`);
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
                <Plane size={14} /> Kingston &amp; island airports we serve
              </span>
              <span>Private vehicle · host-driven</span>
              <span>From $95 one-way</span>
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
                Airport Runs sit beside our tours and stays — the same family hosts, the same
                care. You are not shopping a generic transfer app. You are starting (or ending)
                a journey with people who will know your name when you land.
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
            aria-label="Airport run packages"
          >
            <div className="luxury-section__header" style={{ marginBottom: "1.75rem" }}>
              <p className="luxury-hero__eyebrow">Packages</p>
              <h2 className="luxury-section__title">
                Clear prices. <em>Easy to book.</em>
              </h2>
            </div>

            <div className="luxury-exp-grid">
              {AIRPORT_RUN_PACKAGES.map((pkg) => (
                <article key={pkg.id} className="luxury-exp-card" id={pkg.id}>
                  {pkg.badge ? (
                    <span className="luxury-exp-card__badge">{pkg.badge}</span>
                  ) : (
                    <span className="luxury-exp-card__badge luxury-exp-card__badge--soft">
                      <Plane size={12} style={{ marginRight: 6, display: "inline" }} />
                      Transfer
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
          </section>

          <section className="luxury-section" style={{ paddingTop: "1rem" }}>
            <div className="luxury-panel" style={{ maxWidth: "40rem", margin: "0 auto" }}>
              <p className="luxury-hero__eyebrow">Pair with your stay</p>
              <h2 className="luxury-panel__title" style={{ marginBottom: "0.65rem" }}>
                Landing is only the start
              </h2>
              <p className="luxury-panel__subtitle" style={{ marginBottom: "1.25rem" }}>
                Many guests book Airport Runs with a Simple Custom Retreat, Welcome Home stay,
                or fully custom tour. We can stitch arrival and days on the land into one plan.
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
