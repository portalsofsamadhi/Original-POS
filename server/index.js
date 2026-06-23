// server/index.mjs - Node.js backend for Render deployment (ES Module)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  getFromAddress,
  getMailTransporter,
  getSmtpHost,
  getSmtpPort,
  getSmtpUser,
  getTeamEmail,
  isSmtpConfigured,
  verifySmtpAuth,
} = require('./smtpConfig.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
// Allow configuring CORS origins via environment variable CORS_ORIGINS (comma-separated)
const defaultOrigins = [
  'https://www.portalsofsamadhi.com',
  'https://portalsofsamadhi.com',
  'https://www.samadhiproductions.com',
  'https://samadhiproductions.com',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
];

let allowedOrigins = defaultOrigins;
if (process.env.CORS_ORIGINS) {
  try {
    allowedOrigins = process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.warn('Failed to parse CORS_ORIGINS, using default list');
    allowedOrigins = defaultOrigins;
  }
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the frontend build (dist) when present.
// This ensures files like /Welcome.webp, JS and CSS assets are served
// directly instead of returning 404. We keep this permissive so it
// works both in development (when dist may not exist) and in production
// when the combined web+api service hosts the built frontend.
const distDir = path.join(__dirname, '..', 'dist');
if (fsSync.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1d' }));
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const smtp = {
    configured: isSmtpConfigured(),
    host: getSmtpHost(),
    port: getSmtpPort(),
    user: getSmtpUser(),
  };

  if (req.query.verify === '1' || req.query.verify === 'true') {
    const auth = await verifySmtpAuth(req.query.force === '1');
    smtp.authOk = auth.ok;
    if (!auth.ok && auth.error) {
      smtp.authError = auth.error;
    }
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    smtp,
    teamEmail: getTeamEmail(),
  });
});

// Send email (contact form, info session requests, booking notifications)
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body || {};
    if (!to || !subject || !html) {
      return res.status(400).json({ success: false, error: 'Missing required fields: to, subject, html' });
    }

    const transporter = getMailTransporter();
    if (!transporter) {
      return res.status(503).json({ success: false, error: 'Email service not configured (SMTP credentials missing)' });
    }

    const info = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
      replyTo: getTeamEmail(),
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Send email error:', error);
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      getMailTransporter(true);
    }
    const message =
      error.code === 'EAUTH'
        ? 'SMTP authentication failed — check SMTP_USER and SMTP_PASS on the server'
        : error.message || 'Failed to send email';
    return res.status(500).json({ success: false, error: message });
  }
});

// Debug endpoint for Google config (opt-in)
app.get('/api/debug/google-config', (req, res) => {
  if (process.env.DEBUG_GOOGLE_AUTH !== 'true') {
    return res.status(403).json({ error: 'Debugging disabled' });
  }

  return res.json({
    serverGoogleClientId: process.env.GOOGLE_CLIENT_ID || null,
    viteGoogleClientId: process.env.VITE_GOOGLE_CLIENT_ID || null,
    debugEnabled: true,
  });
});

// Admin authentication middleware
// Make the admin bearer token configurable via ADMIN_BEARER_TOKEN env var so
// production can set a secure value instead of relying on a hard-coded token.
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminToken = process.env.ADMIN_BEARER_TOKEN || 'Bearer admin_secret_key_2025';

  if (authHeader !== adminToken) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

