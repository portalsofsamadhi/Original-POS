import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
}

const BookingDialog = ({ 
  serviceName, 
  serviceDuration, 
  servicePrice, 
  practitionerName,
  serviceId = "service" + Math.floor(Math.random() * 1000),
  buttonLabel = "Book Now",
  buttonSize = "sm",
  buttonVariant = "default",
  buttonClassName = "bg-green-600 hover:bg-green-700"
}: BookingDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [step, setStep] = useState<"calendar" | "details">("calendar");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleProceedToCheckout = () => {
    // Create URL with all the booking information
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
      <DialogTrigger asChild>
        <Button 
          size={buttonSize} 
          variant={buttonVariant} 
          className={buttonClassName}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{serviceName}</DialogTitle>
          <DialogDescription>
            {step === "calendar" 
              ? "Select a date and time for your appointment." 
              : "Please provide your contact information to complete your booking."}
          </DialogDescription>
        </DialogHeader>

        {step === "calendar" ? (
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
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
                <SelectTrigger id="time">
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

            <div className="text-sm text-gray-500 space-y-1">
              <div><span className="font-medium">Service:</span> {serviceName}</div>
              <div><span className="font-medium">Duration:</span> {serviceDuration}</div>
              <div><span className="font-medium">Price:</span> ${servicePrice}</div>
              <div><span className="font-medium">Practitioner:</span> {practitionerName}</div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Your full name" 
                required 
              />
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
              />
            </div>

            <div className="text-sm bg-gray-50 p-3 rounded-md space-y-1">
              <div><span className="font-medium">Date:</span> {formatDate(date)}</div>
              <div><span className="font-medium">Time:</span> {timeSlot}</div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
          {step === "calendar" ? (
            <Button 
              type="button" 
              variant="default" 
              disabled={!date || !timeSlot} 
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          ) : (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("calendar")}
              >
                Back
              </Button>
              <Button 
                type="button" 
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                disabled={!isDetailsFormComplete()}
                onClick={handleProceedToCheckout}
              >
                Proceed to Payment
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
