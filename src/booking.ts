import { loadStripe } from '@stripe/stripe-js';
import { renderPayPalButton } from './utils/paypalButton';
import { PAYMENT_CONFIG } from './config/payment';

// Load Stripe - fallback to empty string if env var is not defined
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = loadStripe(stripePublicKey);

// Parse URL parameters to get booking details
const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('serviceId');
const serviceName = urlParams.get('serviceName');
const servicePrice = urlParams.get('servicePrice');
const serviceDuration = urlParams.get('serviceDuration');
const practitionerName = urlParams.get('practitionerName');
const date = urlParams.get('date');
const time = urlParams.get('time');
const customerName = urlParams.get('name');
const customerEmail = urlParams.get('email');
const customerPhone = urlParams.get('phone');
const notes = urlParams.get('notes');

// DOM elements
const bookingRoot = document.getElementById('booking-root');
const bookingSummaryElement = document.createElement('div');
bookingSummaryElement.className = 'max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md';

// Format the booking summary with both payment options
bookingSummaryElement.innerHTML = `
  <h1 class="text-2xl font-bold text-purple-700 mb-6">Booking Summary</h1>
  <div class="space-y-4">
    <div class="border-b pb-4">
      <h2 class="text-xl font-semibold text-gray-800">${serviceName}</h2>
      <p class="text-gray-600">with ${practitionerName}</p>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-500">Date</p>
        <p class="font-medium">${date}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Time</p>
        <p class="font-medium">${time}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Duration</p>
        <p class="font-medium">${serviceDuration}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Price</p>
        <p class="font-medium">$${servicePrice}</p>
      </div>
    </div>
    <div class="border-t pt-4">
      <p class="text-sm text-gray-500">Your Information</p>
      <p class="font-medium">${customerName}</p>
      <p class="text-gray-600">${customerEmail}</p>
      <p class="text-gray-600">${customerPhone}</p>
      ${notes ? `<div class="mt-4"><p class="text-sm text-gray-500">Notes</p><p class="text-gray-600">${notes}</p></div>` : ''}
    </div>
  </div>
  <div class="mt-8">
    <button id="checkout-button" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition-colors mb-3">
      Pay with Card (Stripe)
    </button>
    <div class="text-center text-gray-500 my-2">or</div>
    <div id="paypal-button-container" class="mb-3"></div>
    <button id="back-button" class="w-full mt-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">
      Go Back
    </button>
  </div>
`;

// Append the booking summary to the page
bookingRoot?.appendChild(bookingSummaryElement);

// Add event listeners

document.getElementById('checkout-button')?.addEventListener('click', async () => {
  // Stripe payment flow
  const button = document.getElementById('checkout-button') as HTMLButtonElement;
  button.disabled = true;
  button.textContent = 'Processing...';
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');
    const bookingDetails = {
      serviceName,
      serviceId,
      practitionerName,
      date,
      time,
      customerName,
      customerPhone,
      notes
    };
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceName,
        servicePrice: parseInt(servicePrice || '0', 10),
        customerEmail,
        bookingDetails
      }),
    });
    const { url, sessionId } = await response.json();
    if (sessionId && stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } else if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'mt-4 p-3 bg-red-100 text-red-800 rounded-md';
    errorElement.textContent = 'There was an error processing your payment. Please try again.';
    const buttonsDiv = document.querySelector('#booking-root > div > div:last-child');
    buttonsDiv?.parentNode?.insertBefore(errorElement, buttonsDiv);
    button.disabled = false;
    button.textContent = 'Pay with Card (Stripe)';
  }
});

// PayPal payment flow
const paypalClientId = PAYMENT_CONFIG.paypal.clientId;
const paypalAmount = servicePrice || '0';
if (paypalClientId && document.getElementById('paypal-button-container')) {
  renderPayPalButton({
    amount: paypalAmount,
    currency: PAYMENT_CONFIG.paypal.currency,
    clientId: paypalClientId,
    containerId: 'paypal-button-container',
  onApprove: async (details: Record<string, unknown>, _data: unknown) => {
      // On PayPal payment approval, send booking to backend
      const bookingData = {
        serviceId,
        serviceName,
        servicePrice: parseFloat(servicePrice || '0'),
        serviceDuration,
        practitionerName,
        date,
        time,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        notes
      };
      const paymentDetails = {
        transactionId: details.id,
        amount: details.purchase_units?.[0]?.amount?.value || paypalAmount,
        currency: PAYMENT_CONFIG.paypal.currency,
        paymentMethod: 'paypal',
  status: typeof details.status === 'string' ? details.status.toLowerCase() : 'completed'
      };
      try {
        // Store booking details for success page
        const pendingBooking = {
          serviceName,
          serviceId,
          practitionerName,
          date,
          timeSlot: time,
          serviceDuration: '45 minutes', // Default duration
          formData: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            notes: notes || ''
          }
        };
        localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
        
        // For production, store booking locally since no backend API available on Render static sites
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (!isDev) {
          // Production fallback - store booking locally
          const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          const newBooking = {
            id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            bookingData,
            paymentDetails,
            createdAt: new Date().toISOString()
          };
          existingBookings.push(newBooking);
          localStorage.setItem('bookings', JSON.stringify(existingBookings));
          
          // Redirect to success page with PayPal indicator
          window.location.href = '/booking-success?payment=paypal';
          return;
        }
        
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingData, paymentDetails })
        });
        const result = await res.json();
        if (result.success) {
          // Redirect to success page with PayPal indicator
          window.location.href = '/booking-success?payment=paypal';
        } else {
          alert('Booking failed: ' + (result.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Booking failed: ' + err);
      }
    },
  onError: (err: unknown) => {
      alert('PayPal payment failed: ' + err);
    }
  });
}

document.getElementById('back-button')?.addEventListener('click', () => {
  // Go back to the previous page
  window.history.back();
});
