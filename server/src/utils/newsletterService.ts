import fs from 'fs';
import path from 'path';
import { transporter } from '../emailHandler';

interface Subscriber {
    email: string;
    subscribedAt: string;
    phone?: string;
}

const SUBSCRIBERS_FILE = path.join(__dirname, '../data/subscribers.json');

// Ensure data directory exists
const dataDir = path.dirname(SUBSCRIBERS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]));
}

export const sendWelcomeEmail = async (email: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to Portals of Samadhi Newsletter!',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #059669, #065f46); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">Welcome to Portals of Samadhi!</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9fafb;">
                        <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">
                            Thank you for joining our spiritual community. We're honored to have you on this journey of healing and transformation.
                        </p>
                        
                        <p style="color: #374151; margin-bottom: 15px;">
                            As a member of our community, you'll receive:
                        </p>
                        
                        <ul style="color: #374151; margin-bottom: 25px; padding-left: 20px;">
                            <li>Insights into traditional healing practices</li>
                            <li>Updates on virtual administration services</li>
                            <li>Holistic wellness tips and spiritual guidance</li>
                            <li>Special offers and exclusive community events</li>
                            <li>Workshop announcements and retreat opportunities</li>
                        </ul>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #059669;">
                            <p style="margin: 0; color: #374151; font-style: italic;">
                                "The journey of a thousand miles begins with one step. Thank you for taking this step with us."
                            </p>
                        </div>
                        
                        <p style="color: #374151;">
                            If you have any questions or need support, feel free to reach out to us at any time.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://portalsofsamadhi.com" style="background: #059669; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Explore Our Services
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #374151; color: #d1d5db; padding: 20px; text-align: center; font-size: 14px;">
                        <p style="margin: 0;">
                            With gratitude and light,<br/>
                            <strong>The Portals of Samadhi Team</strong>
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 12px;">
                            If you no longer wish to receive these emails, you can 
                            <a href="https://portalsofsamadhi.com/unsubscribe" style="color: #10b981;">unsubscribe here</a>.
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

export const addSubscriber = async (email: string, phone?: string): Promise<boolean> => {
    try {
        const subscribers = getSubscribers();
        
        // Check if email already exists
        if (subscribers.find(sub => sub.email === email)) {
            return false; // Email already exists
        }
        
        const newSubscriber: Subscriber = {
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

export const updateSubscriberProfile = async (email: string, phone?: string): Promise<boolean> => {
    try {
        const subscribers = getSubscribers();
        const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
        
        if (subscriberIndex === -1) {
            return false; // Subscriber not found
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

export const getAllSubscribers = (): Subscriber[] => {
    return getSubscribers();
};

const getSubscribers = (): Subscriber[] => {
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading subscribers file:', error);
        return [];
    }
};
