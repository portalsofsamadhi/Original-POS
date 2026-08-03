import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Heart,
  Leaf,
  Mail,
  Phone,
  Sparkles,
  Target,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import { PAGE_SEO } from "../data/seoConfig";
import PayPalPayment from "../components/payment/PayPalPayment";
import "../styles/luxury-theme.css";

const courseModules = [
  {
    week: 1,
    title: "Pattern Recognition & Awareness",
    subtitle: "Identifying what no longer serves you",
    image: "/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.webp",
    liveSession: "Pattern Mapping Workshop",
    selfStudy: "Daily Awareness Journaling",
    botanicalSupport: "Clarity Blend Tea",
    spiritualPractice: "Mindful Observation Meditation",
    outcomes: [
      "Identify 3–5 core limiting patterns",
      "Understand pattern triggers and cycles",
      "Create a personal pattern awareness map",
    ],
  },
  {
    week: 2,
    title: "Emotional Pattern Transformation",
    subtitle: "Rewiring emotional responses",
    image: "/images - Copy/Phone/IMG-20250629-WA0046.webp",
    liveSession: "Emotional Alchemy Session",
    selfStudy: "Emotion Regulation Toolkit",
    botanicalSupport: "Heart-Calming Formula",
    spiritualPractice: "Emotional Release Ceremony",
    outcomes: [
      "Master emotional regulation techniques",
      "Transform reactive patterns into responsive ones",
      "Build a foundation of emotional resilience",
    ],
  },
  {
    week: 3,
    title: "Nutritional Realignment",
    subtitle: "Food as medicine and transformation",
    image: "/images - Copy/Phone/IMG_20250619_144254560_HDR.webp",
    liveSession: "Ital Nutrition Masterclass",
    selfStudy: "Meal Planning & Shopping Guide",
    botanicalSupport: "Digestive Healing Tincture",
    spiritualPractice: "Gratitude & Blessing Rituals",
    outcomes: [
      "Create a personalized meal transition plan",
      "Locate optimal food sources where you live",
      "Establish sustainable eating patterns",
    ],
  },
  {
    week: 4,
    title: "Spiritual Alignment & Mindfulness",
    subtitle: "Connecting to your higher purpose",
    image: "/images - Copy/Phone/IMG-20250629-WA0045.webp",
    liveSession: "Ancestral Wisdom Connection",
    selfStudy: "Daily Spiritual Practices",
    botanicalSupport: "Spiritual Clarity Blend",
    spiritualPractice: "Vision Quest Meditation",
    outcomes: [
      "Develop a consistent meditation practice",
      "Connect with ancestral guidance",
      "Clarify life purpose and direction",
    ],
  },
  {
    week: 5,
    title: "Habit Architecture & Implementation",
    subtitle: "Building your new reality",
    image: "/Welcome.webp",
    liveSession: "Habit Stacking Workshop",
    selfStudy: "Implementation Tracking System",
    botanicalSupport: "Motivation & Focus Formula",
    spiritualPractice: "Manifestation Ceremonies",
    outcomes: [
      "Design a foolproof habit replacement system",
      "Create accountability structures",
      "Establish momentum for lasting change",
    ],
  },
  {
    week: 6,
    title: "Integration & Mastery",
    subtitle: "Sustaining your transformation",
    image: "/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp",
    liveSession: "Mastery Integration Session",
    selfStudy: "Lifetime Maintenance Plan",
    botanicalSupport: "Vitality & Strength Blend",
    spiritualPractice: "Commitment Ceremony",
    outcomes: [
      "Master relapse prevention strategies",
      "Create a long-term success blueprint",
      "Celebrate transformation achievements",
    ],
  },
];

const transforms = [
  {
    icon: Heart,
    title: "Emotional Patterns",
    text: "Move from reaction to conscious response with tools you can use daily.",
  },
  {
    icon: Leaf,
    title: "Nutritional Habits",
    text: "Realign eating with vitality - food as medicine, not punishment.",
  },
  {
    icon: Sparkles,
    title: "Spiritual Clarity",
    text: "Ancestral wisdom and mindfulness practices that root you in purpose.",
  },
  {
    icon: Target,
    title: "Life Alignment",
    text: "Build habits that match your values so change becomes identity.",
  },
];

