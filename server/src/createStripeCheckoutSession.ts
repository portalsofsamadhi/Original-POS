import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
console.log('Loaded STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.slice(0,4) + '...' + process.env.STRIPE_SECRET_KEY.slice(-4) : 'undefined');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

router.post('/create-checkout-session', async (req, res) => {
  const { serviceName, servicePrice, customerEmail, bookingDetails } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
            },
            unit_amount: Math.round(servicePrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${req.headers.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/booking-cancel`,
      metadata: {
        bookingDetails: JSON.stringify(bookingDetails)
      },
    });
    res.json({ 
      url: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

export default router;
