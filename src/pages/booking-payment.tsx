import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../components/ui/use-toast';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../data/seoConfig';
import PayPalPayment from '../components/payment/PayPalPayment';
import { PAYMENT_CONFIG, UniversalBookingData } from '../config/payment';
import { PaymentService, BookingEmailService, BookingCalendarService } from '../services/paymentService';

type BookingDetails = UniversalBookingData;

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const BookingPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    state: '',    zipCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  useEffect(() => {
    // First check if data is passed via navigation state (from Plan Retreat page)
    if (location.state) {
      const stateData = location.state as BookingDetails;
      if (stateData.serviceId && stateData.serviceName) {
        setBookingDetails({
          ...stateData,
          name: stateData.name || 'Guest',
          email: stateData.email || '',
          phone: stateData.phone || '',
          practitionerName: stateData.practitionerName || 'Portals of Samadhi',
          date: stateData.date || 'To be confirmed',
          time: stateData.time || 'To be confirmed',
          serviceDuration: stateData.serviceDuration || '',
        });
        return;
      }
    }

    // Otherwise, extract booking details from URL parameters (from other booking flows)
    const details: BookingDetails = {
      serviceId: searchParams.get('serviceId') || '',
      serviceName: searchParams.get('serviceName') || '',
      servicePrice: parseFloat(searchParams.get('servicePrice') || '0'),
      serviceDuration: searchParams.get('serviceDuration') || '',
      practitionerName: searchParams.get('practitionerName') || 'Portals of Samadhi',
      date: searchParams.get('date') || 'To be confirmed',
      time: searchParams.get('time') || 'To be confirmed',
      name: searchParams.get('name') || 'Guest',
      email: searchParams.get('email') || '',
      phone: searchParams.get('phone') || '',
      notes: searchParams.get('notes') || undefined
    };

    // One-click packages only need service identity + price; contact can be refined here
    if (!details.serviceId || !details.serviceName) {
      navigate('/'); // Redirect to home if missing required data
      return;
    }

    // Check if this is a free consultation (price = 0) - shouldn't reach payment page
    if (details.servicePrice === 0) {
      toast({
        title: "Invalid Access",
        description: "Free consultations don't require payment. Please book through the consultation option.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setBookingDetails(details);
  }, [searchParams, location.state, navigate]);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    return (
      paymentForm.cardNumber.replace(/\s/g, '').length >= 13 &&
      paymentForm.expiryDate.length === 5 &&
      paymentForm.cvv.length >= 3 &&
      paymentForm.cardholderName.trim() !== '' &&
      paymentForm.billingAddress.trim() !== '' &&
      paymentForm.city.trim() !== '' &&
      paymentForm.state.trim() !== '' &&
      paymentForm.zipCode.trim() !== ''
    );
  };
  const handleSubmitPayment = async () => {
    if (!isFormValid() || !bookingDetails) return;

    setIsProcessing(true);

    try {
      // Validate booking data
      if (!PaymentService.validateBookingData(bookingDetails)) {
        throw new Error('Invalid booking data');
      }

      if (!PaymentService.validateAmount(bookingDetails.servicePrice)) {
        throw new Error('Invalid payment amount');
      }

      // Process card payment
      const paymentData = PaymentService.processCardSuccess(
        bookingDetails.servicePrice, 
        bookingDetails
      );

      // Create booking record
      const bookingCreated = await PaymentService.createBooking(paymentData);
      
      if (!bookingCreated) {
        throw new Error('Failed to create booking');
      }

      // Send confirmation email (optional, don't fail if it doesn't work)
      try {
        await BookingEmailService.sendConfirmationEmail(paymentData);
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
      }

      // Create calendar event (optional, don't fail if it doesn't work)
      try {
        await BookingCalendarService.createCalendarEvent(paymentData);
      } catch (calendarError) {
        console.warn('Failed to create calendar event:', calendarError);
      }

      // Redirect to success page
      navigate('/booking-success', {
        state: {
          bookingDetails,
          paymentConfirmation: paymentData.transactionId,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  // PayPal payment handlers
  const handlePayPalSuccess = async (details: unknown) => {
    setIsProcessing(true);
    try {
      console.log('PayPal payment successful:', details);
      
      if (!bookingDetails) {
        throw new Error('Missing booking details');
      }

      // Process PayPal payment data
      const paymentData = PaymentService.processPayPalSuccess(details as Record<string, unknown>, bookingDetails);

      // Create booking record
      const bookingCreated = await PaymentService.createBooking(paymentData);
      
      if (!bookingCreated) {
        throw new Error('Failed to create booking');
      }

      // Send confirmation email (optional)
      try {
        await BookingEmailService.sendConfirmationEmail(paymentData);
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
      }

      // Create calendar event (optional)
      try {
        await BookingCalendarService.createCalendarEvent(paymentData);
      } catch (calendarError) {
        console.warn('Failed to create calendar event:', calendarError);
      }

      // Redirect to success page
      navigate('/booking-success', {
        state: {
          bookingDetails,
          paymentConfirmation: paymentData.transactionId,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount
        }
      });
    } catch (error) {
      console.error('Booking creation failed:', error);
      alert(`Payment successful but booking creation failed: ${error instanceof Error ? error.message : 'Please contact support.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (error: unknown) => {
    console.error('PayPal payment error:', error);
    alert('PayPal payment failed. Please try again or use a different payment method.');
  };

  const handlePayPalCancel = () => {
    console.log('PayPal payment cancelled by user');
  };

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{`
        @media (max-width: 640px) {
          .payment-card-content,
          .payment-card-content *,
          .payment-tabs-content,
          .payment-tabs-content * {
            overflow: hidden !important;
            overflow-x: hidden !important;
            overflow-y: hidden !important;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .payment-card-content::-webkit-scrollbar,
          .payment-card-content *::-webkit-scrollbar,
          .payment-tabs-content::-webkit-scrollbar,
          .payment-tabs-content *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        }
      `}</style>
      <SEO
        title={PAGE_SEO["/booking-payment"].title}
        description={PAGE_SEO["/booking-payment"].description}
        image={PAGE_SEO["/booking-payment"].image}
        imageAlt={PAGE_SEO["/booking-payment"].imageAlt}
        url="/booking"
        noindex
        nofollow
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Booking Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-green-700">{bookingDetails.serviceName}</h3>
                  <p className="text-gray-600">with {bookingDetails.practitionerName}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Complete Service Package
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{bookingDetails.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{bookingDetails.serviceDuration}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span>{bookingDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-sm">{bookingDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{bookingDetails.phone}</span>
                  </div>
                </div>
                
                {bookingDetails.notes && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium">What&apos;s included / details:</span>
                      <p className="mt-1 text-gray-600 text-sm whitespace-pre-line">
                        {bookingDetails.notes}
                      </p>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-base">
                    <span>Package Price:</span>
                    <span>${bookingDetails.servicePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Processing Fee:</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-green-700">
                    <span>Total:</span>
                    <span>${bookingDetails.servicePrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    💳 Secure payment • 100% satisfaction guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 payment-card-content">
                  <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">💳 Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">🟦 PayPal</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="space-y-4 mt-6 payment-tabs-content">
                    {/* Card Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Card Details</h4>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          type="text"
                          placeholder="John Doe"
                          value={paymentForm.cardholderName}
                          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Billing Address</h4>
                      
                      <div>
                        <Label htmlFor="billingAddress">Address</Label>
                        <Input
                          id="billingAddress"
                          type="text"
                          placeholder="123 Main St"
                          value={paymentForm.billingAddress}
                          onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="New York"
                            value={paymentForm.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            type="text"
                            placeholder="NY"
                            value={paymentForm.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          type="text"
                          placeholder="10001"
                          value={paymentForm.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, ''))}
                          maxLength={5}
                        />
                      </div>
                    </div>

                    {/* Payment Buttons for Card */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmitPayment}
                        disabled={!isFormValid() || isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? 'Processing...' : `Pay $${bookingDetails.servicePrice.toFixed(2)}`}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="paypal" className="space-y-4 mt-6 payment-tabs-content">
                    <div className="space-y-4">
                      <h4 className="font-medium">PayPal Payment</h4>
                      <p className="text-gray-600">
                        Pay securely using your PayPal account or credit/debit card through PayPal.
                      </p>
                        <PayPalPayment
                        amount={bookingDetails.servicePrice}
                        currency={PAYMENT_CONFIG.paypal.currency}
                        description={`${bookingDetails.serviceName} - ${bookingDetails.practitionerName}`}
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        onCancel={handlePayPalCancel}
                        disabled={isProcessing}
                      />
                      
                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => navigate(-1)}
                          className="w-full"
                        >
                          Back
                        </Button>
                      </div>
                    </div>                  </TabsContent>
                </Tabs>
                
                <p className="text-sm text-gray-500 text-center">
                  Your payment information is secure and encrypted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentPage;
