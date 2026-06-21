import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: process.env.VITE_EMAIL_SERVICE,
  auth: {
    user: process.env.VITE_EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    await transporter.sendMail({
      from: process.env.VITE_EMAIL_USER,
      to,
      subject,
      html
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
