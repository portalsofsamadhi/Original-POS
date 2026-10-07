// /api/retreat-inquiry.js
// Express.js handler for sending the retreat inquiry to your team email using nodemailer.
const nodemailer = require('nodemailer');
const { TEAM_EMAIL, FROM_ADDRESS } = require('./emailConfig.cjs');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your@email.com',
    pass: process.env.SMTP_PASS || 'yourpassword',
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const data = req.body;
  const mailOptions = {
    from: FROM_ADDRESS,
    to: TEAM_EMAIL,
    subject: 'New Retreat Tour Inquiry',
    html: `
      <h2>New Retreat Tour Inquiry</h2>
      <pre style="font-size:1rem;">${JSON.stringify(data, null, 2)}</pre>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send team email' });
  }
};
