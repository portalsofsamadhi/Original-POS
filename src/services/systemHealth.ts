// System Health Monitoring and Validation
import ErrorHandlingService from './errorHandling';
import { PAYMENT_CONFIG } from '../config/payment';
import PRODUCTION_CONFIG from '../config/production';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'error';
  checks: HealthCheckResult[];
  summary: {
    healthy: number;
    warnings: number;
    errors: number;
    total: number;
  };
}

export class SystemHealthMonitor {
  
  // Run all health checks
  static async runHealthCheck(): Promise<SystemHealth> {
    const checks: HealthCheckResult[] = [];
    
    // Environment checks
    checks.push(await this.checkEnvironmentVariables());
    checks.push(await this.checkConfiguration());
    
    // Service checks
    checks.push(await this.checkEmailService());
    checks.push(await this.checkPaymentConfiguration());
    checks.push(await this.checkBookingSystem());
    checks.push(await this.checkAPIConnectivity());
    
    // Browser/Client checks
    checks.push(this.checkLocalStorage());
    checks.push(this.checkBrowserCompatibility());
    
    // Security checks
    checks.push(this.checkSecurityHeaders());
    checks.push(this.checkHTTPS());
    
    // Calculate summary
    const summary = {
      healthy: checks.filter(c => c.status === 'healthy').length,
      warnings: checks.filter(c => c.status === 'warning').length,
      errors: checks.filter(c => c.status === 'error').length,
      total: checks.length
    };
    
    // Determine overall health
    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    if (summary.errors > 0) {
      overall = 'error';
    } else if (summary.warnings > 0) {
      overall = 'warning';
    }
    
    // Log health check results
    ErrorHandlingService.logError(`System health check completed: ${overall}`, {
      summary,
      criticalIssues: checks.filter(c => c.status === 'error').map(c => c.message)
    }, overall === 'error' ? 'error' : 'info');
    
    return { overall, checks, summary };
  }
  
