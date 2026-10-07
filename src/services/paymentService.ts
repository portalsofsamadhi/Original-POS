interface PayPalPurchaseUnit {
  amount: {
    value: string;
    currency_code: string;
  };
}

interface PayPalPayerName {
  given_name: string;
  surname: string;
}

interface PayPalPayer {
  email_address?: string;
  name?: PayPalPayerName;
}

interface PayPalDetails {
  id: string;
  purchase_units: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
}

interface CardDetails {
  last4: string;
  brand: string;
  exp_month?: string;
  exp_year?: string;
}
import { PAYMENT_CONFIG, UniversalBookingData, PaymentSuccessData } from '../config/payment';
import { BookingManager, BookingValidators } from './bookingManager';
import ErrorHandlingService, { APIErrorHandler } from './errorHandling';
import { sendPaymentReceipt } from '../utils/emailService';

// Universal Payment Service
export class PaymentService {
  
  // Validate payment data
  static validateBookingData(bookingData: UniversalBookingData): { isValid: boolean; errors: string[] } {
    const errors = BookingValidators.validateBooking(bookingData);
    if (errors.length > 0) {
      ErrorHandlingService.logError('Booking validation failed', { 
        errors,
        bookingData: {
          serviceName: bookingData.serviceName,
          date: bookingData.date,
          email: bookingData.email?.replace(/(.{2}).*@/, '$1***@') // Mask email
        }
      }, 'warning');
    }
    return { isValid: errors.length === 0, errors };
  }

  // Validate payment amount with enhanced checks
  static validateAmount(amount: number, serviceName?: string): { isValid: boolean; message?: string } {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return { isValid: false, message: 'Invalid amount format' };
    }
    
    if (amount < PAYMENT_CONFIG.general.minimumAmount) {
      return { isValid: false, message: `Amount must be at least $${PAYMENT_CONFIG.general.minimumAmount}` };
    }
    
    if (amount > PAYMENT_CONFIG.general.maximumAmount) {
      return { isValid: false, message: `Amount cannot exceed $${PAYMENT_CONFIG.general.maximumAmount}` };
    }
    
    // Service-specific validation
    if (serviceName) {
      if (serviceName.toLowerCase().includes('retreat') && amount < 100) {
        return { isValid: false, message: 'Retreat bookings must be at least $100' };
      }
      
      if (serviceName.toLowerCase().includes('consultation') && amount > 500) {
        ErrorHandlingService.logError('Unusually high consultation fee', {
          amount,
          serviceName
        }, 'warning');
      }
    }
    
