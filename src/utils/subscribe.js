const { addSubscriber, authenticateSubscriber } = require('./newsletterService');

(async () => {
    const email = 'portalsofsamadhi@gmail.com';
    const password = 'Welcome2024!';

    console.log('Starting subscription process...');
    const subscribeResult = await addSubscriber(email, password);
    console.log('Subscription result:', subscribeResult);

    if (subscribeResult) {
        const token = await authenticateSubscriber(email, password);
        console.log('Authentication token:', token);
    }
})();
