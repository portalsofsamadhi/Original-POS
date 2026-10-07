import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { PAYMENT_CONFIG } from "../../config/payment";
import ErrorHandlingService from "../../services/errorHandling";

interface PayPalPaymentProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess: (details: unknown) => void;
  onError: (error: unknown) => void;
  onCancel?: () => void;
  disabled?: boolean;
  serviceName?: string;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  currency = PAYMENT_CONFIG.paypal.currency,
  description = "Portals of Samadhi Service Booking",
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  serviceName
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    try {
      // Validate amount before creating order
      if (amount <= 0 || amount > PAYMENT_CONFIG.general.maximumAmount) {
        throw new Error(`Invalid payment amount: $${amount}`);
      }

      ErrorHandlingService.logError('Creating PayPal order', {
        amount,
        currency,
        serviceName,
        description
      }, 'info');

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount.toFixed(2),
              currency_code: currency
            },
            description: description,
            custom_id: `pos-${Date.now()}`, // For tracking
            invoice_id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` // Unique invoice ID
          }
        ],
        intent: "CAPTURE",
        application_context: {
          brand_name: "Portals of Samadhi",
          locale: "en-US",
          landing_page: "BILLING",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW"
        }
      });
    } catch (error) {
      ErrorHandlingService.handlePaymentError(error, 'PayPal', amount);
      onError(error);
      return Promise.reject(error);
    }
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    try {
      if (!actions.order) {
        throw new Error("No PayPal order actions available");
      }

      ErrorHandlingService.logError('Processing PayPal payment approval', {
        orderId: data.orderID,
        amount,
        serviceName
      }, 'info');

      const details = await actions.order.capture();
      
      // Validate capture response
      if (!details || !details.id) {
        throw new Error("Invalid PayPal capture response");
      }

      // Check if payment was completed
      if (details.status !== 'COMPLETED') {
        throw new Error(`PayPal payment status: ${details.status}`);
      }

      ErrorHandlingService.logError('PayPal payment completed successfully', {
        transactionId: details.id,
        orderId: data.orderID,
        amount,
        status: details.status,
        serviceName
      }, 'info');

      onSuccess(details);
    } catch (error) {
      ErrorHandlingService.handlePaymentError(error, 'PayPal', amount);
      onError(error);
    }
  };

  const handleError = (error: unknown) => {
    ErrorHandlingService.handlePaymentError(error, 'PayPal', amount);
    // Provide user-friendly error messages
    let userMessage = 'Payment failed. Please try again.';
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: string }).message === 'string'
    ) {
      const msg = (error as { message: string }).message;
      if (msg.includes('INSTRUMENT_DECLINED')) {
        userMessage = 'Your payment method was declined. Please try a different payment method.';
      } else if (msg.includes('PAYER_ACTION_REQUIRED')) {
        userMessage = 'Additional action required. Please complete the payment in the PayPal window.';
      } else if (msg.includes('PAYPAL_REQUEST_ID_REQUIRED')) {
        userMessage = 'Payment session expired. Please refresh and try again.';
      }
    }
    onError({ ...(typeof error === 'object' && error !== null ? error : {}), userMessage });
  };

  const handleCancel = () => {
    ErrorHandlingService.logError('PayPal payment cancelled by user', {
      amount,
      serviceName
    }, 'info');
    
    onCancel?.();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Secure Payment</p>
            <p className="text-xs text-blue-600">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
      
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleError}
        onCancel={handleCancel}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 50
        }}
        disabled={disabled}
        forceReRender={[amount, currency, disabled]} // Re-render when these props change
      />
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>💳 Secure checkout powered by PayPal</p>
        <p>🔒 SSL encrypted • 🛡️ Buyer protection included</p>
      </div>
    </div>
  );
};

export default PayPalPayment;
