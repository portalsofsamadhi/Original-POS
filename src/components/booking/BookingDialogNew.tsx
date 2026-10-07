import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";
import { buildBookNowUrl } from "../../utils/mobileRoutes";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from "../ui/calendar";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { sendEmail } from "../../utils/emailService"; // Unused
import { toast } from "../ui/use-toast";

// Available time slots for booking
const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

interface BookingDialogProps {
  serviceName: string;
  serviceDuration: string;
  servicePrice: number;
  practitionerName: string;
  serviceId?: string;
  buttonLabel?: string;
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonClassName?: string;
  dialogClassName?: string;
  forceMobileStandalone?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  hideFullPackageTab?: boolean;
  samadhiTheme?: boolean;
}

const BookingDialogNew = ({ 
  serviceName, 
  serviceDuration, 
  servicePrice, 
  practitionerName,
  serviceId = "service" + Math.floor(Math.random() * 1000),
  buttonLabel = "Book Now",
  buttonSize = "sm",
  buttonVariant = "default",
  buttonClassName = "bg-[#a38f77] hover:bg-[#8c775e] text-white",
  dialogClassName,
  forceMobileStandalone = true,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  hideFullPackageTab = false,
  samadhiTheme = false,
}: BookingDialogProps) => {
  const accentBtn = samadhiTheme
    ? "bg-[#C3998F] hover:bg-[#E8B4A3] text-[#0A0A0A]"
    : "bg-green-600 hover:bg-green-700 text-white";
  const packageCard = samadhiTheme
    ? "border-[rgba(195,153,143,0.28)] bg-[#111111]"
    : "border-green-200 bg-green-50";
  const packageIcon = samadhiTheme ? "bg-[#C3998F]" : "bg-green-500";
  const packageTitle = samadhiTheme ? "text-[#F5F0E8]" : "text-black";
  const packageBody = samadhiTheme ? "text-[rgba(245,240,232,0.68)]" : "text-green-700";
  const packageHighlight = samadhiTheme
    ? "text-[#E8B4A3]"
    : "text-green-600";
  const packageInset = samadhiTheme
    ? "bg-[#0A0A0A] text-[rgba(245,240,232,0.75)] border border-[rgba(195,153,143,0.15)]"
    : "bg-white text-black";
  const packageBlurb = samadhiTheme
    ? "text-[rgba(245,240,232,0.62)] bg-[rgba(17,17,17,0.85)] border border-[rgba(195,153,143,0.2)]"
    : "text-green-800 bg-gradient-to-br from-green-50 to-green-100 border border-green-200";
  const summaryBox = samadhiTheme
    ? "bg-[rgba(17,17,17,0.7)] text-[rgba(245,240,232,0.72)] border border-[rgba(195,153,143,0.12)]"
    : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
  const summaryHeading = samadhiTheme
    ? "text-[#F5F0E8]"
    : "text-gray-900 dark:text-gray-100";
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<"selection" | "calendar" | "details" | "thankyou">("selection");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [bookingType, setBookingType] = useState<"consultation" | "package">("package");
  const [internalIsOpen, internalSetIsOpen] = useState<boolean>(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen !== undefined ? controlledSetIsOpen : internalSetIsOpen;
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const handleBookNowClick = () => {
    if (isMobile && forceMobileStandalone) {
      navigate(
        buildBookNowUrl({
          serviceName,
          serviceDuration,
          servicePrice,
          practitionerName,
          serviceId,
        })
      );
      return;
    }
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleProceedToCheckout = () => {
    if (bookingType === "consultation") {
  handleFreeConsultationBooking();
    } else {
      // Handle paid package - redirect to payment page
      handlePaidPackageBooking();
    }
  };

  const handleFreeConsultationBooking = async () => {
    setIsProcessing(true);
    try {
      // Send booking to backend (same as paid booking, but with paymentMethod 'free-consultation')
      const bookingData = {
        serviceId,
        serviceName,
        servicePrice: 0,
        serviceDuration,
        practitionerName,
        date: formatDate(date),
        time: timeSlot,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        bookingType: 'consultation'
      };
      const paymentDetails = {
        transactionId: 'FREE-CONSULTATION',
        amount: 0,
        currency: 'USD',
        paymentMethod: 'free-consultation',
        status: 'completed'
      };
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingData, paymentDetails })
      });
      const result = await res.json();
      if (result.success) {
        toast({
          title: "Consultation Request Sent!",
          description: "We'll contact you within 24 hours to confirm your free consultation appointment.",
        });
        setFormData({ name: "", email: "", phone: "", notes: "" });
        setDate(undefined);
        setTimeSlot("");
        setStep("thankyou");
        setTimeout(() => setIsOpen(false), 2200);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to send consultation request:', error);
      toast({
        title: "Request Failed",
        description: "Failed to send consultation request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaidPackageBooking = () => {
    // Create URL with all the booking information for paid package
    const bookingURL = new URL("/booking/", window.location.origin);
    
    // Add all parameters needed for the booking
    bookingURL.searchParams.append("serviceId", serviceId);
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
    
    // Redirect to the booking payment page
    window.location.href = bookingURL.toString();
  };

  // Form validation
  const isDetailsFormComplete = () => {
    return formData.name && formData.email && formData.phone;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        size={buttonSize} 
        variant={buttonVariant} 
        className={buttonClassName}
        onClick={handleBookNowClick}
      >
        {buttonLabel}
      </Button>
      <DialogContent
        className={`${samadhiTheme ? "samadhi-booking-dialog " : ""}${dialogClassName ?? ""} max-w-[95vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto`}
        aria-describedby="booking-dialog-desc"
      >
        <div id="booking-dialog-desc" style={{ display: 'none' }}>Book a new appointment for your selected service.</div>
        <DialogHeader>
          <DialogTitle className={`text-xl font-semibold ${samadhiTheme ? "text-[#F5F0E8]" : ""}`}>
            {serviceName}
          </DialogTitle>
          <DialogDescription className={`text-base ${samadhiTheme ? "text-[rgba(245,240,232,0.62)]" : ""}`}>
            {step === "selection" 
              ? "Choose how you'd like to proceed with this service." 
              : step === "calendar" 
              ? "Select a date and time for your appointment." 
              : "Please provide your contact information to complete your booking."}
          </DialogDescription>
        </DialogHeader>

        {step === "selection" ? (
          <div className="grid gap-6 py-4">
            {hideFullPackageTab ? (
              <Card className={packageCard}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 ${packageIcon} rounded-full flex items-center justify-center mx-auto`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className={`text-lg font-semibold ${packageTitle}`}>Free Discovery Call</h3>
                    <p className={`text-sm ${packageBody}`}>
                      Book a complimentary 30-minute consultation to discuss your needs, explore how we can help, and determine if this service is the right fit for you.
                    </p>
                    <div className={`rounded-lg p-3 ${packageInset}`}>
                      <div className="font-semibold">What's Included:</div>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• Needs assessment & goal clarification</li>
                        <li>• Service overview & approach explanation</li>
                        <li>• Custom recommendations</li>
                      </ul>
                    </div>
                    <div className={`text-2xl font-bold ${packageHighlight}`}>FREE</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={bookingType} onValueChange={(value) => setBookingType(value as "consultation" | "package")}> 
                <TabsList className={`grid w-full grid-cols-2 ${samadhiTheme ? "samadhi-booking-dialog__tabs" : ""}`}>
                  <TabsTrigger value="consultation">🆓 Free Consultation</TabsTrigger>
                  <TabsTrigger value="package">💼 Full Package</TabsTrigger>
                </TabsList>
                <TabsContent value="consultation" className="space-y-4 mt-6">
                  <Card className={packageCard}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className={`w-12 h-12 ${packageIcon} rounded-full flex items-center justify-center mx-auto`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className={`text-lg font-semibold ${packageTitle}`}>Free Discovery Call</h3>
                        <p className={`text-sm ${packageBody}`}>
                          Book a complimentary 30-minute consultation to discuss your needs, explore how we can help, and determine if this service is the right fit for you.
                        </p>
                        <div className={`rounded-lg p-3 ${packageInset}`}>
                          <div className="font-semibold">What's Included:</div>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Needs assessment & goal clarification</li>
                            <li>• Service overview & approach explanation</li>
                            <li>• Custom recommendations</li>
                            <li>• Q&A about the full package</li>
                          </ul>
                        </div>
                        <div className={`text-2xl font-bold ${packageHighlight}`}>FREE</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="package" className="space-y-4 mt-6">
                  <Card className={packageCard}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className={`w-12 h-12 ${packageIcon} rounded-full flex items-center justify-center mx-auto`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m5 0h4m-4 0v-5h2v5" />
                          </svg>
                        </div>
                        <h3 className={`text-lg font-semibold ${packageTitle}`}>{serviceName}</h3>
                        <div className={`text-sm rounded-lg p-4 mb-2 shadow-sm ${packageBlurb}`}>
                          <span className={`block mb-1 font-medium ${packageTitle}`}>Enjoy the complete {serviceName} experience:</span>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>All sessions and features included</li>
                            <li>Personalized guidance every step of the way</li>
                            <li>Exclusive resources & priority support</li>
                          </ul>
                          <span className={`block mt-2 ${packageBody}`}>Maximize your results with our most comprehensive package.</span>
                        </div>
                        <p className={`text-sm ${packageBody}`}>
                          Get the full {serviceName} experience with comprehensive support and guaranteed results.
                        </p>
                        <div className={`rounded-lg p-3 ${packageInset}`}>
                          <div className="font-semibold">Package Details:</div>
                          <div className="text-sm mt-2 space-y-1">
                            <div>• <strong>Duration:</strong> {serviceDuration}</div>
                            <div>• <strong>Practitioner:</strong> {practitionerName}</div>
                            <div>• <strong>Full service delivery</strong></div>
                            <div>• <strong>Ongoing support included</strong></div>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${packageHighlight}`}>${servicePrice}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        ) : step === "calendar" ? (
          <div className="grid gap-4 py-2">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full flex justify-center"
                  disabled={(date) => {
                    // Disable past dates, Sundays, and any full days
                    return (
                      date < new Date() ||
                      date.getDay() === 0 // Sunday
                    );
                  }}
                />
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="time">Select a time</Label>
              <Select
                disabled={!date}
                value={timeSlot}
                onValueChange={setTimeSlot}
              >
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={`text-sm p-4 rounded-lg space-y-2 ${summaryBox}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span className="font-medium">Service:</span> <span className="break-words">{serviceName}</span></div>
                <div><span className="font-medium">Type:</span> {bookingType === "consultation" ? "Free Consultation" : serviceName}</div>
                <div><span className="font-medium">Duration:</span> {bookingType === "consultation" ? "30 minutes" : serviceDuration}</div>
                <div><span className="font-medium">Price:</span> {bookingType === "consultation" ? "FREE" : `$${servicePrice}`}</div>
                <div className="sm:col-span-2"><span className="font-medium">Practitioner:</span> <span className="break-words">{practitionerName}</span></div>
              </div>
            </div>
          </div>
        ) : step === "thankyou" ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-2xl font-bold text-green-700 mb-2">Thanks for Booking!</div>
            <div className="text-green-800 text-center max-w-xs">Your free consultation request has been received. We'll be in touch soon to confirm your appointment.</div>
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Your full name" 
                  required 
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Your phone number" 
                  required 
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Your email address" 
                required 
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Any special requests or information" 
                className="w-full min-h-[80px]"
              />
            </div>

            <div className={`text-sm p-4 rounded-md space-y-2 ${summaryBox}`}>
              <h4 className={`font-medium mb-2 ${summaryHeading}`}>Booking Summary:</h4>
              <div className="grid grid-cols-1 gap-1">
                <div><span className="font-medium">Service:</span> <span className="break-words">{serviceName}</span></div>
                <div><span className="font-medium">Type:</span> {bookingType === "consultation" ? "Free Consultation (30 min)" : `${serviceName} (${serviceDuration})`}</div>
                <div><span className="font-medium">Date:</span> {formatDate(date)}</div>
                <div><span className="font-medium">Time:</span> {timeSlot}</div>
                <div><span className="font-medium">Price:</span> {bookingType === "consultation" ? "FREE" : `$${servicePrice}`}</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4">
          {/* Only render footer buttons here, not the main step content */}
          {step === "selection" && (
            <Button 
              type="button" 
              variant="default" 
              onClick={() => setStep("calendar")}
              className={`w-full sm:w-auto ${accentBtn}`}
            >
              Continue
            </Button>
          )}
          {step === "calendar" && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("selection")}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button 
                type="button" 
                variant="default" 
                disabled={!date || !timeSlot} 
                onClick={() => setStep("details")}
                className={`w-full sm:w-auto ${accentBtn}`}
              >
                Continue
              </Button>
            </>
          )}
          {step === "details" && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("calendar")}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button 
                type="button" 
                variant="default"
                className={`w-full sm:w-auto ${accentBtn}`}
                disabled={!isDetailsFormComplete() || isProcessing}
                onClick={handleProceedToCheckout}
              >
                {isProcessing 
                  ? 'Processing...' 
                  : bookingType === "consultation" 
                  ? "Request Free Consultation" 
                  : "Proceed to Payment"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialogNew;
