import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { sendEmail } from "../utils/emailService";
import { getFormSubmissionErrorMessage } from "../utils/formErrorMessage";
import { TEAM_EMAIL } from "../config/email";
import { toast } from "../components/ui/use-toast";
import SEO from "../components/SEO";
import PageHeader from "../components/layout/PageHeader";
import { PAGE_SEO } from "../data/seoConfig";
import { ArrowLeft, Check } from "lucide-react";
import "../styles/luxury-theme.css";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

type BookingStep = "calendar" | "details";

const BookNowPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceName = searchParams.get("serviceName") || "Info Session";
  const serviceDuration = searchParams.get("serviceDuration") || "30 minutes";
  const servicePrice = parseInt(searchParams.get("servicePrice") || "0", 10);
  const practitionerName = searchParams.get("practitionerName") || "Portals of Samadhi";

  const isInfoSessionFlow = !searchParams.has("serviceName");
  const isPaidService = searchParams.has("serviceName") && servicePrice > 0;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [step, setStep] = useState<BookingStep>("calendar");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const formatDate = (dateValue: Date | undefined) => {
    if (!dateValue) return "";
    return dateValue.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInfoSessionBooking = async () => {
    if (!date || !timeSlot || !formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const subject = `Info Session Request - ${formData.name}`;
      const html = `
        <h2>New Info Session Request</h2>
        <h3>Session Details:</h3>
        <ul>
          <li><strong>Session:</strong> Info Session</li>
          <li><strong>Team:</strong> ${practitionerName}</li>
          <li><strong>Date:</strong> ${formatDate(date)}</li>
          <li><strong>Time:</strong> ${timeSlot}</li>
        </ul>
        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone}</li>
          ${formData.notes ? `<li><strong>Project Notes:</strong> ${formData.notes}</li>` : ""}
        </ul>
        <p><em>Complimentary info session to explore a potential collaboration.</em></p>
      `;

      const result = await sendEmail({
        to: TEAM_EMAIL,
        subject,
        html,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to send info session request");
      }

      toast({
        title: "Session Requested",
        description: "Thank you. We will confirm your info session shortly.",
      });

      setFormData({ name: "", email: "", phone: "", notes: "" });
      setDate(undefined);
      setTimeSlot("");
      setStep("calendar");
    } catch (error) {
      console.error("Failed to send info session request:", error);
      toast({
        title: "Request Failed",
        description: getFormSubmissionErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaidPackageBooking = () => {
    const bookingURL = new URL("/booking-payment", window.location.origin);

    bookingURL.searchParams.append("serviceName", serviceName);
    bookingURL.searchParams.append("servicePrice", servicePrice.toString());
    bookingURL.searchParams.append("serviceDuration", serviceDuration);
    bookingURL.searchParams.append("practitionerName", practitionerName);
    bookingURL.searchParams.append("date", formatDate(date));
    bookingURL.searchParams.append("time", timeSlot);
    bookingURL.searchParams.append("name", formData.name);
    bookingURL.searchParams.append("email", formData.email);
    bookingURL.searchParams.append("phone", formData.phone);

    if (formData.notes) {
      bookingURL.searchParams.append("notes", formData.notes);
    }

    navigate(bookingURL.pathname + bookingURL.search);
  };

  const isDetailsFormComplete = () => formData.name && formData.email && formData.phone;

  const handleNext = () => {
    if (step === "calendar") {
      if (!date || !timeSlot) {
        toast({
          title: "Missing Information",
          description: "Please select both date and time.",
          variant: "destructive",
        });
        return;
      }
      setStep("details");
      return;
    }

    if (!isDetailsFormComplete()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isInfoSessionFlow) {
      handleInfoSessionBooking();
    } else {
      handlePaidPackageBooking();
    }
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("calendar");
    } else {
      navigate(-1);
    }
  };

  const pageTitle = isInfoSessionFlow ? "Begin Your Journey" : `Book ${serviceName}`;
  const pageDescription = isInfoSessionFlow
    ? "Schedule a complimentary session to share your vision for a family tour, sacred event, healing work, or venue inquiry in Jamaica."
    : `Reserve your ${serviceName} session with ${practitionerName}.`;

  return (
    <>
      <SEO
        title={`${pageTitle} | Portals of Samadhi`}
        description={pageDescription}
        image={PAGE_SEO["/book-now"].image}
        url="/book-now"
        imageAlt={PAGE_SEO["/book-now"].imageAlt}
      />

      <div className="luxury-page min-h-screen pb-8">
        <PageHeader
          variant="book"
          eyebrow="Portals of Samadhi · Free to start"
          title={pageTitle}
          description={pageDescription}
          meta={
            <>
              <span>2 short steps</span>
              <span>Confirm within 1 business day</span>
              <span>No pressure · clear next step</span>
            </>
          }
        />
        <div className="max-w-md mx-auto px-4" style={{ marginTop: "1.5rem" }}>
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-[#E8B4A3] hover:text-[#F4C95D] mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <p className="text-sm text-samadhi-cream/55 leading-relaxed mb-2">
              {isInfoSessionFlow
                ? "Complimentary discovery call. Pick a day and time, share your details, and we confirm by email."
                : "You’re booking a paid session. Complete schedule and details, then continue to payment."}
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div
              className={`flex items-center ${
                step === "calendar" ? "text-[#E8B4A3]" : "text-[#C3998F]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "calendar"
                    ? "bg-[#C3998F] text-samadhi-black"
                    : "bg-[#C3998F]/80 text-samadhi-black"
                }`}
              >
                {step === "details" ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium">Schedule</span>
            </div>
            <div className="flex-1 h-0.5 bg-samadhi-cream/15 mx-4">
              <div
                className={`h-full transition-all duration-300 ${
                  step === "details" ? "bg-[#C3998F] w-full" : "bg-samadhi-cream/15 w-0"
                }`}
              />
            </div>
            <div
              className={`flex items-center ${
                step === "details" ? "text-[#E8B4A3]" : "text-samadhi-cream/40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "details" ? "bg-[#C3998F] text-samadhi-black" : "bg-samadhi-cream/10"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Details</span>
            </div>
          </div>

          <Card className="mb-6 border-samadhi-cream/15 bg-[#111111]">
            <CardContent className="p-6">
              {step === "calendar" && (
                <div>
                  {isInfoSessionFlow ? (
                    <div className="p-4 rounded-lg border border-[#C3998F]/25 bg-[#0A0A0A] mb-5">
                      <h2 className="text-lg font-semibold text-samadhi-cream mb-2">
                        Discovery Session
                      </h2>
                      <p className="text-samadhi-cream/70 text-sm leading-relaxed">
                        A relaxed conversation about your family tour, sacred gathering,
                        healing session, or venue needs in Jamaica. No obligation - just
                        clarity and a path that fits your intention.
                      </p>
                      <ul className="text-samadhi-cream/55 text-sm space-y-1 mt-3">
                        <li>Complimentary 30-minute session</li>
                        <li>Tours, events, venues, or energy healing</li>
                        <li>Thoughtful next steps within 48 hours if there is a fit</li>
                      </ul>
                      <p className="text-samadhi-cream/50 text-sm mt-3">
                        New here?{" "}
                        <Link to="/experiences" className="text-[#E8B4A3] hover:underline">
                          Explore family tours
                        </Link>{" "}
                        before you book.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-samadhi-cream/15 bg-[#0A0A0A] mb-5">
                      <h2 className="text-lg font-semibold text-samadhi-cream mb-2">
                        {serviceName}
                      </h2>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-[#F4C95D]">${servicePrice}</div>
                        <div className="text-samadhi-cream/55 text-sm">{serviceDuration}</div>
                      </div>
                      <p className="text-samadhi-cream/70 text-sm">
                        with {practitionerName}
                      </p>
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-samadhi-cream mb-4">
                    Select Date & Time
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-samadhi-cream/80">Choose a date</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(dateValue) => dateValue < new Date() || dateValue.getDay() === 0}
                        className="rounded-md border border-samadhi-cream/15 mt-2"
                      />
                    </div>

                    {date && (
                      <div>
                        <Label className="text-samadhi-cream/80">
                          Available times for {formatDate(date)}
                        </Label>
                        <Select value={timeSlot} onValueChange={setTimeSlot}>
                          <SelectTrigger className="mt-2 border-samadhi-cream/15 bg-[#0A0A0A] text-samadhi-cream">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === "details" && (
                <div>
                  <h2 className="text-lg font-semibold text-samadhi-cream mb-4">
                    Your Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-samadhi-cream/80">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="mt-1 border-samadhi-cream/15 bg-[#0A0A0A] text-samadhi-cream"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-samadhi-cream/80">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="mt-1 border-samadhi-cream/15 bg-[#0A0A0A] text-samadhi-cream"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-samadhi-cream/80">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="mt-1 border-samadhi-cream/15 bg-[#0A0A0A] text-samadhi-cream"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-samadhi-cream/80">
                        {isInfoSessionFlow ? "Tell Us About Your Project (Optional)" : "Additional Notes (Optional)"}
                      </Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder={
                          isInfoSessionFlow
                            ? "Share your concept, timeline, or the kind of cinematic work you have in mind..."
                            : "Any specific requests or information you would like to share..."
                        }
                        className="mt-1 border-samadhi-cream/15 bg-[#0A0A0A] text-samadhi-cream"
                        rows={3}
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-samadhi-cream/15 bg-[#0A0A0A] mt-6">
                      <h3 className="font-semibold text-samadhi-cream mb-2">Summary</h3>
                      <div className="text-sm space-y-1 text-samadhi-cream/70">
                        <div>
                          <strong className="text-samadhi-cream/90">Session:</strong>{" "}
                          {isInfoSessionFlow ? "Info Session" : serviceName}
                        </div>
                        <div>
                          <strong className="text-samadhi-cream/90">With:</strong>{" "}
                          {practitionerName}
                        </div>
                        <div>
                          <strong className="text-samadhi-cream/90">Date:</strong>{" "}
                          {formatDate(date)}
                        </div>
                        <div>
                          <strong className="text-samadhi-cream/90">Time:</strong> {timeSlot}
                        </div>
                        {isPaidService && (
                          <div>
                            <strong className="text-samadhi-cream/90">Investment:</strong> $
                            {servicePrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handleNext}
            disabled={isProcessing}
            className="w-full bg-[#C3998F] hover:bg-[#E8B4A3] text-samadhi-black py-3 font-semibold"
          >
            {isProcessing
              ? "Processing..."
              : step === "calendar"
                ? "Continue"
                : isInfoSessionFlow
                  ? "Request Info Session"
                  : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookNowPage;