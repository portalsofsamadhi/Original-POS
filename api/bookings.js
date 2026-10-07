// api/bookings.js - Handle booking submissions for production
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { TEAM_EMAIL, FROM_ADDRESS } = require('./emailConfig.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { bookingData, paymentDetails } = req.body;

    if (!bookingData || !paymentDetails) {
      return res.status(400).json({ success: false, error: 'Missing booking or payment details' });
    }

    // Save booking to bookings.json
    const bookingsFile = path.join(__dirname, '..', 'bookings.json');
    let bookings = [];
    
    if (fs.existsSync(bookingsFile)) {
      try {
        bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
      } catch (e) {
        bookings = [];
      }
    }

    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookingData,
      paymentDetails,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    // Configure Gmail SMTP (use environment variables in production)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'portalsofsamadhi@gmail.com',
  pass: process.env.SMTP_PASS || 'REDACTED_SMTP_PASS'
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
    try {
      await transporter.sendMail(userEmail);
      await transporter.sendMail(adminEmail);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    console.log('Booking saved successfully');
    res.json({ 
      success: true, 
      message: 'Booking saved and confirmation emails sent.',
      bookingId: newBooking.id
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
