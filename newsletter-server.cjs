const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Function to send welcome email
const sendWelcomeEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to Portals of Samadhi Newsletter!',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Portals of Samadhi!</h1>
                    </div>
                    
                    <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">
                            Thank you for joining our community of conscious beings dedicated to holistic healing, spiritual growth, and transformative experiences.
                        </p>
                        
                        <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px;">
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
                            <a href="https://portalsofsamadhi.com" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                                Explore Our Services
                            </a>
                        </div>
                        
                        <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
                            If you have any questions, feel free to reach out to us at ${process.env.TEAM_EMAIL || process.env.SMTP_USER}.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>
                        
                        <p style="font-size: 16px; color: #6b7280; text-align: center;">
                            Wishing you wellness and peace,<br/>
                            <strong>The Portals of Samadhi Team</strong>
                        </p>
                        
                        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                            To unsubscribe from our newsletter, please contact us at ${process.env.TEAM_EMAIL || process.env.SMTP_USER}
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent successfully to: ${email}`);
        return true;
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return false;
    }
};

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]));
}

const getSubscribers = () => {
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading subscribers file:', error);
        return [];
    }
};

const addSubscriber = async (email, phone) => {
    try {
        const subscribers = getSubscribers();
        
        // Check if email already exists
        if (subscribers.find(sub => sub.email === email)) {
            return false;
        }
        
        const newSubscriber = {
            email,
            subscribedAt: new Date().toISOString(),
            phone
        };

        subscribers.push(newSubscriber);
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
        
        console.log(`New subscriber added: ${email}`);
        return true;
    } catch (error) {
        console.error('Error adding subscriber:', error);
        return false;
    }
};

const updateSubscriberProfile = async (email, phone) => {
    try {
        const subscribers = getSubscribers();
        const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
        
        if (subscriberIndex === -1) {
            return false;
        }

        subscribers[subscriberIndex].phone = phone;
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
        
        console.log(`Subscriber profile updated: ${email}`);
        return true;
    } catch (error) {
        console.error('Error updating subscriber profile:', error);
        return false;
    }
};

// Newsletter routes
app.post('/api/newsletter/subscribe', async (req, res) => {
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

        const success = await addSubscriber(email);

        if (success) {
            // Send welcome email after successful subscription
            try {
                await sendWelcomeEmail(email);
                console.log(`Welcome email sent to: ${email}`);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the subscription if email fails
            }
            
            res.status(200).json({ 
                success: true,
                message: 'Successfully subscribed to newsletter',
                email: email 
            });
        } else {
            res.status(409).json({ 
                success: false,
                error: 'Email already subscribed' 
            });
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
});

app.post('/api/newsletter/update-profile', async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: 'Email is required' 
            });
        }

        const success = await updateSubscriberProfile(email, phone);

        if (success) {
            res.status(200).json({ 
                success: true,
                message: 'Profile updated successfully',
                email: email,
                phone: phone 
            });
        } else {
            res.status(404).json({ 
                success: false,
                error: 'Subscriber not found' 
            });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
});

app.get('/api/newsletter/subscribers', async (req, res) => {
    try {
        const subscribers = getSubscribers();
        res.status(200).json({ 
            success: true,
            subscribers: subscribers,
            count: subscribers.length 
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
});

// Health check endpoint for production monitoring
app.get('/api/newsletter/health', (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.1.0',
        emailEnabled: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
        services: {
            newsletter: 'operational',
            storage: fs.existsSync(SUBSCRIBERS_FILE) ? 'operational' : 'error',
            smtp: !!(process.env.SMTP_USER && process.env.SMTP_PASS) ? 'configured' : 'not configured'
        }
    };
    
    res.status(200).json(healthCheck);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Newsletter Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Email enabled: ${!!(process.env.SMTP_USER && process.env.SMTP_PASS)}`);
    console.log(`API endpoints available:`);
    console.log(`- POST http://localhost:${PORT}/api/newsletter/subscribe`);
    console.log(`- POST http://localhost:${PORT}/api/newsletter/update-profile`);
    console.log(`- GET http://localhost:${PORT}/api/newsletter/subscribers`);
    console.log(`- GET http://localhost:${PORT}/api/newsletter/health`);
    console.log('');
});
