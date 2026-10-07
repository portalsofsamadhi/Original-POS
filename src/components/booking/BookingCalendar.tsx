import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../ui/calendar";
import {
  Card as _Card,
  CardContent as _CardContent,
  CardDescription as _CardDescription,
  CardFooter as _CardFooter,
  CardHeader as _CardHeader,
  CardTitle as _CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import "../../styles/mbg-aesthetics.css";

import {
  format,
  setHours,
  setMinutes,
  isAfter,
  isSameDay,
} from "date-fns";
import { cn } from "../../lib/utils";

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  practitioner: string;
  category: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  selectedService: Service | null;
  currentStep: "services" | "home" | "booking";
  setCurrentStep: (step: "services" | "home" | "booking") => void;
}

const BookingCalendar = ({
  selectedService,
  currentStep: _currentStep,
  setCurrentStep: _setCurrentStep
}: BookingCalendarProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = (selectedDate: Date | undefined): TimeSlot[] => {
    if (!selectedDate) return [];

    const slots: TimeSlot[] = [];
    const now = new Date();
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const minute of [0, 30]) {
        const slotTime = setMinutes(
          setHours(new Date(selectedDate), hour),
          minute,
        );
        const timeString = format(slotTime, "h:mm a");

        // Make slots in the past unavailable
        const isAvailable = isSameDay(selectedDate, now)
          ? isAfter(slotTime, now)
          : true;

        // Randomly make some slots unavailable for demo purposes
        const randomAvailability = Math.random() > 0.3;

        slots.push({
          time: timeString,
          available: isAvailable && randomAvailability,
        });
      }
    }

    return slots;
  };

  const timeSlots = date ? generateTimeSlots(date) : [];

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleBookingConfirm = () => {
    if (date && selectedTimeSlot) {
      setIsBookingDialogOpen(true);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayments = () => {
    if (!selectedService || !date || !selectedTimeSlot || !formData.fullName || !formData.email || !formData.phone) return;
    // Pass booking details as a single object, matching Book Now logic
    // Build query string for /booking/ page
    const params = new URLSearchParams({
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      servicePrice: String(selectedService.price),
      serviceDuration: selectedService.duration,
      practitionerName: selectedService.practitioner,
      date: format(date, 'EEEE, MMMM d, yyyy'),
      time: selectedTimeSlot,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      ...(formData.notes ? { notes: formData.notes } : {})
    });
    navigate(`/booking/?${params.toString()}`);
    setIsBookingDialogOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mbg-card">
        <div className="mbg-card-header">
          <h2 className="mbg-section-title">
            Book Your {selectedService?.title}
          </h2>
          <p className="mbg-body-text">
            {selectedService?.description}
          </p>
        </div>
        
        <div className="mbg-card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="mbg-subtitle mb-6">Select a Date</h3>
              <Calendar
                selected={date}
                onDayClick={handleDateChange}
                disabled={{
                  before: new Date(),
                }}
                className="mbg-calendar"
              />
            </div>

            <div>
              <h3 className="mbg-subtitle mb-6">Select a Time</h3>
              {date ? (
                <div className="space-y-4">
                  <p className="mbg-small-text mb-4">
                    Available time slots for {format(date, "MMMM d, yyyy")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={cn(
                          "mbg-button-outline text-center py-3 px-4 rounded-lg transition-all",
                          selectedTimeSlot === slot.time && "mbg-btn mbg-btn-primary",
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!slot.available}
                        onClick={() => handleTimeSlotSelect(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mbg-body-text text-gray-500">
                  Please select a date first
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mbg-card-footer">
          <div className="mbg-card mb-6">
            <h3 className="mbg-subtitle mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="mbg-body-text">Service:</span>
                <span className="mbg-body-text font-medium">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="mbg-body-text">Duration:</span>
                <span className="mbg-body-text font-medium">{selectedService?.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="mbg-body-text">Date:</span>
                <span className="mbg-body-text font-medium">
                  {date ? format(date, "MMMM d, yyyy") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="mbg-body-text">Time:</span>
                <span className="mbg-body-text font-medium">
                  {selectedTimeSlot || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="mbg-body-text font-bold">Price:</span>
                <span className="mbg-body-text font-bold">${selectedService?.price}</span>
              </div>
            </div>
          </div>

          <button
            className="mbg-btn mbg-btn-primary mbg-btn-large w-full"
            disabled={!date || !selectedTimeSlot}
            onClick={handleBookingConfirm}
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" aria-describedby="booking-calendar-dialog-desc">
          <div id="booking-calendar-dialog-desc" style={{ display: 'none' }}>Book a service and select your preferred time slot.</div>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please provide your information to complete the booking for {selectedService?.title} on {date && format(date, "MMMM d, yyyy")} at {selectedTimeSlot}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                placeholder="Any special requests or additional information..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              className="mbg-btn mbg-btn-primary w-full"
              onClick={handlePayments}
              disabled={!formData.fullName || !formData.email || !formData.phone}
            >
              Payments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCalendar;
