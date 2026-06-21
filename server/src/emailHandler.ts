import express from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { createCalendarEvent, getCalendarAvailability } from './calendarService';
import newsletterRoutes from './routes/newsletterRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  // Explicitly specify the transport type as SMTP
  // and ensure port is a number
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
} as nodemailer.TransportOptions);

// Make transporter available to other modules
export { transporter };

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Newsletter routes
app.use('/api/newsletter', newsletterRoutes);

// Email sending endpoint
app.post('/api/send-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
});

// Calendar endpoints
app.post('/api/calendar/create-event', async (req: Request, res: Response): Promise<void> => {
  try {
    const { summary, description, start, end, attendeeEmail, timeZone } = req.body;
    
    // Validate required fields
    if (!summary || !description || !start || !end || !attendeeEmail) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
      return;
    }

    // Convert string dates to Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const result = await createCalendarEvent({
      summary,
      description,
      start: startDate,
      end: endDate,
      attendeeEmail,
      timeZone
    });

    res.json(result);
  } catch (error) {
    console.error('Calendar event creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create calendar event'
    });
  }
});

app.post('/api/calendar/availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const { start, end } = req.body;
    
    if (!start || !end) {
      res.status(400).json({
        success: false,
        error: 'Missing date range'
      });
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const result = await getCalendarAvailability(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Calendar availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get calendar availability'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
