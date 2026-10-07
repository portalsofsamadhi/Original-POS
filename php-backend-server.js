const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from php-backend directory
app.use('/php-backend', express.static(path.join(__dirname, 'php-backend')));

// Handle PHP requests (fallback when PHP isn't available)
app.post('/php-backend/bookings.php', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    
    // For now, let's use the native Node.js mailer as fallback
    const nodemailer = require('nodemailer');
    
    const { bookingData, paymentDetails } = req.body;
    
    if (!bookingData || !paymentDetails) {
      return res.status(400).json({ success: false, error: 'Missing booking or payment details' });
    }
    
    // Save booking to bookings.json
    const bookingsFile = path.join(__dirname, 'bookings.json');
    let bookings = [];
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    }
    
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookingData,
      paymentDetails,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
    
    // Configure Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'portalsofsamadhi@gmail.com',
  pass: 'REDACTED_SMTP_PASS'
      }
    });
    
    // Send confirmation email to user
    const { TEAM_EMAIL, FROM_ADDRESS } = require('./api/emailConfig.cjs');

    const userEmail = {
      from: FROM_ADDRESS,
      to: bookingData.email,
      subject: `Booking Confirmation - ${bookingData.serviceName}`,
      html: `
        <h2>Thank you for your booking!</h2>
        <p>Your appointment for <b>${bookingData.serviceName}</b> with <b>${bookingData.practitionerName}</b> is confirmed.</p>
        <p><b>Date:</b> ${bookingData.date}<br>
        <b>Time:</b> ${bookingData.time}<br>
        <b>Duration:</b> ${bookingData.serviceDuration}<br>
        <b>Amount:</b> $${paymentDetails.amount}<br>
        <b>Payment Method:</b> ${paymentDetails.paymentMethod}<br>
        <b>Transaction ID:</b> ${paymentDetails.transactionId}</p>
        ${bookingData.notes ? `<p><b>Notes:</b> ${bookingData.notes}</p>` : ''}
        <p>We look forward to seeing you!<br>Portals of Samadhi Team</p>
      `
    };
    
    // Send notification email to admin
    const adminEmail = {
      from: FROM_ADDRESS,
      to: TEAM_EMAIL,
      subject: 'New Booking Received',
      html: `
        <h2>New Booking Received</h2>
        <p><b>Service:</b> ${bookingData.serviceName}<br>
        <b>Practitioner:</b> ${bookingData.practitionerName}<br>
        <b>Date:</b> ${bookingData.date}<br>
        <b>Time:</b> ${bookingData.time}<br>
        <b>Client:</b> ${bookingData.name} (${bookingData.email})<br>
        <b>Phone:</b> ${bookingData.phone}<br>
        ${bookingData.notes ? `<b>Notes:</b> ${bookingData.notes}<br>` : ''}
        <b>Amount:</b> $${paymentDetails.amount}<br>
        <b>Transaction ID:</b> ${paymentDetails.transactionId}<br>
        <b>Payment Method:</b> ${paymentDetails.paymentMethod}</p>
      `
    };
    
    // Send both emails
    await transporter.sendMail(userEmail);
    await transporter.sendMail(adminEmail);
    
    console.log('Booking saved and emails sent successfully');
    res.json({ success: true, message: 'Booking saved and emails sent.' });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PHP Backend Proxy running on http://localhost:${PORT}`);
  console.log('This serves as a fallback when PHP is not available in PATH');
});
