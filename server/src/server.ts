import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createStripeCheckoutSession from './createStripeCheckoutSession';
import paymentVerification from './paymentVerification';
import bookingApi from './bookingApi';
import newsletterRoutes from './routes/newsletterRoutes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', createStripeCheckoutSession);
app.use('/api', paymentVerification);
app.use('/api', bookingApi);
app.use('/api/newsletter', newsletterRoutes);

app.get('/', (req, res) => {
  res.send('POS Website API running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