    return { isValid: true };
  }

  // Process PayPal payment success with enhanced validation
  static processPayPalSuccess(paypalDetails: Record<string, unknown>, bookingData: UniversalBookingData): PaymentSuccessData {
    try {
      // Validate PayPal response structure
  const details = paypalDetails as unknown as PayPalDetails;
      const id = details.id;
      const purchase_units = details.purchase_units;
      if (!id || !purchase_units?.[0]?.amount) {
        throw new Error('Invalid PayPal response structure');
      }
      const amount = parseFloat(purchase_units[0].amount.value);
      const currency = purchase_units[0].amount.currency_code;
      // Validate amount matches booking
      if (Math.abs(amount - bookingData.servicePrice) > 0.01) {
        ErrorHandlingService.logError('Payment amount mismatch', {
          paypalAmount: amount,
          bookingAmount: bookingData.servicePrice,
          transactionId: id
        }, 'error');
      }
      const payer = details.payer;
      const paymentData: PaymentSuccessData = {
        transactionId: id,
        amount: amount,
        currency: currency,
        paymentMethod: 'PayPal',
        status: 'completed',
        bookingData,
        processedAt: new Date().toISOString(),
        paypalOrderId: id,
        payerInfo: {
          email: payer?.email_address,
          name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}`.trim() : undefined
        }
      };
      
      ErrorHandlingService.logError('PayPal payment processed successfully', {
        transactionId: paypalDetails.id,
        amount: amount,
        serviceName: bookingData.serviceName
      }, 'info');
      
      return paymentData;
    } catch (error) {
      ErrorHandlingService.handlePaymentError(error, 'PayPal', bookingData.servicePrice);
      throw error;
    }
  }

  // Process Card payment success (enhanced)
  static processCardSuccess(amount: number, bookingData: UniversalBookingData, cardDetails?: Record<string, unknown>): PaymentSuccessData {
    try {
      const transactionId = `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
  const card = cardDetails as unknown as CardDetails;
      const paymentData: PaymentSuccessData = {
        transactionId,
        amount: amount,
        currency: PAYMENT_CONFIG.general.currency,
        paymentMethod: 'Credit Card',
        status: 'completed',
        bookingData,
        processedAt: new Date().toISOString(),
        cardInfo: cardDetails ? {
          last4: card.last4,
          brand: card.brand,
          expiryMonth: card.exp_month,
          expiryYear: card.exp_year
        } : undefined
      };
      
      ErrorHandlingService.logError('Card payment processed successfully', {
        transactionId,
        amount,
        serviceName: bookingData.serviceName,
        cardBrand: cardDetails?.brand
      }, 'info');
      
      return paymentData;
    } catch (error) {
      ErrorHandlingService.handlePaymentError(error, 'Credit Card', amount);
      throw error;
    }
  }

  // Send booking data to backend with retry logic
  static async createBooking(paymentData: PaymentSuccessData): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    try {
      // Save to booking manager (localStorage backup) first
      BookingManager.saveBooking(paymentData);
      
      const bookingPayload = {
        ...paymentData.bookingData,
        paymentDetails: {
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethod: paymentData.paymentMethod,
          status: paymentData.status,
          processedAt: paymentData.processedAt
        },
        confirmationNumber: this.generateConfirmationNumber(),
        createdAt: new Date().toISOString(),
        source: 'website'
      };
      
      // Try to send to backend
      const response = await ErrorHandlingService.withRetry(
        async () => {
          return await APIErrorHandler.makeRequest<{ success: boolean; bookingId: string }>(
            '/api/bookings',
            {
              method: 'POST',
              body: JSON.stringify(bookingPayload),
            }
          );
        },
        3,
        2000,
        {
          service: 'booking-creation',
          transactionId: paymentData.transactionId
        }
      );
      
      if (response.success) {
        // Send confirmation email
        this.sendConfirmationEmails(paymentData);
        
        ErrorHandlingService.logError('Booking created successfully', {
          bookingId: response.bookingId,
          transactionId: paymentData.transactionId
        }, 'info');
        
        return { success: true, bookingId: response.bookingId };
      } else {
        throw new Error('Backend booking creation failed');
      }
      
    } catch (error) {
  ErrorHandlingService.handleBookingError(error, paymentData.bookingData);
      
      // Still send confirmation emails since payment was successful and booking is saved locally
      try {
        await this.sendConfirmationEmails(paymentData);
      } catch (emailError) {
        ErrorHandlingService.handleEmailError(emailError, paymentData.bookingData.email, 'booking-confirmation');
      }
      
      // Return success since booking is saved locally and emails are attempted
      return { 
        success: true, 
        bookingId: `LOCAL-${Date.now()}`,
        error: 'Booking saved locally, backend sync will be attempted later'
      };
    }
  }

  // Send confirmation emails
  private static async sendConfirmationEmails(paymentData: PaymentSuccessData): Promise<void> {
    const { bookingData, transactionId, amount, paymentMethod } = paymentData;
    
    try {
      // Send booking confirmation
      await import('../utils/emailService').then(({ sendBookingConfirmation }) =>
        sendBookingConfirmation(
          bookingData.email,
          bookingData.serviceName,
          bookingData.practitionerName,
          new Date(bookingData.date),
          bookingData.time,
          true,
          transactionId,
          amount
        )
      );
      
      // Send payment receipt
      await sendPaymentReceipt(
        bookingData.email,
        transactionId,
        amount,
        paymentMethod,
        bookingData.serviceName
      );
      
    } catch (error) {
      ErrorHandlingService.handleEmailError(error, bookingData.email, 'booking-confirmation');
      // Don't throw here, as the booking is still successful
    }
  }

  // Get supported payment methods for a service category
  static getSupportedPaymentMethods(_category?: string): string[] {
    return PAYMENT_CONFIG.general.acceptedPaymentMethods;
  }

  // Format price for display
  static formatPrice(amount: number, currency = PAYMENT_CONFIG.general.currency): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Generate booking confirmation number
  static generateConfirmationNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `POS-${timestamp}-${random}`.toUpperCase();
  }

  // Validate payment before processing
  static validatePaymentRequest(bookingData: UniversalBookingData, amount: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate booking data
    const bookingValidation = this.validateBookingData(bookingData);
    if (!bookingValidation.isValid) {
      errors.push(...bookingValidation.errors);
    }
    
    // Validate amount
    const amountValidation = this.validateAmount(amount, bookingData.serviceName);
    if (!amountValidation.isValid) {
      errors.push(amountValidation.message!);
    }
    
    // Check amount matches booking price
    if (Math.abs(amount - bookingData.servicePrice) > 0.01) {
      errors.push('Payment amount does not match service price');
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

// Email service for booking confirmations
export class BookingEmailService {
  
  static async sendConfirmationEmail(paymentData: PaymentSuccessData): Promise<boolean> {
    try {
      const response = await APIErrorHandler.makeRequest<{ success: boolean }>(
        '/api/send-booking-confirmation',
        {
          method: 'POST',
          body: JSON.stringify({
            to: paymentData.bookingData.email,
            bookingData: paymentData.bookingData,
            paymentDetails: {
              transactionId: paymentData.transactionId,
              amount: paymentData.amount,
              paymentMethod: paymentData.paymentMethod
            }
          }),
        },
        3
      );
      
      return response.success;
    } catch (error) {
      ErrorHandlingService.handleEmailError(error, paymentData.bookingData.email, 'booking-confirmation');
      return false;
    }
  }
}

// Calendar service for booking appointments
export class BookingCalendarService {
  
  static async createCalendarEvent(paymentData: PaymentSuccessData): Promise<boolean> {
    try {
      const { bookingData } = paymentData;
      
      const response = await APIErrorHandler.makeRequest<{ success: boolean }>(
        '/api/calendar/create-event',
        {
          method: 'POST',
          body: JSON.stringify({
            summary: `${bookingData.serviceName} - ${bookingData.name}`,
            description: `
Service: ${bookingData.serviceName}
Client: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Duration: ${bookingData.serviceDuration}
Notes: ${bookingData.notes || 'None'}
Transaction ID: ${paymentData.transactionId}
Confirmation: ${PaymentService.generateConfirmationNumber()}
            `.trim(),
            start: bookingData.date,
            end: bookingData.date, // Calculate end time based on duration
            attendeeEmail: bookingData.email,
            timeZone: 'America/Los_Angeles', // Adjust for your timezone
            location: 'Oakland, California / Virtual',
            conferenceData: bookingData.serviceId?.includes('virtual') ? {
              createRequest: {
                requestId: `meeting-${paymentData.transactionId}`
              }
            } : undefined
          }),
        },
        2
      );
      
      if (response.success) {
        ErrorHandlingService.logError('Calendar event created', {
          transactionId: paymentData.transactionId,
          serviceName: bookingData.serviceName
        }, 'info');
      }
      
      return response.success;
    } catch (error) {
      ErrorHandlingService.logError(error, {
        service: 'calendar-integration',
        transactionId: paymentData.transactionId
      }, 'warning');
      return false; // Non-critical failure
    }
  }
}

// Default export for compatibility
export default PaymentService;
