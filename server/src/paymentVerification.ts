import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

router.get('/verify-payment', (req: Request, res: Response): void => {
  (async () => {
  const { session_id } = req.query;
  
    if (!session_id) {
      res.status(400).json({ success: false, error: 'No session ID provided' });
      return;
    }
    try {
      // Retrieve the session to verify its status
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      // Check if payment was successful
      if (session.payment_status === 'paid') {
        // Extract booking details from metadata if needed
        const bookingDetailsJson = session.metadata?.bookingDetails;
        let bookingDetails = null;
        if (bookingDetailsJson) {
          try {
            bookingDetails = JSON.parse(bookingDetailsJson);
          } catch (err) {
            console.error('Error parsing booking details:', err);
          }
        }
        res.json({ 
          success: true, 
          paymentStatus: session.payment_status,
          bookingDetails 
        });
      } else {
        res.json({ 
          success: false, 
          paymentStatus: session.payment_status,
          error: 'Payment not completed'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to verify payment status'
      });
    }
  })();
});

export default router;
