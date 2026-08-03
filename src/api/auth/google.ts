import { sendWelcomeEmail } from '../../utils/sendEmail';
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
// import { upsertUser } from '../../lib/db'; // Example DB function (implement as needed)

const client_id = process.env.GOOGLE_CLIENT_ID!;
const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
const redirect_uri = process.env.GOOGLE_REDIRECT_URI!;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS for local dev and prod ---
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://www.portalsofsamadhi.com' : 'http://localhost:3002');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    // If Google redirected back with a code, handle token exchange
    if (req.query.code) {
      console.log('Google OAuth callback hit. Query:', req.query);
      try {
        const { tokens } = await oauth2Client.getToken(req.query.code as string);
        console.log('Tokens received:', tokens);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        console.log('User info from Google:', data);
        if (!data.email) {
          console.error('No email returned from Google:', data);
          return res.status(400).send('No email returned from Google.');
        }
        const user = {
          email: data.email,
          name: data.name,
          picture: data.picture,
          provider: 'google',
        };
        // Send welcome email (ignore errors, don't block signup)
        try { await sendWelcomeEmail(user.email, user.name); } catch (e) { console.error('Welcome email error:', e); }
        const token = jwt.sign({ email: user.email, name: user.name, picture: user.picture }, JWT_SECRET, { expiresIn: '7d' });
        res.setHeader('Set-Cookie', serialize('pos_auth', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }));
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://www.portalsofsamadhi.com' : 'http://localhost:3002');
        console.log('Redirecting to:', frontendUrl + '/profile');
        return res.redirect(frontendUrl + '/profile');
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        return res.status(500).send('Failed to authenticate with Google.');
      }
    }
    // Otherwise, start the OAuth flow
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
        prompt: 'select_account',
      });
      return res.redirect(url);
    } catch (err) {
      console.error('Google OAuth URL generation failed:', err);
      return res.status(500).json({ error: 'Failed to initiate Google authentication.' });
    }
  }

  if (req.method === 'POST') {
    // Step 2: Exchange code for tokens and get user info
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing code' });
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      if (!data.email) {
        return res.status(400).json({ error: 'No email returned from Google.' });
      }
      // --- Upsert user in DB (implement this function for your DB) ---
      // const user = await upsertUser({
      //   email: data.email,
      //   name: data.name,
      //   picture: data.picture,
      //   provider: 'google',
      // });
      const user = {
        email: data.email,
        name: data.name,
        picture: data.picture,
        provider: 'google',
      };
      // --- Create JWT for session ---
      // Send welcome email (ignore errors, don't block signup)
      try { await sendWelcomeEmail(user.email, user.name); } catch (e) { console.error('Welcome email error:', e); }
      const token = jwt.sign({ email: user.email, name: user.name, picture: user.picture }, JWT_SECRET, { expiresIn: '7d' });
      // --- Set secure cookie ---
      res.setHeader('Set-Cookie', serialize('pos_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }));
      // --- Redirect to frontend profile page after login ---
      const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://www.portalsofsamadhi.com' : 'http://localhost:3002');
      return res.redirect(frontendUrl + '/profile');
    } catch (err) {
      console.error('Google OAuth error:', err);
      return res.status(500).json({ error: 'Failed to authenticate with Google.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
