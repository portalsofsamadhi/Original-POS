import { addSubscriber, authenticateSubscriber } from '../utils/newsletterService';

async function subscribeAndAuthenticate() {
    const email = 'portalsofsamadhi@gmail.com';
    // Using a temporary password for initial subscription
    const password = 'tempPass123!';

    try {
        // Subscribe
        console.log('Attempting to subscribe user...');
        const subscribed = await addSubscriber(email, password);
        if (!subscribed) {
            console.error('Failed to subscribe: No confirmation received from service');
            return;
        }
        console.log('Successfully subscribed');

        // Authenticate
        console.log('Attempting to authenticate...');
        const token = await authenticateSubscriber(email, password);
        if (!token) {
            console.error('Failed to authenticate: No token received');
            return;
        }
        console.log('Successfully authenticated');
        console.log('Your JWT token:', token);
        
        // Store token securely if needed
        localStorage.setItem('newsletter_token', token);
        
        return { success: true, token };
    } catch (error) {
        console.error('Error in subscribeAndAuthenticate:', error instanceof Error ? error.message : String(error));
        return { success: false, error };
    }
}

// Self-executing function for immediate execution in browser environments
(function() {
    // Check if we should run automatically (can be controlled by a global variable or URL parameter)
    const autoRun = window.location.search.includes('autoSubscribe=true');
    if (autoRun) {
        console.log('Auto-running subscription process...');
        subscribeAndAuthenticate().then(result => {
            console.log('Subscription process completed:', result);
        });
    }
})();

// Export for use in other modules
export { subscribeAndAuthenticate };

// Check if we're in a browser environment before accessing window
const isBrowser = typeof window !== 'undefined';

// TypeScript declaration to allow extending Window interface
declare global {
    interface Window {
        subscribeAndAuthenticate: typeof subscribeAndAuthenticate;
    }
}

// Only expose to window if in browser environment
if (isBrowser) {
    window.subscribeAndAuthenticate = subscribeAndAuthenticate;
}

// Add Node.js specific execution
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // We're in Node.js
    if (require.main === module) {
        subscribeAndAuthenticate();
    }
}
