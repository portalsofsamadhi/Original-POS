import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cookies } = req;
  const token = cookies['pos_auth'];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ user });
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}
