// api/newsletter/subscribe.js - Newsletter subscription endpoint for production
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { TEAM_EMAIL, FROM_ADDRESS } = require('../emailConfig.cjs');
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Save subscriber to subscribers.json
    const subscribersFile = path.join(__dirname, '..', '..', 'subscribers.json');
    let subscribers = [];
    
    if (fs.existsSync(subscribersFile)) {
      try {
        subscribers = JSON.parse(fs.readFileSync(subscribersFile, 'utf8'));
      } catch (e) {
        subscribers = [];
      }
    }

    // Check if email already exists
    if (subscribers.find(sub => sub.email === email)) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already subscribed' 
      });
    }

    const newSubscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      phone: null
    };

    subscribers.push(newSubscriber);
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));

    // Send welcome email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || 'portalsofsamadhi@gmail.com',
          pass: process.env.SMTP_PASS || 'REDACTED_SMTP_PASS'
        }
      });

      const welcomeEmail = {
        from: FROM_ADDRESS,
        to: email,
        subject: 'Welcome to Portals of Samadhi Newsletter!',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 0;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Welcome to Portals of Samadhi!
              </h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 15px 0 0 0;">
                Your journey to wellness begins here
              </p>
            </div>
            
            <div style="padding: 40px 30px; background: white; margin: 0;">
              <p style="font-size: 18px; color: #374151; margin-bottom: 25px; line-height: 1.6;">
                Thank you for joining our community! We're thrilled to share our journey of healing, wellness, and spiritual growth with you.
              </p>
              
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px; line-height: 1.6;">
                You'll receive updates about:
              </p>
              
              <ul style="color: #4b5563; margin-bottom: 30px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">New traditional healing practices and insights</li>
                <li style="margin-bottom: 10px;">Virtual administration services and updates</li>
                <li style="margin-bottom: 10px;">Holistic wellness tips and guides</li>
                <li style="margin-bottom: 10px;">Special offers and community events</li>
                <li style="margin-bottom: 10px;">Retreat tour opportunities in Jamaica</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.portalsofsamadhi.com" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Explore Our Services
                </a>
              </div>
              
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
                If you have any questions, feel free to reach out to us at info@portalsofsamadhi.com.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>
              
              <p style="font-size: 16px; color: #6b7280; text-align: center;">
                Wishing you wellness and peace,<br/>
                <strong>The Portals of Samadhi Team</strong>
              </p>
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                To unsubscribe from our newsletter, please contact us at info@portalsofsamadhi.com
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(welcomeEmail);

      const teamNotification = {
        from: FROM_ADDRESS,
        to: TEAM_EMAIL,
        subject: 'New Newsletter Subscriber',
        html: `<h2>New Newsletter Subscriber</h2><p><strong>Email:</strong> ${email}</p>`,
      };
      await transporter.sendMail(teamNotification);

      console.log(`Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    console.log(`New subscriber added: ${email}`);
    res.status(200).json({ 
      success: true,
      message: 'Successfully subscribed to newsletter',
      email: email 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}