// Get bookings endpoint (replaces PHP backend)
app.get('/api/bookings', authenticateAdmin, async (req, res) => {
  try {
    const bookingsPath = path.join(__dirname, '..', 'bookings.json');
    
    // Create file if it doesn't exist
    try {
      await fs.access(bookingsPath);
    } catch {
      await fs.writeFile(bookingsPath, JSON.stringify([], null, 2));
    }
    
    const bookingsData = await fs.readFile(bookingsPath, 'utf8');
    const bookings = JSON.parse(bookingsData);
    
    res.json({
      success: true,
      bookings: Array.isArray(bookings) ? bookings : [],
      count: Array.isArray(bookings) ? bookings.length : 0
    });
  } catch (error) {
    console.error('Error reading bookings:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingsPath = path.join(__dirname, '..', 'bookings.json');
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    // Read existing bookings
    let bookings = [];
    try {
      const bookingsData = await fs.readFile(bookingsPath, 'utf8');
      bookings = JSON.parse(bookingsData);
    } catch {
      // File doesn't exist or is invalid, start with empty array
    }
    
    // Add new booking
    bookings.push(newBooking);
    
    // Write back to file
    await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Newsletter endpoints
app.get('/api/newsletter/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const subscribersPath = path.join(__dirname, '..', 'subscribers.json');
    
    try {
      const subscribersData = await fs.readFile(subscribersPath, 'utf8');
      const subscribers = JSON.parse(subscribersData);
      res.json({ success: true, subscribers });
    } catch {
      res.json({ success: true, subscribers: [] });
    }
  } catch (error) {
    console.error('Error reading subscribers:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Public check endpoint for a single subscriber by email (no admin auth required)
app.get('/api/newsletter/check', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const subscribersPath = path.join(__dirname, '..', 'subscribers.json');
    try {
      const subscribersData = await fs.readFile(subscribersPath, 'utf8');
      const subscribers = JSON.parse(subscribersData);
      const found = subscribers.find((s) => String(s.email).toLowerCase() === String(email).toLowerCase());
      return res.json({ success: true, profile: found || null });
    } catch {
      return res.json({ success: true, profile: null });
    }
  } catch (error) {
    console.error('Error checking subscriber:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const subscribersPath = path.join(__dirname, '..', 'subscribers.json');
    
    let subscribers = [];
    try {
      const subscribersData = await fs.readFile(subscribersPath, 'utf8');
      subscribers = JSON.parse(subscribersData);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return res.status(400).json({ success: false, error: 'Email already subscribed' });
    }
    
    // Add new subscriber
    const newSubscriber = {
      email,
      phone,
      subscribedAt: new Date().toISOString()
    };
    subscribers.push(newSubscriber);
    
    await fs.writeFile(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    res.json({ success: true, message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update profile endpoint
app.post('/api/newsletter/update-profile', async (req, res) => {
  try {
    const profile = req.body;
    const subscribersPath = path.join(__dirname, '..', 'subscribers.json');
    
    let subscribers = [];
    try {
      const subscribersData = await fs.readFile(subscribersPath, 'utf8');
      subscribers = JSON.parse(subscribersData);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    // Find and update subscriber
    const subscriberIndex = subscribers.findIndex(sub => sub.email === profile.email);
    if (subscriberIndex === -1) {
      // Add new subscriber
      const newSubscriber = {
        ...profile,
        subscribedAt: new Date().toISOString()
      };
      subscribers.push(newSubscriber);
    } else {
      // Update existing subscriber
      subscribers[subscriberIndex] = {
        ...subscribers[subscriberIndex],
        ...profile,
        // Keep original subscribedAt date
        subscribedAt: subscribers[subscriberIndex].subscribedAt
      };
    }
    
    await fs.writeFile(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Profile endpoints (for user authentication)
app.get('/api/profile', (req, res) => {
  // This would typically validate JWT token and return user profile
  // For now, return mock data or handle based on your auth system
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  
  // Mock profile data - replace with actual user lookup
  res.json({
    success: true,
    profile: {
      email: 'user@example.com',
      name: 'User Name',
      memberSince: new Date().toISOString()
    }
  });
});

// Serve static frontend (if present) and provide SPA routing.
app.get('/{*splat}', async (req, res, next) => {
  // If this is an API route, return 404 JSON (API does not have this endpoint)
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
  try {
    // Check if dist/index.html exists
    await fs.access(distIndex);
    return res.sendFile(distIndex);
  } catch (err) {
    // If no frontend build is present, fallback to 404 for non-API routes
    return res.status(404).json({ error: 'Not found' });
  }
});

// JSON body parse errors (avoid generic 500 for malformed payloads)
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }
  next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 POS API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  // Log presence (not values) of critical runtime secrets to help with prod verification
  console.log('GOOGLE_CLIENT_ID present:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('VITE_GOOGLE_CLIENT_ID present (build-time):', !!process.env.VITE_GOOGLE_CLIENT_ID);
  console.log('STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);
  console.log('SMTP configured:', isSmtpConfigured());
  console.log('SMTP host:', getSmtpHost());
  console.log('SMTP user:', getSmtpUser());
  console.log('TEAM_EMAIL:', getTeamEmail());
});

export default app;
