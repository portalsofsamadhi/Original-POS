// Mock newsletter API for testing
const _subscribers: { email: string; phone?: string; subscribedAt: string }[] = [];

export const mockNewsletterAPI = {
  subscribe: async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (_subscribers.find(sub => sub.email === email)) {
      throw new Error('Email already subscribed');
    }
    
    // Add subscriber
    _subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });
    
    return { success: true, message: 'Successfully subscribed' };
  },
  
  updateProfile: async (email: string, phone?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const subscriberIndex = _subscribers.findIndex(sub => sub.email === email);
    if (subscriberIndex === -1) {
      throw new Error('Subscriber not found');
    }
    
    _subscribers[subscriberIndex].phone = phone;
    return { success: true, message: 'Profile updated successfully' };
  },
  
  getSubscribers: () => _subscribers
};
