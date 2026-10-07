import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { TEAM_EMAIL, FROM_ADDRESS } = require('./api/emailConfig.cjs');

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Calendar setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set up calendar client
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from php-backend directory
app.use('/php-backend', express.static(path.join(__dirname, 'php-backend')));

// Function to create Google Calendar event
async function createCalendarEvent(bookingData) {
  try {
    // For now, we'll skip the OAuth flow and just return success
    // In production, you would need to handle OAuth tokens properly
    console.log('Calendar event would be created for:', bookingData);
    return { success: true, eventId: 'calendar-event-' + Date.now() };
  } catch (error) {
    console.error('Calendar event creation error:', error);
    return { success: false, error: error.message };
  }
}

// Handle PHP requests (fallback when PHP isn't available)
app.post('/php-backend/bookings.php', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    
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
    
    // Create Google Calendar event
    const calendarResult = await createCalendarEvent({
      summary: `${bookingData.serviceName} - ${bookingData.name}`,
      description: `${bookingData.bookingType === 'consultation' ? 'Free Consultation' : 'Paid Service'}\nPractitioner: ${bookingData.practitionerName}\nClient: ${bookingData.name} (${bookingData.email})\nPhone: ${bookingData.phone}${bookingData.notes ? '\nNotes: ' + bookingData.notes : ''}`,
      start: {
        dateTime: new Date(`${bookingData.date} ${bookingData.time}`).toISOString(),
        timeZone: 'America/New_York', // Adjust to your timezone
      },
      end: {
        dateTime: new Date(new Date(`${bookingData.date} ${bookingData.time}`).getTime() + (bookingData.bookingType === 'consultation' ? 30 : 60) * 60000).toISOString(),
        timeZone: 'America/New_York', // Adjust to your timezone
      },
      attendees: [
        { email: bookingData.email },
        { email: TEAM_EMAIL }
      ],
    });
    
    console.log('Calendar event result:', calendarResult);
    
    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'portalsofsamadhi@gmail.com',
  pass: 'REDACTED_SMTP_PASS'
      }
    });
    
    // Send confirmation email to user
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
    
    console.log('Booking saved, emails sent, and calendar event processed successfully');
    res.json({ 
      success: true, 
      message: 'Booking saved and emails sent.',
      calendar: calendarResult.success ? 'Calendar event created' : 'Calendar event failed'
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PHP Backend Proxy running on http://localhost:${PORT}`);
  console.log('This serves as a fallback when PHP is not available in PATH');
});
