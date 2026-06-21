import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { createCalendarEvent } from "../utils/calendarService";
import { sendBookingConfirmation, sendEmail } from "../utils/emailService";
import { TEAM_EMAIL } from "../config/email";
import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  interface BookingDetails {
    serviceName: string;
    practitionerName: string;
    date: string;
    timeSlot: string;
    serviceDuration?: string;
    formData?: {
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
    };
  }
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const processBookingAfterPayment = async () => {
      try {
        // Get parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const paymentMethod = urlParams.get('payment');
        
        // For PayPal payments, we don't have session_id but we have payment=paypal
        if (!sessionId && paymentMethod !== 'paypal') {
          throw new Error('No session ID or payment method found in URL');
        }
        
        // Retrieve pending booking from localStorage
        const pendingBookingJson = localStorage.getItem('pendingBooking');
        if (!pendingBookingJson) {
          throw new Error('No pending booking information found');
        }
        
        const pendingBooking = JSON.parse(pendingBookingJson);
        setBookingDetails(pendingBooking);
        
        // For Stripe payments, verify payment with server
        if (sessionId && paymentMethod !== 'paypal') {
          const paymentResponse = await axios.get(`/api/verify-payment?session_id=${sessionId}`);
          
          if (!paymentResponse.data.success) {
            throw new Error('Payment verification failed');
          }
        }
        
        // For PayPal payments, the booking is already processed in booking.ts
        // We just need to handle the success flow here
        
        // Extract booking details
        const {
          serviceName,
          practitionerName,
          date: dateString,
          timeSlot,
          formData
        } = pendingBooking;
        
        const date = new Date(dateString);
        
        // Calculate time details
        const [timeValue, period] = timeSlot.split(' ');
        const [hours, minutes] = timeValue.split(':').map(Number);
        
        // Convert to 24-hour format
        let hours24 = hours;
        if (period === 'PM' && hours !== 12) hours24 += 12;
        if (period === 'AM' && hours === 12) hours24 = 0;
        
        // Create start time
        const startTime = new Date(date);
        startTime.setHours(hours24, minutes, 0, 0);
        
        // Extract duration (e.g., "45 minutes" -> 45)
        const durationMatch = pendingBooking.serviceDuration 
          ? pendingBooking.serviceDuration.match(/(\d+)/)
          : [0, 30]; // Default to 30 minutes if not found
        const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;
        
        // Calculate end time
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        
        // Only create calendar event and send emails for Stripe payments
        // PayPal payments are already handled in the backend
        if (sessionId && paymentMethod !== 'paypal') {
          // Create calendar event
          await createCalendarEvent({
            summary: `${serviceName} - ${formData.name}`,
            description: `Service: ${serviceName}
Practitioner: ${practitionerName}
Client: ${formData.name}
Phone: ${formData.phone || 'Not provided'}
Notes: ${formData.notes || 'None'}
Payment: Completed`,
            start: startTime,
            end: endTime,
            attendeeEmail: formData.email,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
          
          // Send confirmation email to user
          await sendBookingConfirmation(
            formData.email,
            serviceName,
            practitionerName,
            date,
            timeSlot,
            true // payment completed
          );

          // Send notification email to team
          await sendEmail({
            to: TEAM_EMAIL,
            subject: `New Booking - ${serviceName}`,
            html: `
              <h2>New Booking Received</h2>
              <ul>
                <li><b>Service:</b> ${serviceName}</li>
                <li><b>Practitioner:</b> ${practitionerName}</li>
                <li><b>Date:</b> ${date.toLocaleDateString()}</li>
                <li><b>Time:</b> ${timeSlot}</li>
                <li><b>Name:</b> ${formData.name}</li>
                <li><b>Email:</b> ${formData.email}</li>
                <li><b>Phone:</b> ${formData.phone}</li>
                <li><b>Notes:</b> ${formData.notes || 'None'}</li>
                <li><b>Payment Status:</b> Completed</li>
              </ul>
            `
          });
        }

        // Clear the pending booking
        localStorage.removeItem('pendingBooking');

        setIsComplete(true);
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
          navigate('/');
        }, 5000);
        toast({
          title: "Booking Complete",
          description: "Your booking was successfully completed and added to the calendar.",
        });
      } catch (error) {
        console.error('Error processing booking after payment:', error);
        toast({
          title: "Booking Error",
          description: "There was an error completing your booking. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    processBookingAfterPayment();
  }, [navigate]);
  return (
    <>
      <SEO
        title={PAGE_SEO["/booking-success"].title}
        description={PAGE_SEO["/booking-success"].description}
        image={PAGE_SEO["/booking-success"].image}
        imageAlt={PAGE_SEO["/booking-success"].imageAlt}
        url="/booking-success"
        noindex
        nofollow
      />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-6 pb-8 text-center">
              {isProcessing ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-green-700 mb-2">Finalizing Your Booking</h1>
                  <p className="text-gray-600">
                    Please wait while we confirm your payment and complete your booking...
                  </p>
                </>
              ) : showThankYou ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-green-700 mb-2">Thank You for Booking With Us!</h1>
                  <p className="text-gray-600 mb-6">
                    Your payment was successful and your appointment has been scheduled.<br/>
                    You will be redirected to the homepage in 5 seconds.
                  </p>
                  {bookingDetails && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <h2 className="font-semibold text-lg mb-2">Booking Details</h2>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Service:</span> {bookingDetails.serviceName}</p>
                        <p><span className="font-medium">Practitioner:</span> {bookingDetails.practitionerName}</p>
                        <p><span className="font-medium">Date:</span> {new Date(bookingDetails.date).toLocaleDateString()}</p>
                        <p><span className="font-medium">Time:</span> {bookingDetails.timeSlot}</p>
                      </div>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm mb-6">
                    A confirmation email has been sent to {bookingDetails?.formData?.email}.
                  </p>
                </>
              ) : isComplete ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
                  <p className="text-gray-600 mb-6">
                    Your payment was successful and your appointment has been scheduled.
                  </p>
                  {bookingDetails && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <h2 className="font-semibold text-lg mb-2">Booking Details</h2>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Service:</span> {bookingDetails.serviceName}</p>
                        <p><span className="font-medium">Practitioner:</span> {bookingDetails.practitionerName}</p>
                        <p><span className="font-medium">Date:</span> {new Date(bookingDetails.date).toLocaleDateString()}</p>
                        <p><span className="font-medium">Time:</span> {bookingDetails.timeSlot}</p>
                      </div>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm mb-6">
                    A confirmation email has been sent to {bookingDetails?.formData?.email}.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Return to Home
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-red-700 mb-2">Something Went Wrong</h1>
                  <p className="text-gray-600 mb-6">
                    We encountered an error while processing your booking. Please contact support for assistance.
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Return to Home
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="border-indigo-600 text-indigo-600"
                    >
                      Try Again
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>      </div>
    </div>
    </>
  );
};

export default BookingSuccessPage;
