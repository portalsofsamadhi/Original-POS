import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  // In production, save booking to database (MongoDB, etc.)
  // For now, just log and return success
  console.log('Received booking:', req.body);
  res.json({ success: true });
});

// POST /api/send-booking-confirmation
router.post('/send-booking-confirmation', async (req, res) => {
  const { to, bookingData, paymentDetails } = req.body;
  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: `Booking Confirmation - ${bookingData.serviceName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 18px; color: #374151; margin-bottom: 25px;">
              Thank you for booking with Portals of Samadhi. Your appointment has been confirmed!
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #7c3aed; margin-bottom: 25px;">
              <h2 style="color: #7c3aed; margin-top: 0;">Appointment Details</h2>
              <p style="margin: 8px 0;"><strong>Service:</strong> ${bookingData.serviceName}</p>
              <p style="margin: 8px 0;"><strong>Practitioner:</strong> ${bookingData.practitionerName}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${bookingData.date}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${bookingData.time}</p>
              <p style="margin: 8px 0;"><strong>Duration:</strong> ${bookingData.serviceDuration}</p>
              ${bookingData.notes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin-bottom: 25px;">
              <h3 style="color: #059669; margin-top: 0;">Payment Information</h3>
              <p style="margin: 8px 0;"><strong>Amount:</strong> $${paymentDetails.amount}</p>
              <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${paymentDetails.paymentMethod}</p>
              <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
              <p style="margin: 8px 0;"><strong>Status:</strong> Completed</p>
            </div>
            
            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #d97706; margin-top: 0;">Important Notes</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                <li>Please arrive 10-15 minutes early for your appointment</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                <li>Bring a comfortable mat or cushion if needed</li>
                <li>Wear comfortable, loose-fitting clothing</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #374151; margin-bottom: 15px;">Questions? Contact us:</p>
              <p style="color: #374151;">📧 ${process.env.TEAM_EMAIL || 'info@portalsofsamadhi.com'}</p>
            </div>
          </div>
          
          <div style="background: #374151; color: #d1d5db; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 16px;">
              We look forward to supporting you on your healing journey.
            </p>
            <p style="margin: 10px 0 0 0;">
              <strong>With gratitude, The Portals of Samadhi Team</strong>
            </p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// POST /api/calendar/create-event
router.post('/calendar/create-event', async (req, res) => {
  // In production, integrate with Google Calendar or similar
  // For now, just log and return success
  console.log('Create calendar event:', req.body);
  res.json({ success: true });
});

export default router;
