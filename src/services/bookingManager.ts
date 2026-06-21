import { UniversalBookingData, PaymentSuccessData } from '../config/payment';

// Booking Management Service
export class BookingManager {
  private static STORAGE_KEY = 'portals_bookings';
  // Save booking to localStorage
  static saveBooking(booking: PaymentSuccessData): void {
    const bookings = this.getAllBookings();
    const newBooking = {
      ...booking,
      id: this.generateBookingId(),
      createdAt: new Date().toISOString(),
      status: booking.status // Use the existing status from PaymentSuccessData
    };
    
    bookings.push(newBooking);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }
  
  // Get all bookings from localStorage
  static getAllBookings(): Array<PaymentSuccessData & { id: string; createdAt: string; status: string }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  }
  
  // Get booking by ID
  static getBookingById(id: string) {
    const bookings = this.getAllBookings();
    return bookings.find(booking => booking.id === id);
  }
  
  // Generate unique booking ID
  static generateBookingId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `POS-${timestamp}-${random}`.toUpperCase();
  }
  
  // Get bookings by email (for user lookup)
  static getBookingsByEmail(email: string) {
    const bookings = this.getAllBookings();
    return bookings.filter(booking => 
      booking.bookingData.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  // Get upcoming bookings (within next 30 days)
  static getUpcomingBookings() {
    const bookings = this.getAllBookings();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingData.date);
      return bookingDate >= new Date() && bookingDate <= thirtyDaysFromNow;
    });
  }
  
  // Export bookings to CSV (for admin use)
  static exportBookingsToCSV(): string {
    const bookings = this.getAllBookings();
    if (bookings.length === 0) return '';
    
    const headers = [
      'Booking ID', 'Service Name', 'Client Name', 'Email', 'Phone', 
      'Date', 'Time', 'Duration', 'Practitioner', 'Amount', 
      'Payment Method', 'Transaction ID', 'Status', 'Created At'
    ];
    
    const rows = bookings.map(booking => [
      booking.id,
      booking.bookingData.serviceName,
      booking.bookingData.name,
      booking.bookingData.email,
      booking.bookingData.phone,
      booking.bookingData.date,
      booking.bookingData.time,
      booking.bookingData.serviceDuration,
      booking.bookingData.practitionerName,
      booking.amount,
      booking.paymentMethod,
      booking.transactionId,
      booking.status,
      booking.createdAt
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
}

// Service-specific booking validators
export class BookingValidators {
  
  // Validate individual service booking
  static validateIndividualService(booking: UniversalBookingData): string[] {
    const errors: string[] = [];
    
    if (!booking.serviceName) errors.push('Service name is required');
    if (!booking.practitionerName) errors.push('Practitioner name is required');
    if (booking.servicePrice <= 0) errors.push('Service price must be greater than 0');
    if (!booking.date) errors.push('Date is required');
    if (!booking.time) errors.push('Time is required');
    
    return errors;
  }
  
  // Validate retreat booking
  static validateRetreatBooking(booking: UniversalBookingData): string[] {
    const errors = this.validateIndividualService(booking);
    
    // Additional retreat-specific validations
    if (booking.servicePrice < 100) errors.push('Retreat price seems too low');
    if (!booking.serviceDuration || !booking.serviceDuration.includes('day')) {
      errors.push('Retreat duration must be specified in days');
    }
    
    return errors;
  }
  
  // Validate workshop booking
  static validateWorkshopBooking(booking: UniversalBookingData): string[] {
    const errors = this.validateIndividualService(booking);
    
    // Additional workshop-specific validations
    if (booking.servicePrice < 25) errors.push('Workshop price seems too low');
    
    return errors;
  }
  
  // Universal booking validation
  static validateBooking(booking: UniversalBookingData): string[] {
    const commonErrors: string[] = [];
    
    // Basic required fields
    if (!booking.name?.trim()) commonErrors.push('Client name is required');
    if (!booking.email?.trim()) commonErrors.push('Email is required');
    if (!booking.phone?.trim()) commonErrors.push('Phone number is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (booking.email && !emailRegex.test(booking.email)) {
      commonErrors.push('Invalid email format');
    }
    
    // Phone validation (basic)
  const phoneRegex = /^[+]?[1-9][\d]{3,14}$/;
    if (booking.phone && !phoneRegex.test(booking.phone.replace(/\s+/g, ''))) {
      commonErrors.push('Invalid phone number format');
    }
    
    // Date validation
    if (booking.date) {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        commonErrors.push('Booking date cannot be in the past');
      }
    }
    
    // Service-specific validation
    let serviceErrors: string[] = [];
    if (booking.serviceId?.includes('retreat')) {
      serviceErrors = this.validateRetreatBooking(booking);
    } else if (booking.serviceId?.includes('workshop')) {
      serviceErrors = this.validateWorkshopBooking(booking);
    } else {
      serviceErrors = this.validateIndividualService(booking);
    }
    
    return [...commonErrors, ...serviceErrors];
  }
}

// Booking analytics service
export class BookingAnalytics {
  
  // Get booking statistics
  static getBookingStats() {
    const bookings = BookingManager.getAllBookings();
    
    return {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + booking.amount, 0),
      averageBookingValue: bookings.length > 0 
        ? bookings.reduce((sum, booking) => sum + booking.amount, 0) / bookings.length 
        : 0,
      paymentMethodBreakdown: this.getPaymentMethodBreakdown(bookings),
      serviceBreakdown: this.getServiceBreakdown(bookings),
      monthlyBookings: this.getMonthlyBookings(bookings)
    };
  }
  
  private static getPaymentMethodBreakdown(bookings: Array<PaymentSuccessData & { id: string; createdAt: string; status: string; bookingData: UniversalBookingData; paymentMethod: string; amount: number; }>) {
    const breakdown: Record<string, number> = {};
    bookings.forEach(booking => {
      breakdown[booking.paymentMethod] = (breakdown[booking.paymentMethod] || 0) + 1;
    });
    return breakdown;
  }
  
  private static getServiceBreakdown(bookings: Array<PaymentSuccessData & { id: string; createdAt: string; status: string; bookingData: UniversalBookingData; paymentMethod: string; amount: number; }>) {
    const breakdown: Record<string, number> = {};
    bookings.forEach(booking => {
      const service = booking.bookingData.serviceName;
      breakdown[service] = (breakdown[service] || 0) + 1;
    });
    return breakdown;
  }
  
  private static getMonthlyBookings(bookings: Array<PaymentSuccessData & { id: string; createdAt: string; status: string; bookingData: UniversalBookingData; paymentMethod: string; amount: number; }>) {
    const monthly: Record<string, number> = {};
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).toISOString().slice(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + 1;
    });
    return monthly;
  }
}
