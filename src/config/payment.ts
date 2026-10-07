// Universal Payment Configuration
export const PAYMENT_CONFIG = {
  // PayPal Configuration
  paypal: {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "REDACTED_PAYPAL_CLIENT_ID",
    currency: "USD",
    intent: "capture",
    environment: 'production' // Set to 'production' for live payments
  },
  
  // Stripe Configuration
  stripe: {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "REDACTED_STRIPE_PUBLIC_KEY",
    currency: "USD"
  },
  
  // General Payment Settings
  general: {
    currency: "USD",
    acceptedPaymentMethods: ['paypal', 'card'],
    minimumAmount: 1.00,
    maximumAmount: 10000.00
  }
};

// Service Categories with Universal Payment Support
export const SERVICE_CATEGORIES = {
  healing: {
    name: 'Healing Services',
    paymentMethods: ['paypal', 'card'],
    description: 'Individual healing sessions with Feq\'ad Wolde'
  },
  administrative: {
    name: 'Administrative Services', 
    paymentMethods: ['paypal', 'card'],
    description: 'Business consultation with Mesq\'al Kebra'
  },
  retreat: {
    name: 'Custom Retreats',
    paymentMethods: ['paypal', 'card'],
    description: 'Multi-day healing retreat experiences'
  },
  workshop: {
    name: 'Community Workshops',
    paymentMethods: ['paypal', 'card'],
    description: 'Group learning and healing workshops'
  }
};

// Booking Data Interface
export interface UniversalBookingData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  practitionerName: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  category?: keyof typeof SERVICE_CATEGORIES;
}

// Payment Methods Interface
export interface PaymentMethodConfig {
  id: 'paypal' | 'card';
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay securely with your credit or debit card',
    enabled: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🟦',
    description: 'Pay with PayPal account or cards through PayPal',
    enabled: true
  }
];

// Payment Success Response Interface
export interface PaymentSuccessData {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  bookingData: UniversalBookingData;
  processedAt?: string;
  paypalOrderId?: string;
  payerInfo?: {
    email?: string;
    name?: string;
    payerId?: string;
  };
  cardInfo?: {
    last4: string;
    brand: string;
    expiryMonth?: string;
    expiryYear?: string;
  };
}

// Validation Functions
export const validatePaymentAmount = (amount: number): boolean => {
  return amount >= PAYMENT_CONFIG.general.minimumAmount && 
         amount <= PAYMENT_CONFIG.general.maximumAmount;
};

export const validateBookingData = (booking: UniversalBookingData): boolean => {
  return !!(
    booking.serviceId &&
    booking.serviceName &&
    booking.servicePrice > 0 &&
    booking.practitionerName &&
    booking.name &&
    booking.email &&
    booking.phone
  );
};

// Export legacy PayPal config for backward compatibility
export const PAYPAL_CONFIG = PAYMENT_CONFIG.paypal;
