const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'temporary-secret-key';
const subscribers = [];

async function subscribe() {
    const email = 'portalsofsamadhi@gmail.com';
    const password = 'Welcome2024!';
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Add subscriber
        subscribers.push({
            email,
            password: hashedPassword,
            subscriptionDate: new Date(),
            isActive: true
        });
        
        // Generate token
        const token = jwt.sign(
            { email },
            JWT_SECRET,
            { expiresIn: '365d' }
        );
        
        console.log('Successfully subscribed!');
        console.log('Email:', email);
        console.log('JWT token:', token);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

subscribe();
