import { Request, Response } from 'express';
import { addSubscriber, updateSubscriberProfile, getAllSubscribers, sendWelcomeEmail } from '../utils/newsletterService';

export const subscribeToNewsletter = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
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
                message: 'Successfully subscribed to newsletter. Check your email for a welcome message!',
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
};

export const updateProfile = async (req: Request, res: Response) => {
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
};

export const getSubscribers = async (req: Request, res: Response) => {
    try {
        const subscribers = getAllSubscribers();
        res.status(200).json({ 
            subscribers: subscribers,
            count: subscribers.length 
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
