import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

interface Subscriber {
    email: string;
    subscribedAt: string;
    phone?: string;
}

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]));
}

const getSubscribers = (): Subscriber[] => {
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading subscribers file:', error);
        return [];
    }
};

const addSubscriber = async (email: string, phone?: string): Promise<boolean> => {
    try {
        const subscribers = getSubscribers();
        
        // Check if email already exists
        if (subscribers.find(sub => sub.email === email)) {
            return false;
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

const updateSubscriberProfile = async (email: string, phone?: string): Promise<boolean> => {
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
app.post('/api/newsletter/subscribe', async (req: any, res: any) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const success = await addSubscriber(email);

        if (success) {
            res.status(200).json({ 
                message: 'Successfully subscribed to newsletter',
                email: email 
            });
        } else {
            res.status(409).json({ error: 'Email already subscribed' });
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/newsletter/update-profile', async (req: any, res: any) => {
    try {
        const { email, phone } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const success = await updateSubscriberProfile(email, phone);

        if (success) {
            res.status(200).json({ 
                message: 'Profile updated successfully',
                email: email,
                phone: phone 
            });
        } else {
            res.status(404).json({ error: 'Subscriber not found' });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/newsletter/subscribers', async (req: any, res: any) => {
    try {
        const subscribers = getSubscribers();
        res.status(200).json({ 
            subscribers: subscribers,
            count: subscribers.length 
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint for production monitoring
app.get('/api/newsletter/health', (req: any, res: any) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.1.0',
        services: {
            newsletter: 'operational',
            storage: fs.existsSync(SUBSCRIBERS_FILE) ? 'operational' : 'error'
        }
    };
    
    res.status(200).json(healthCheck);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Newsletter Server running on port ${PORT}`);
    console.log(`API endpoints available:`);
    console.log(`- POST http://localhost:${PORT}/api/newsletter/subscribe`);
    console.log(`- POST http://localhost:${PORT}/api/newsletter/update-profile`);
    console.log(`- GET http://localhost:${PORT}/api/newsletter/subscribers`);
});
