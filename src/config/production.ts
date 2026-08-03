// Production Optimization Configuration
export const PRODUCTION_CONFIG = {
  // Email Configuration
  email: {
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds
    timeoutMs: 30000, // 30 seconds
    validateEmailAddresses: true,
    enableDeliveryTracking: true,
    templates: {
      bookingConfirmation: 'booking-confirmation',
      paymentReceipt: 'payment-receipt',
      cancelation: 'booking-cancelation',
      reminder: 'appointment-reminder'
    }
  },

  // Payment Configuration
  payment: {
    // Security
    enableHttpsOnly: true,
    validatePaymentAmounts: true,
    enableFraudDetection: true,
    maxPaymentAttempts: 3,
    paymentTimeoutMs: 300000, // 5 minutes
    
    // PayPal Production Settings
    paypal: {
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      validateWebhooks: true,
      enableLogging: false, // Disable in production for security
    },

    // Validation
    minimumAmount: 1.00,
    maximumAmount: 10000.00,
    supportedCurrencies: ['USD'],
    
    // Transaction Security
    encryptTransactionData: true,
    logTransactions: true,
    requireEmailVerification: false, // Can be enabled if needed
  },

  // Booking Configuration
  booking: {
    // Validation
    requirePhoneNumber: true,
    validateAvailability: true,
    allowSameDayBooking: false,
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 24,
    
    // Business Rules
    enableOverBooking: false,
    maxConcurrentBookings: 1,
    enableWaitlist: true,
    
    // Confirmation
    sendImmediateConfirmation: true,
    sendReminderEmails: true,
    reminderTimings: [
      { hours: 24, template: 'reminder-24h' },
      { hours: 2, template: 'reminder-2h' }
    ],
    
    // Calendar Integration
    enableCalendarSync: true,
    calendarProvider: 'google', // 'google', 'outlook', 'both'
    createClientCalendarEvent: true,
  },

  // API Configuration
  api: {
    enableRateLimiting: true,
    rateLimitRequests: 100, // per minute
    enableCors: true,
    corsOrigins: [
      'https://portalsofsamadhi.com',
      'https://www.portalsofsamadhi.com',
    ],
    enableApiLogging: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },

  // Security Configuration
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableFrameGuard: true,
    encryptSensitiveData: true,
    enableSessionSecurity: true,
    requireHttps: process.env.NODE_ENV === 'production',
    
    // Data Protection
    enableDataEncryption: true,
    dataRetentionDays: 365 * 2, // 2 years
    enableDataExport: true,
    enableDataDeletion: true,
    
    // Privacy
    enableAnalytics: false, // Set to true if using analytics
    enableCookieConsent: true,
    enableDataMinimization: true,
  },

  // Performance Configuration
  performance: {
    enableCaching: true,
    cacheMaxAge: 3600, // 1 hour
    enableCompression: true,
    enableMinification: true,
    enableImageOptimization: true,
    enableLazyLoading: true,
    
    // Database
    enableConnectionPooling: true,
    maxDatabaseConnections: 20,
    queryTimeoutMs: 30000,
    
    // CDN
    enableCDN: false, // Set to true when CDN is configured
    cdnUrl: '', // Configure when ready
  },

  // Monitoring Configuration
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUptimeMonitoring: true,
    
    // Alerts
    enableEmailAlerts: true,
    alertEmails: ['info@portalsofsamadhi.com'],
    alertOnErrors: true,
    alertOnPaymentFailures: true,
    alertOnSystemDown: true,
    
    // Metrics
    trackBookingConversions: true,
    trackPaymentSuccess: true,
    trackUserEngagement: true,
  },

  // Environment-specific URLs (single Node service: site + /api on same host)
  urls: {
    frontend: process.env.NODE_ENV === 'production'
      ? 'https://www.portalsofsamadhi.com'
      : 'http://localhost:3002',
    backend: process.env.NODE_ENV === 'production'
      ? 'https://www.portalsofsamadhi.com'
      : 'http://localhost:10000',
    webhooks: process.env.NODE_ENV === 'production'
      ? 'https://www.portalsofsamadhi.com/api'
      : 'http://localhost:10000/webhooks'
  },

  // Feature Flags
  features: {
    enableNewsletter: true,
    enableBookingReminders: true,
    enableCalendarIntegration: true,
    enableMobileApp: true,
    enableMultiLanguage: false, // Future feature
    enableVideoSessions: false, // Future feature
    enableGroupBookings: false, // Future feature
  }
};

// Environment validation
export const validateProductionConfig = () => {
  const errors: string[] = [];
  
  // Required environment variables
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
  ];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Validate URLs
  try {
    new URL(PRODUCTION_CONFIG.urls.frontend);
    new URL(PRODUCTION_CONFIG.urls.backend);
  } catch (_error) {
    errors.push('Invalid URL configuration');
  }
  
  // Validate payment config
  if (PRODUCTION_CONFIG.payment.minimumAmount >= PRODUCTION_CONFIG.payment.maximumAmount) {
    errors.push('Payment minimum amount must be less than maximum amount');
  }
  
  if (errors.length > 0) {
    console.error('Production configuration errors:', errors);
    return false;
  }
  
  console.log('✅ Production configuration validated successfully');
  return true;
};

// Initialize production optimizations
export const initializeProductionOptimizations = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Performance optimizations
  if (PRODUCTION_CONFIG.performance.enableLazyLoading) {
    // Enable lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  // Error tracking
  if (PRODUCTION_CONFIG.monitoring.enableErrorTracking) {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // In production, send to monitoring service
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // In production, send to monitoring service
    });
  }

  // Performance monitoring
  if (PRODUCTION_CONFIG.monitoring.enablePerformanceMonitoring) {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
      // In production, send to analytics service
    });
  }
};

export default PRODUCTION_CONFIG;
