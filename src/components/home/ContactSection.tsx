import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { sendEmail } from "../../utils/emailService";
import { getFormSubmissionErrorMessage } from "../../utils/formErrorMessage";
import { TEAM_EMAIL } from "../../config/email";
import { toast } from "../ui/use-toast";
import "../../styles/samadhi-sections.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const RETREAT_PATHS = ["/experiences", "/retreat-tours", "/retreat-tours-workshops"];

const ContactSection = () => {
  const { pathname } = useLocation();
  const isRetreatPage = RETREAT_PATHS.some((p) => pathname.startsWith(p));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    bookInfoSession: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const intent = form.bookInfoSession
        ? "Book an Info Session"
        : "General Inquiry";

      const result = await sendEmail({
        to: TEAM_EMAIL,
        subject: `Website Contact: ${intent} from ${form.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Intent:</strong> ${intent}</p>
          <ul>
            <li><strong>Name:</strong> ${form.name}</li>
            <li><strong>Email:</strong> ${form.email}</li>
          </ul>
          <h3>Message</h3>
          <p>${form.message.replace(/\n/g, "<br>")}</p>
        `,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      toast({
        title: "Message sent",
        description: form.bookInfoSession
          ? "We'll reach out shortly to schedule your info session."
          : "Thank you. We'll be in touch soon.",
      });

      setForm({ name: "", email: "", message: "", bookInfoSession: false });
    } catch (error) {
      console.error("Failed to send contact form:", error);
      toast({
        title: "Request Failed",
        description: getFormSubmissionErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="samadhi-section samadhi-section--contact"
      aria-label="Contact Portals of Samadhi"
      style={{ scrollMarginTop: "72px" }}
    >
      <div className="samadhi-section__inner">
        <motion.div
          className="samadhi-section__header samadhi-section__header--center scroll-fade-in"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <p className="samadhi-section__eyebrow">Get in Touch</p>
          <h2 className="samadhi-section__title">
            {isRetreatPage ? (
              <>Plan Your <span className="samadhi-section__title-accent">Retreat</span></>
            ) : (
              <>Start the <span className="samadhi-section__title-accent">Conversation</span></>
            )}
          </h2>
          <p className="samadhi-section__desc">
            {isRetreatPage
              ? "Questions about dates, group size, accommodations, or customizing your Jamaica experience? Reach out and we will help you shape a retreat that feels personal, grounded, and unforgettable."
              : "Whether you are exploring a series, campaign, retreat, or creative partnership, we respond with clarity, care, and the attention your vision deserves."}
          </p>
        </motion.div>

        <div className="samadhi-contact__grid">
          <motion.div
            className="samadhi-contact__info scroll-fade-in"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
          >
            <p className="samadhi-contact__lead">
              {isRetreatPage
                ? "Portals of Samadhi hosts intimate family tours across Jamaica: healing sessions, cultural immersion, farm visits, curated venues, and hospitality led from the land itself."
                : "Tell us about your family tour, sacred event, or healing session. We design intimate Jamaica experiences rooted in lineage, land, and care - never mass tourism."}
            </p>

            <ul className="samadhi-contact__details">
              <li>
                <MapPin size={18} aria-hidden="true" />
                <span>Oakland, CA · Airy Castle, Jamaica</span>
              </li>
              <li>
                <Phone size={18} aria-hidden="true" />
                <a href="tel:+15102919399">(510) 291-9399</a>
              </li>
              <li>
                <Mail size={18} aria-hidden="true" />
                <a href="mailto:info@portalsofsamadhi.com">info@portalsofsamadhi.com</a>
              </li>
            </ul>

            {!isRetreatPage && (
              <Link to="/book-now" className="samadhi-btn samadhi-btn--gold samadhi-contact__cta-link">
                Work Together
              </Link>
            )}
          </motion.div>

          <motion.form
            className="samadhi-contact__form scroll-fade-in"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
          >
            <div className="samadhi-contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="samadhi-contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="samadhi-contact__field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={
                  isRetreatPage
                    ? "Share your preferred dates, group size, interests, or any questions about your retreat..."
                    : "Tell us about your project, vision, or question..."
                }
                rows={5}
                required
              />
            </div>

            {!isRetreatPage && (
              <label className="samadhi-contact__checkbox">
                <input
                  type="checkbox"
                  checked={form.bookInfoSession}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bookInfoSession: e.target.checked }))
                  }
                />
                <span>I&apos;d like to book an info session</span>
              </label>
            )}

            <button
              type="submit"
              className="samadhi-btn samadhi-btn--gold samadhi-contact__submit"
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;