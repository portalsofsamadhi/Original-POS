// Newsletter API for backend communication
// Updated for Render deployment with Node.js backend
// Prefer the main VITE_API_URL (API host). If a dedicated VITE_NEWSLETTER_API_URL is provided use it,
// otherwise fall back to localhost in development. This avoids accidentally using the frontend origin
// (e.g. VITE_NEWSLETTER_API_URL pointing to the front-end) when the real API lives elsewhere.
const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) ||
  (import.meta.env.VITE_NEWSLETTER_API_URL as string) ||
  (import.meta.env.DEV ? 'http://localhost:10000' : '');


export interface NewsletterProfile {
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  birthday?: string;
  bio?: string;
  subscribedAt?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  profile?: NewsletterProfile;
  error?: string;
  data?: unknown;
}


export interface SubscribersResponse {
  subscribers: NewsletterProfile[];
  count: number;
}

export const newsletterAPI = {
  subscribe: async (email: string): Promise<NewsletterResponse> => {
    console.log("Newsletter API subscribe called with:", email);
    
    // Check if we're in development mode and server might not be running
    const isDev = import.meta.env.DEV;
    
    // For production on Render, use client-side fallback since no backend API available
    if (!isDev && !API_BASE_URL) {
      console.log("Production mode with no API_BASE_URL, using client-side fallback");
      
      // Store email locally as fallback
      const existingEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem('newsletter_emails', JSON.stringify(existingEmails));
      }
      
      // Simulate successful subscription
      return {
        success: true,
        message: 'Successfully subscribed! (stored locally - contact admin to add to mailing list)',
        profile: { email }
      };
    }
    
    const endpoint = `${API_BASE_URL}/api/newsletter/subscribe`;
    
    console.log("Using endpoint:", endpoint, "isDev:", isDev);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log("Fetch response status:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("Fetch response data:", data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      return data;
    } catch (error) {
      console.error("Newsletter API fetch error:", error);
      
      // Fallback for development when server is not running
      if ((isDev || !API_BASE_URL) && error instanceof TypeError && error.message.includes('fetch')) {
        console.log("Server appears to be down, using fallback...");
        
        // Store email locally as fallback
        const existingEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
        if (!existingEmails.includes(email)) {
          existingEmails.push(email);
          localStorage.setItem('newsletter_emails', JSON.stringify(existingEmails));
        }
        
        // Simulate successful subscription
        return {
          success: true,
          message: 'Successfully subscribed (offline mode)',
              profile: { email }
        };
      }
      
      throw error;
    }
  },


  updateProfile: async (profile: NewsletterProfile): Promise<NewsletterResponse> => {
    const endpoint = `${API_BASE_URL}/api/newsletter/update-profile`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return data;
  },


  getSubscribers: async (): Promise<SubscribersResponse> => {
    // Prefer a public check flow when running in production (avoids requiring admin token).
    // The old admin-only endpoint is still available for admin dashboards.
    const endpoint = `${API_BASE_URL}/api/newsletter/subscribers`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer admin_secret_key_2025'
    };
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to get subscribers');
    }
    return {
      subscribers: data.subscribers || [],
      count: data.count || (data.subscribers ? data.subscribers.length : 0)
    };
  },

  // Public check for a single email profile (no admin token)
  getProfile: async (email: string): Promise<{ profile: NewsletterProfile | null }> => {
  if (!API_BASE_URL) return { profile: null };
  const endpoint = `${API_BASE_URL.replace(/\/+$/,'')}/api/newsletter/check?email=${encodeURIComponent(email)}`;
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to check profile');
    const data = await response.json();
    return { profile: data.profile || null };
  },

  // Health check endpoint
  health: async (): Promise<{ status: string; timestamp: string }> => {
    const endpoint = `${API_BASE_URL}/api/health`;
      
    const response = await fetch(endpoint, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return data;
  }
};
