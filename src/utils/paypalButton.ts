// src/utils/paypalButton.ts
// Dynamically load PayPal JS SDK and render a PayPal button
interface PayPalDetails {
  id?: string;
  status?: string;
  payer?: {
    name?: { given_name: string; surname: string };
    email_address?: string;
  };
  [key: string]: unknown;
}

interface PayPalData {
  orderID: string;
  [key: string]: unknown;
}

export function renderPayPalButton({
  amount,
  currency = 'USD',
  onApprove,
  onError,
  containerId = 'paypal-button-container',
  clientId
}: {
  amount: string | number,
  currency?: string,
  onApprove: (details: PayPalDetails, data: PayPalData) => void,
  onError?: (err: Record<string, unknown>) => void,
  containerId?: string,
  clientId: string
}) {
  // Remove any existing button
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  // Load PayPal SDK if not already loaded
  if (!document.getElementById('paypal-sdk')) {
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.onload = () => renderButton();
    document.body.appendChild(script);
  } else {
    renderButton();
  }

  function renderButton() {
    interface PayPalWindow {
      paypal?: {
        Buttons: (config: Record<string, unknown>) => { render: (selector: string) => void };
      };
    }
    const win = window as unknown as PayPalWindow;
    if (win.paypal) {
      win.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: function(data: unknown, actions: { order: { create: (order: Record<string, unknown>) => unknown } }) {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }]
          });
        },
        onApprove: function(data: PayPalData, actions: { order: { capture: () => Promise<unknown> } }) {
          return actions.order.capture().then(function(details: unknown) {
            onApprove(details as PayPalDetails, data);
          });
        },
        onError: function(err: Record<string, unknown>) {
          if (onError) onError(err);
        }
      }).render(`#${containerId}`);
    }
  }
}
