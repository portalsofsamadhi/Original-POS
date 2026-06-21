import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingDialogNew from "../booking/BookingDialogNew";
import { useIsMobile } from "../../hooks/useIsMobile";
import { buildBookNowUrl } from "../../utils/mobileRoutes";
import "../../styles/mbg-aesthetics.css";

export interface Service {
  name: string;
  id: string;
  title: string;
  description: string;
  summary: string;
  duration: string;
  price: number;
  image?: string;
  practitioner: string;
  category: string;
}

interface ServiceSelectionProps {
  services?: Service[];
  selectedPractitioner?: string;
  selectedService?: Service | null;
  setSelectedService: (service: Service | null) => void;
  _setCurrentStep?: (step: "services" | "home" | "booking") => void;
}

const ServiceSelection = ({
  services = [
    {
      id: "synergy1",
      name: "The Complete Path to Wholeness",
      title: "The Complete Path to Wholeness",
      description:
        "The ultimate transformation experience combining every aspect of our expertise. This comprehensive 6-month journey integrates advanced spiritual mastery, strategic excellence, and holistic healing for complete life transformation. Includes monthly and bi-weekly sessions with both practitioners, 6-month VIP support, mastermind group, and more.",
      summary:
        "A six-month integrated journey with both practitioners for complete life transformation.",
      duration: "6 Month Program",
      price: 4999,
      practitioner: "Feq'ad & Mesq'al",
      category: "Integrated Transformation",
    },
    {
      id: "fq1",
      name: "Soul Mastery Transformation Program",
      title: "Soul Mastery Transformation Program",
      description:
        "A focused 6-week journey blending ancient Jamaican healing and modern therapeutic practices. Release old patterns, reclaim your power, and awaken your highest spiritual potential through a guided, supportive process designed for deep soul renewal.",
      summary:
        "A six-week intensive blending Jamaican healing and modern therapy for deep soul renewal.",
      duration: "6-week intensive program",
      price: 2500,
      practitioner: "Feq'ad Wolde",
      category: "Healing Programs",
    },
    {
      id: "fq2",
      name: "Wellness Mastery Program",
      title: "Wellness Mastery Program",
      description:
        "A complete 3-month program for total mind-body-spirit renewal. Integrating advanced healing, herbal medicine, and spiritual mentorship, this package supports physical vitality, emotional resilience, and conscious leadership. Ideal for those seeking sustainable transformation and peak performance.",
      summary:
        "Three months of mind-body-spirit renewal with herbal medicine and spiritual mentorship.",
      duration: "3-month comprehensive program",
      price: 4500,
      practitioner: "Feq'ad Wolde",
      category: "Healing Programs",
    },
    {
      id: "fq3",
      name: "Ancestral Healing Legacy Program",
      title: "Ancestral Healing Legacy Program",
      description:
        "A unique family-centered program to heal generational patterns and restore harmony. Blending traditional Jamaican lineage work with modern family systems healing, this package offers a powerful path to resolve ancestral trauma and create lasting positive change for you and future generations.",
      summary:
        "Family-centered lineage work to heal generational patterns and restore harmony.",
      duration: "Family-based healing program",
      price: 3400,
      practitioner: "Feq'ad Wolde",
      category: "Healing Programs",
    },
    {
      id: "mq1",
      name: "A Helping Hand Package",
      title: "A Helping Hand Package",
      description:
        "Perfect for those drowning in tasks, struggling with workflow, or unsure how to integrate automation and AI effectively. You've got momentum, but need focused, intelligent support to keep your head above water with thoughtful custom setup and strategic guidance.",
      summary:
        "Monthly workflow and automation support to keep your momentum moving forward.",
      duration: "Monthly Service",
      price: 2800,
      practitioner: "Mesq'al Kebra",
      category: "Creative Support",
    },
    {
      id: "mq2",
      name: "Finish What You Started Package",
      title: "Finish What You Started Package",
      description:
        "You began something worth finishing: an online course, a landing page, a book, or a service portal. This package bridges the gap between concept and public release with deep build work requiring skilled design, tech stack integration, and content strategy.",
      summary:
        "Project-based support to finish and launch your course, site, book, or portal.",
      duration: "Project-Based Service",
      price: 4500,
      practitioner: "Mesq'al Kebra",
      category: "Creative Support",
    },
    {
      id: "mq3",
      name: "Gather Package",
      title: "Gather Package",
      description:
        "Ideal for educators, guides, or community builders ready to host meaningful online or hybrid experiences. Whether it's a course, webinar, or immersive session, we help with the scaffolding and the signal-boosting through labor-intensive, time-bound support covering both tech and creative setup.",
      summary:
        "Event-based scaffolding for courses, webinars, and hybrid community experiences.",
      duration: "Event-Based Service",
      price: 3200,
      practitioner: "Mesq'al Kebra",
      category: "Creative Support",
    },
  ],
  selectedPractitioner,
  selectedService,
  setSelectedService,
}: ServiceSelectionProps) => {
  const filteredServices = services.filter((service) => {
    const practitionerMatch =
      !selectedPractitioner ||
      service.practitioner === selectedPractitioner ||
      service.practitioner === "Both Practitioners";
    return practitionerMatch;
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (isMobile) {
      navigate(
        buildBookNowUrl({
          serviceName: service.title,
          serviceDuration: service.duration,
          servicePrice: service.price,
          practitionerName: service.practitioner,
          serviceId: service.id,
        })
      );
      return;
    }
    setDialogOpen(true);
  };

  const scrollRail = (direction: "prev" | "next") => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(260, rail.clientWidth * 0.72);
    rail.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="samadhi-service-carousel">
      <div className="samadhi-service-carousel__head">
        <p className="samadhi-service-carousel__label">Browse Premium Services</p>
        <div className="samadhi-service-carousel__nav">
          <button
            type="button"
            className="samadhi-service-carousel__nav-btn"
            onClick={() => scrollRail("prev")}
            aria-label="Scroll services left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="samadhi-service-carousel__nav-btn"
            onClick={() => scrollRail("next")}
            aria-label="Scroll services right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="samadhi-service-carousel__rail" ref={railRef} role="list">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            type="button"
            role="listitem"
            className={`samadhi-service-card${
              selectedService?.id === service.id ? " samadhi-service-card--selected" : ""
            }`}
            onClick={() => handleServiceSelect(service)}
            aria-label={`Book ${service.title}, ${service.price.toLocaleString()} dollars`}
          >
            <h3 className="samadhi-service-card__title">{service.title}</h3>
            <p className="samadhi-service-card__summary">{service.summary}</p>
            <span className="samadhi-service-card__price">
              ${service.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {selectedService && (
        <BookingDialogNew
          serviceName={selectedService.title}
          serviceDuration={selectedService.duration}
          servicePrice={selectedService.price}
          practitionerName={selectedService.practitioner}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          buttonLabel="Continue Booking"
          buttonClassName="hidden"
          samadhiTheme
        />
      )}
    </div>
  );
};

export default ServiceSelection;