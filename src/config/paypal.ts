// PayPal configuration
export const PAYPAL_CONFIG = {
  // Use the PayPal Client ID from environment variables (Vite uses import.meta.env)
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "REDACTED_PAYPAL_CLIENT_ID",
  currency: "USD",
  intent: "capture",
  // Set to 'production' since you provided live credentials
  environment: 'production'
};

// PayPal payment data interface
export interface PayPalPaymentData {
  amount: number;
  currency: string;
  description: string;
  custom_id?: string;
  invoice_id?: string;
}
