import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import { Subscriber } from '../../../models/subscriber';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Missing credential' });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (process.env.DEBUG_GOOGLE_AUTH === 'true' && typeof console !== 'undefined' && typeof console.log === 'function') {
      // Safe, opt-in debugging: log only non-sensitive fields to help troubleshoot audience mismatches.
      // Do NOT enable DEBUG_GOOGLE_AUTH in public logs with production tokens.
      console.log('DEBUG_GOOGLE_AUTH payload:', {
        aud: payload?.aud,
        email: payload?.email,
        sub: payload?.sub,
        iss: payload?.iss,
      });
    }
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }
    // Find or create subscriber
    let subscriber = await Subscriber.findOne({ email: payload.email });
    if (!subscriber) {
      subscriber = new Subscriber({
        email: payload.email,
        password: '', // No password for Google users
        subscriptionDate: new Date(),
        isActive: true,
      });
      await subscriber.save();
    }
    // Issue JWT
    const token = jwt.sign({ email: subscriber.email }, JWT_SECRET, { expiresIn: '365d' });
    return res.status(200).json({ token });
  } catch (_error) {
    return res.status(401).json({ error: 'Google authentication failed' });
  }
}