const features = [
  {
    icon: Video,
    title: "Live Weekly Sessions",
    text: "90-minute interactive workshops with Dr. Feq'ad and Mesq'al.",
  },
  {
    icon: Phone,
    title: "1-on-1 Coaching",
    text: "Three private 60-minute sessions for personalized guidance.",
  },
  {
    icon: BookOpen,
    title: "Workbooks & Tools",
    text: "Detailed guides, exercises, and tracking for every module.",
  },
  {
    icon: Leaf,
    title: "Botanical Support Kit",
    text: "Custom herbal formulations to support each stage of change.",
  },
  {
    icon: Heart,
    title: "Spiritual Practice Library",
    text: "Ceremonies and meditations drawn from living tradition.",
  },
  {
    icon: Target,
    title: "Success Tracking",
    text: "Clear milestones so progress is visible - and sustainable.",
  },
];

const includes = [
  "6 live weekly sessions (90 min each)",
  "3 private 1-on-1 coaching calls (60 min each)",
  "Complete botanical support kit",
  "Comprehensive workbooks and tracking tools",
  "Lifetime access to course materials",
  "90-day transformation guarantee",
];

const CoursesPage: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnrollmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = (details: unknown) => {
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    console.log("Payment successful:", details);
    console.log("Enrollment data:", enrollmentData);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      alert(
        "Enrollment successful! You will receive a confirmation email with course details and access instructions."
      );
    }, 3000);
  };

  const isFormValid =
    enrollmentData.name &&
    enrollmentData.email &&
    enrollmentData.phone &&
    enrollmentData.startDate;

  return (
    <>
      <SEO
        title={PAGE_SEO["/courses"].title}
        description={PAGE_SEO["/courses"].description}
        image={PAGE_SEO["/courses"].image}
        imageAlt={PAGE_SEO["/courses"].imageAlt}
        url="/courses"
        keywords={PAGE_SEO["/courses"].keywords}
        schemaType="Course"
      />

      <div className="luxury-page">
        <PageHeader
          variant="courses"
          eyebrow="Virtual Program · Worldwide"
          title={
            <>
              The Realignment <em>Program</em>
            </>
          }
          description="A refined 6-week transformation journey that names the patterns no longer serving you - and replaces them with life-giving habits, botanical support, and ancestral clarity."
          actions={
            <>
              <button
                type="button"
                className="luxury-btn luxury-btn--gold"
                onClick={() => setShowPaymentModal(true)}
              >
                Enroll Now - $2,997
              </button>
              <a href="#curriculum" className="luxury-btn luxury-btn--outline">
                View Curriculum
              </a>
            </>
          }
          meta={
            <>
              <span>
                <Calendar size={14} /> 6 weeks intensive
              </span>
              <span>
                <Users size={14} /> Limited to 12 students
              </span>
              <span>
                <Sparkles size={14} /> Live + botanical support
              </span>
            </>
          }
        />

        <div className="luxury-page-body">
          <section className="luxury-section" style={{ paddingTop: "3.5rem" }}>
            <div className="luxury-section__header">
              <p className="luxury-hero__eyebrow">What Shifts</p>
              <h2 className="luxury-section__title">
                What You Will <em>Transform</em>
              </h2>
            </div>
            <div className="luxury-approach-grid">
              {transforms.map(({ icon: Icon, title, text }) => (
                <div key={title} className="luxury-approach-card">
                  <div className="luxury-approach-card__icon">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="luxury-approach-card__title">{title}</h3>
                  <p className="luxury-approach-card__text">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="curriculum" className="luxury-section" style={{ paddingTop: "1rem" }}>
            <div className="luxury-section__header">
              <p className="luxury-hero__eyebrow">Curriculum</p>
              <h2 className="luxury-section__title">
                Six Weeks of <em>Devoted Change</em>
              </h2>
              <p className="luxury-section__lead">
                Each week blends live teaching, self-study, botanical allies, and spiritual practice - 
                so insight becomes embodiment.
              </p>
            </div>

            {courseModules.map((module) => (
              <article key={module.week} className="luxury-module">
                <div className="luxury-module__media">
                  <img src={module.image} alt="" loading="lazy" />
                  <span className="luxury-module__week">Week {module.week}</span>
                </div>
                <div className="luxury-module__body">
                  <h3 className="luxury-module__title">{module.title}</h3>
                  <p className="luxury-module__subtitle">{module.subtitle}</p>
                  <div className="luxury-module__meta">
                    <div>
                      <h4>Live session</h4>
                      <p>{module.liveSession}</p>
                    </div>
                    <div>
                      <h4>Self-study</h4>
                      <p>{module.selfStudy}</p>
                    </div>
                    <div>
                      <h4>Botanical support</h4>
                      <p>{module.botanicalSupport}</p>
                    </div>
                    <div>
                      <h4>Spiritual practice</h4>
                      <p>{module.spiritualPractice}</p>
                    </div>
                  </div>
                  <ul className="luxury-module__outcomes">
                    {module.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>

          <section className="luxury-section" style={{ paddingTop: "1rem" }}>
            <div className="luxury-section__header">
              <p className="luxury-hero__eyebrow">Included</p>
              <h2 className="luxury-section__title">
                Program <em>Features</em>
              </h2>
            </div>
            <div className="luxury-approach-grid">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="luxury-approach-card">
                  <div className="luxury-approach-card__icon">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="luxury-approach-card__title">{title}</h3>
                  <p className="luxury-approach-card__text">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="luxury-section" style={{ paddingTop: "1rem", paddingBottom: "4rem" }}>
            <div className="luxury-cta-panel" style={{ maxWidth: "40rem" }}>
              <p className="luxury-production-banner__label">Enrollment</p>
              <h2 className="luxury-production-banner__title">Begin Your Realignment</h2>
              <p className="luxury-production-banner__text">
                Limited to 12 students per cohort for genuine attention and depth.
              </p>
              <div
                style={{
                  fontFamily: "var(--luxury-serif)",
                  fontSize: "2.75rem",
                  color: "var(--luxury-gold-light)",
                  marginBottom: "0.35rem",
                }}
              >
                $2,997
              </div>
              <p className="luxury-note" style={{ marginBottom: "1.25rem" }}>
                Complete 6-week program · Payment plans available upon request
              </p>
              <ul className="luxury-module__outcomes" style={{ textAlign: "left", maxWidth: "22rem", margin: "0 auto 1.5rem" }}>
                {includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                className="luxury-btn luxury-btn--gold"
                onClick={() => setShowPaymentModal(true)}
              >
                Secure Your Spot
              </button>
            </div>
          </section>
        </div>
      </div>

      {showPaymentModal && (
        <div className="luxury-modal-backdrop" role="dialog" aria-modal="true">
          <div className="luxury-modal">
            <button
              type="button"
              className="luxury-modal__close"
              aria-label="Close"
              onClick={() => setShowPaymentModal(false)}
            >
              <X size={16} />
            </button>

            {paymentSuccess ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <CheckCircle
                  size={48}
                  style={{ color: "var(--luxury-gold)", margin: "0 auto 1rem" }}
                />
                <h3 className="luxury-panel__title">Enrollment Successful</h3>
                <p className="luxury-panel__subtitle">
                  Welcome to The Realignment Program. A confirmation email with access details is on its way.
                </p>
              </div>
            ) : (
              <>
                <p className="luxury-hero__eyebrow">Enrollment</p>
                <h3 className="luxury-panel__title">The Realignment Program</h3>
                <p className="luxury-panel__subtitle">6-week transformation · $2,997</p>

                <div className="luxury-field">
                  <label htmlFor="enroll-name">Full name *</label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={14}
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "0.85rem",
                        color: "var(--luxury-gold)",
                      }}
                    />
                    <input
                      id="enroll-name"
                      name="name"
                      value={enrollmentData.name}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "2.25rem" }}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                <div className="luxury-field">
                  <label htmlFor="enroll-email">Email *</label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={14}
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "0.85rem",
                        color: "var(--luxury-gold)",
                      }}
                    />
                    <input
                      id="enroll-email"
                      name="email"
                      type="email"
                      value={enrollmentData.email}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "2.25rem" }}
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="luxury-field">
                  <label htmlFor="enroll-phone">Phone *</label>
                  <div style={{ position: "relative" }}>
                    <Phone
                      size={14}
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "0.85rem",
                        color: "var(--luxury-gold)",
                      }}
                    />
                    <input
                      id="enroll-phone"
                      name="phone"
                      type="tel"
                      value={enrollmentData.phone}
                      onChange={handleInputChange}
                      style={{ paddingLeft: "2.25rem" }}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <div className="luxury-field">
                  <label htmlFor="enroll-start">Preferred start *</label>
                  <select
                    id="enroll-start"
                    name="startDate"
                    value={enrollmentData.startDate}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a start window</option>
                    <option value="next-cohort">Next available cohort</option>
                    <option value="within-30">Within 30 days</option>
                    <option value="within-60">Within 60 days</option>
                    <option value="flexible">Flexible / discuss</option>
                  </select>
                </div>

                {isFormValid ? (
                  <div style={{ marginTop: "1rem" }}>
                    <PayPalPayment
                      amount={2997}
                      description="The Realignment Program - 6-Week Transformation"
                      onSuccess={handlePaymentSuccess}
                      onError={() => {
                        setIsProcessingPayment(false);
                        alert("Payment failed. Please try again or contact support.");
                      }}
                      onCancel={() => setIsProcessingPayment(false)}
                      disabled={isProcessingPayment}
                    />
                  </div>
                ) : (
                  <p className="luxury-note">
                    Complete all fields to unlock secure checkout.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesPage;
