import { addSubscriber, authenticateSubscriber } from './src/utils/newsletterService.js';

const email = 'portalsofsamadhi@gmail.com';
const password = 'Welcome2024!';

try {
    const subscribed = await addSubscriber(email, password);
    console.log('Subscription result:', subscribed);
    
    if (subscribed) {
        const token = await authenticateSubscriber(email, password);
        console.log('Authentication token:', token);
    }
} catch (error) {
    console.error('Error:', error);
}
