import nodemailer from 'nodemailer';
// Define BlogPost interface directly in this file
export interface BlogPost {
    title: string;
    summary: string;
    content: string;
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Subscriber } from '../models/subscriber';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsletter');

const sendWelcomeEmail = async (email: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Portal of Samadhi Newsletter!',
            html: `
                <h1>Welcome to Portal of Samadhi!</h1>
                <p>Thank you for subscribing to our newsletter. We're excited to share our journey of healing and wellness with you.</p>
                <p>You'll receive updates about:</p>
                <ul>
                    <li>New traditional healing practices and insights</li>
                    <li>Virtual administration services and updates</li>
                    <li>Holistic wellness tips and guides</li>
                    <li>Special offers and community events</li>
                </ul>
                <p>If you have any questions, feel free to reach out to us.</p>
                <hr/>
                <p>Wishing you wellness and peace,<br/>The Portal of Samadhi Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return false;
    }
};

export const addSubscriber = async (email: string, password: string): Promise<boolean> => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new subscriber
        const subscriber = new Subscriber({
            email,
            password: hashedPassword,
            subscriptionDate: new Date(),
            isActive: true
        });

        // Save to database
        await subscriber.save();

        // Send welcome email
        await sendWelcomeEmail(email);
        
        return true;
    } catch (error) {
        console.error('Failed to add subscriber:', error);
        return false;
    }
};

export const authenticateSubscriber = async (email: string, password: string): Promise<string | null> => {
    try {
        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, subscriber.password);
        if (!isValidPassword) {
            return null;
        }

        // Generate JWT token with 1-year expiration
        const token = jwt.sign(
            { email: subscriber.email },
            JWT_SECRET,
            { expiresIn: '365d' }
        );

        return token;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};

export const verifyToken = (token: string): { email: string } | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as { email: string };
    } catch (_error) {
        return null;
    }
};

export const sendNewsletter = async (content: BlogPost): Promise<boolean> => {
    try {
        const activeSubscribers = await Subscriber.find({ isActive: true });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            subject: `Portal of Samadhi Newsletter: ${content.title}`,
            html: `
                <h1>${content.title}</h1>
                <p>${content.summary}</p>
                <div>${content.content}</div>
                <hr/>
                <p>To unsubscribe from our newsletter, please click <a href="https://portalsofsamadhi.com/unsubscribe">here</a></p>
            `
        };

        // Send to all active subscribers
        for (const subscriber of activeSubscribers) {
            await transporter.sendMail({
                ...mailOptions,
                to: subscriber.email
            });
        }

        return true;
    } catch (error) {
        console.error('Failed to send newsletter:', error);
        return false;
    }
};
