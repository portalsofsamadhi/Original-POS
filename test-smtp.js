// test-smtp.js
// Run: node test-smtp.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTest() {
  try {
    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'SMTP Test Email',
      text: 'This is a test email from your Node.js SMTP setup.',
    });
    console.log('Test email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}

sendTest();
