import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name?: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@portalsofsamadhi.com',
    to,
    subject: 'Welcome to Portals of Samadhi',
    html: `<h2>Welcome${name ? ', ' + name : ''}!</h2><p>Thank you for signing up for Portals of Samadhi. We are honored to have you as part of our community. Explore our services and let us know how we can support your journey.</p><p>With gratitude,<br/>The Portals of Samadhi Team</p>`
  };
  await transporter.sendMail(mailOptions);
}
