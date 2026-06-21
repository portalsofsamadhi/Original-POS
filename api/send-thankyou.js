// /api/send-thankyou.js
// Express.js handler for sending a thank you email to the user using nodemailer.
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
  const { contactInfo } = req.body;
  if (!contactInfo?.email) return res.status(400).json({ error: 'Missing email' });

  // Thank you email to the user
  const thankYouMail = {
    from: FROM_ADDRESS,
    to: contactInfo.email,
    subject: 'Thank You for Booking Your Jamaica Retreat Tour!',
    html: `
      <h2 style="color:#059669;">Thank You for Booking Your Retreat Tour!</h2>
      <p>
        We are thrilled to welcome you to our <b>Jamaica Retreat Tours</b> experience!<br>
        Your payment and booking have been received.<br><br>
        Our team is preparing your custom itinerary and will reach out soon with all the details.<br>
        If you have any questions or special requests, simply reply to this email.<br><br>
        <b>We look forward to sharing Jamaica's beauty, culture, and healing with you!</b><br><br>
        <b>With gratitude,</b><br>
        The Portals of Samadhi Retreat Tours Team
      </p>
    `,
  };

  const teamMail = {
    from: FROM_ADDRESS,
    to: TEAM_EMAIL,
    subject: 'New Retreat Tour Inquiry',
    html: `
      <h2>New Retreat Tour Inquiry</h2>
      <pre style="font-size:1rem;">${JSON.stringify(req.body, null, 2)}</pre>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(thankYouMail),
      transporter.sendMail(teamMail)
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};