  // Check environment variables
  private static async checkEnvironmentVariables(): Promise<HealthCheckResult> {
    const requiredVars = [
      'VITE_API_URL',
      'VITE_PAYPAL_CLIENT_ID'
    ];
    
    const missingVars: string[] = [];
    const presentVars: string[] = [];
    
    requiredVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (!value || value.trim() === '') {
        missingVars.push(varName);
      } else {
        presentVars.push(varName);
      }
    });
    
    if (missingVars.length === 0) {
      return {
        service: 'Environment Variables',
        status: 'healthy',
        message: 'All required environment variables are present',
        details: { present: presentVars },
        timestamp: new Date()
      };
    } else if (missingVars.length < requiredVars.length) {
      return {
        service: 'Environment Variables',
        status: 'warning',
        message: `Some environment variables are missing: ${missingVars.join(', ')}`,
        details: { missing: missingVars, present: presentVars },
        timestamp: new Date()
      };
    } else {
      return {
        service: 'Environment Variables',
        status: 'error',
        message: `Critical environment variables missing: ${missingVars.join(', ')}`,
        details: { missing: missingVars },
        timestamp: new Date()
      };
    }
  }
  
  // Check configuration
  private static async checkConfiguration(): Promise<HealthCheckResult> {
    try {
      // Validate payment config
      if (!PAYMENT_CONFIG.general.minimumAmount || !PAYMENT_CONFIG.general.maximumAmount) {
        throw new Error('Payment configuration is invalid');
      }
      
      if (PAYMENT_CONFIG.general.minimumAmount >= PAYMENT_CONFIG.general.maximumAmount) {
        throw new Error('Payment minimum amount must be less than maximum amount');
      }
      
      // Validate production config
      if (typeof PRODUCTION_CONFIG !== 'object') {
        throw new Error('Production configuration is missing');
      }
      
      return {
        service: 'Configuration',
        status: 'healthy',
        message: 'All configurations are valid',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'Configuration',
        status: 'error',
        message: `Configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  }
  
  // Check email service
  private static async checkEmailService(): Promise<HealthCheckResult> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        return {
          service: 'Email Service',
          status: 'warning',
          message: 'API URL not configured - email service may not work',
          timestamp: new Date()
        };
      }
      
      // Test API connectivity (don't actually send email)
      const response = await fetch(`${apiUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).catch(() => null);
      
      if (response?.ok) {
        return {
          service: 'Email Service',
          status: 'healthy',
          message: 'Email service API is accessible',
          details: { apiUrl, status: response.status },
          timestamp: new Date()
        };
      } else {
        return {
          service: 'Email Service',
          status: 'warning',
          message: 'Email service API is not accessible - emails may fail',
          details: { apiUrl, status: response?.status || 'No response' },
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        service: 'Email Service',
        status: 'warning',
        message: 'Unable to verify email service',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };
    }
  }
  
  // Check payment configuration
  private static async checkPaymentConfiguration(): Promise<HealthCheckResult> {
    try {
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        return {
          service: 'Payment Configuration',
          status: 'error',
          message: 'PayPal Client ID is missing - payments will not work',
          timestamp: new Date()
        };
      }
      
      // Check if PayPal SDK is loaded
  if (typeof window !== 'undefined' && (window as unknown as { paypal?: unknown }).paypal) {
        return {
          service: 'Payment Configuration',
          status: 'healthy',
          message: 'PayPal configuration is valid and SDK is loaded',
          details: { 
            hasClientId: true, 
            sdkLoaded: true,
            currency: PAYMENT_CONFIG.general.currency
          },
          timestamp: new Date()
        };
      } else {
        return {
          service: 'Payment Configuration',
          status: 'warning',
          message: 'PayPal SDK not yet loaded - this is normal during initial page load',
          details: { 
            hasClientId: true, 
            sdkLoaded: false
          },
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        service: 'Payment Configuration',
        status: 'error',
        message: 'Payment configuration error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };
    }
  }
  
  // Check booking system
  private static async checkBookingSystem(): Promise<HealthCheckResult> {
    try {
      // Test localStorage access
      const testKey = 'health-check-test';
      const testValue = 'test-data';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved !== testValue) {
        throw new Error('localStorage read/write test failed');
      }
      
      return {
        service: 'Booking System',
        status: 'healthy',
        message: 'Booking system is operational',
        details: { localStorageWorking: true },
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'Booking System',
        status: 'error',
        message: 'Booking system error - localStorage may not be available',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };
    }
  }
  
  // Check API connectivity
  private static async checkAPIConnectivity(): Promise<HealthCheckResult> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        return {
          service: 'API Connectivity',
          status: 'warning',
          message: 'API URL not configured',
          timestamp: new Date()
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          service: 'API Connectivity',
          status: 'healthy',
          message: 'API server is responding',
          details: { 
            apiUrl, 
            status: response.status,
            responseTime: Date.now(),
            serverData: data
          },
          timestamp: new Date()
        };
      } else {
        return {
          service: 'API Connectivity',
          status: 'warning',
          message: `API server responded with status ${response.status}`,
          details: { apiUrl, status: response.status },
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        service: 'API Connectivity',
        status: 'warning',
        message: 'API server is not accessible',
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          apiUrl: import.meta.env.VITE_API_URL
        },
        timestamp: new Date()
      };
    }
  }
  
  // Check localStorage
  private static checkLocalStorage(): HealthCheckResult {
    try {
      if (typeof Storage === 'undefined') {
        return {
          service: 'Local Storage',
          status: 'error',
          message: 'localStorage is not supported in this browser',
          timestamp: new Date()
        };
      }
      
      // Test read/write
      const testKey = 'health-check-' + Date.now();
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (value === 'test') {
        return {
          service: 'Local Storage',
          status: 'healthy',
          message: 'localStorage is working correctly',
          timestamp: new Date()
        };
      } else {
        return {
          service: 'Local Storage',
          status: 'error',
          message: 'localStorage read/write test failed',
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        service: 'Local Storage',
        status: 'error',
        message: 'localStorage error - may be disabled or quota exceeded',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };
    }
  }
  
  // Check browser compatibility
  private static checkBrowserCompatibility(): HealthCheckResult {
    if (typeof window === 'undefined') {
      return {
        service: 'Browser Compatibility',
        status: 'healthy',
        message: 'Server-side environment detected',
        timestamp: new Date()
      };
    }
    
    const issues: string[] = [];
    const features: string[] = [];
    
    // Check for required features
    if (typeof fetch === 'undefined') {
      issues.push('fetch API not supported');
    } else {
      features.push('fetch API');
    }
    
    if (typeof Promise === 'undefined') {
      issues.push('Promises not supported');
    } else {
      features.push('Promises');
    }
    
    if (typeof localStorage === 'undefined') {
      issues.push('localStorage not supported');
    } else {
      features.push('localStorage');
    }
    
    if (typeof IntersectionObserver === 'undefined') {
      issues.push('IntersectionObserver not supported');
    } else {
      features.push('IntersectionObserver');
    }
    
    if (issues.length > 0) {
      return {
        service: 'Browser Compatibility',
        status: 'warning',
        message: `Some features not supported: ${issues.join(', ')}`,
        details: { issues, supportedFeatures: features },
        timestamp: new Date()
      };
    } else {
      return {
        service: 'Browser Compatibility',
        status: 'healthy',
        message: 'All required browser features are supported',
        details: { supportedFeatures: features },
        timestamp: new Date()
      };
    }
  }
  
  // Check security headers (client-side detection)
  private static checkSecurityHeaders(): HealthCheckResult {
    if (typeof window === 'undefined') {
      return {
        service: 'Security Headers',
        status: 'healthy',
        message: 'Server-side environment',
        timestamp: new Date()
      };
    }
    
    const warnings: string[] = [];
    
    // Check if running in secure context
    if (!window.isSecureContext && window.location.protocol !== 'https:') {
      warnings.push('Not running in secure context (HTTPS)');
    }
    
    return {
      service: 'Security Headers',
      status: warnings.length > 0 ? 'warning' : 'healthy',
      message: warnings.length > 0 ? `Security warnings: ${warnings.join(', ')}` : 'Security context is valid',
      details: { 
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol
      },
      timestamp: new Date()
    };
  }
  
  // Check HTTPS
  private static checkHTTPS(): HealthCheckResult {
    if (typeof window === 'undefined') {
      return {
        service: 'HTTPS',
        status: 'healthy',
        message: 'Server-side environment',
        timestamp: new Date()
      };
    }
    
    const isHTTPS = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isHTTPS || isLocalhost) {
      return {
        service: 'HTTPS',
        status: 'healthy',
        message: isHTTPS ? 'Running on HTTPS' : 'Running on localhost (HTTPS not required)',
        details: { 
          protocol: window.location.protocol,
          hostname: window.location.hostname
        },
        timestamp: new Date()
      };
    } else {
      return {
        service: 'HTTPS',
        status: 'warning',
        message: 'Not running on HTTPS - some features may not work',
        details: { 
          protocol: window.location.protocol,
          hostname: window.location.hostname
        },
        timestamp: new Date()
      };
    }
  }
  
  // Get health check summary for display
  static getHealthSummary(): string {
    // This would typically return cached results or run a quick check
    return 'System status: Checking... Run full health check for details.';
  }
  
  // Schedule periodic health checks
  static startPeriodicHealthChecks(intervalMinutes: number = 30): number {
    if (typeof window === 'undefined') return 0;
    
    return window.setInterval(async () => {
      try {
        const health = await this.runHealthCheck();
        if (health.overall === 'error') {
          ErrorHandlingService.logError('System health check failed', {
            summary: health.summary,
            errorChecks: health.checks.filter(c => c.status === 'error')
          }, 'error');
        }
      } catch (error) {
        ErrorHandlingService.logError('Health check execution failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 'error');
      }
    }, intervalMinutes * 60 * 1000);
  }
  
  // Stop periodic health checks
  static stopPeriodicHealthChecks(intervalId: number): void {
    if (typeof window !== 'undefined') {
      window.clearInterval(intervalId);
    }
  }
}

export default SystemHealthMonitor;
