import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const debugEnabled = process.env.DEBUG_GOOGLE_AUTH === 'true';
  if (!debugEnabled) {
    return res.status(403).json({ error: 'Debugging disabled' });
  }

  // Return only non-sensitive configuration values
  const payload = {
    serverGoogleClientId: process.env.GOOGLE_CLIENT_ID || null,
    viteGoogleClientId: process.env.VITE_GOOGLE_CLIENT_ID || null,
    debugEnabled: !!debugEnabled,
  };

  return res.status(200).json(payload);
}
