interface BookingData {
  serviceName?: string;
  practitionerName?: string;
  date?: string;
  email?: string;
}
// Enhanced Error Handling and Logging Service
interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

class ErrorHandlingService {
  private static logs: ErrorLog[] = [];
  private static maxLogs = 1000;
  
  // Log an error with context
  static logError(error: Error | string, context?: Record<string, unknown>, level: 'error' | 'warning' | 'info' = 'error') {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
    
    // Add to local logs
    this.logs.unshift(errorLog);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Console output for development
    if (process.env.NODE_ENV !== 'production') {
      console.group(`🔥 ${level.toUpperCase()}: ${errorLog.message}`);
      console.error('Error:', error);
      if (context) console.log('Context:', context);
      if (errorLog.stack) console.log('Stack:', errorLog.stack);
      console.groupEnd();
    }
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToMonitoringService(errorLog);
    }
    
    return errorLog.id;
  }
  
  // Handle async errors with retry logic
  static async withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  context?: Record<string, unknown>
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        this.logError(error as Error, {
          ...context,
          attempt,
          maxRetries,
          willRetry: attempt < maxRetries
        }, attempt === maxRetries ? 'error' : 'warning');
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }
  
  // Handle payment errors specifically
  static handlePaymentError(error: unknown, paymentMethod: string, amount: number): string {
    let errorCode = 'UNKNOWN';
    let paypalErrorId: string | undefined = undefined;
    if (typeof error === 'object' && error !== null) {
      errorCode = (error as { code?: string }).code ?? 'UNKNOWN';
      const details = (error as { details?: Array<{ issue?: string }> }).details;
      paypalErrorId = details && details[0]?.issue ? details[0].issue : undefined;
    }
    const context = {
      paymentMethod,
      amount,
      errorCode,
      paypalErrorId,
    };
  return this.logError(error as Error | string, context, 'error');
  }
  
  // Handle booking errors specifically  
  static handleBookingError(error: unknown, bookingData: BookingData): string {
    const context = {
      serviceName: bookingData.serviceName,
      practitionerName: bookingData.practitionerName,
      bookingDate: bookingData.date,
      clientEmail: bookingData.email, // Don't log sensitive info in production
    };
  return this.logError(error as Error | string, context, 'error');
  }
  
  // Handle email errors specifically
  static handleEmailError(error: unknown, recipient: string, emailType: string): string {
    const context = {
      recipient: recipient.replace(/(.{2}).*@/, '$1***@'), // Mask email for privacy
      emailType,
    };
  return this.logError(error as Error | string, context, 'error');
  }
  
  // Get recent error logs (for admin dashboard)
  static getRecentLogs(count = 50): ErrorLog[] {
    return this.logs.slice(0, count);
  }
  
  // Get error statistics
  static getErrorStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentLogs = this.logs.filter(log => log.timestamp > oneDayAgo);
    const weeklyLogs = this.logs.filter(log => log.timestamp > oneWeekAgo);
    
    return {
      totalErrors: this.logs.length,
      last24Hours: recentLogs.length,
      lastWeek: weeklyLogs.length,
      errorsByLevel: {
        error: this.logs.filter(log => log.level === 'error').length,
        warning: this.logs.filter(log => log.level === 'warning').length,
        info: this.logs.filter(log => log.level === 'info').length,
      },
      mostCommonErrors: this.getMostCommonErrors(),
    };
  }
  
  // Get most common error messages
  private static getMostCommonErrors() {
    const errorCounts: Record<string, number> = {};
    
    this.logs.forEach(log => {
      errorCounts[log.message] = (errorCounts[log.message] || 0) + 1;
    });
    
    return Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));
  }
  
  // Send error to external monitoring service (placeholder)
  private static async sendToMonitoringService(errorLog: ErrorLog) {
    try {
      // In production, this would send to a service like Sentry, LogRocket, etc.
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
      
      if (!response.ok) {
        console.error('Failed to send error to monitoring service');
      }
    } catch (error) {
      console.error('Error sending to monitoring service:', error);
      // Don't log this error to avoid infinite loops
    }
  }
  
  // Export logs for debugging
  static exportLogs(): string {
    const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Context', 'URL'];
    const rows = this.logs.map(log => [
      log.id,
      log.timestamp.toISOString(),
      log.level,
      log.message,
      JSON.stringify(log.context || {}),
      log.url || '',
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
  
  // Clear old logs (for cleanup)
  static clearOldLogs(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const initialCount = this.logs.length;
    this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
    
    const removedCount = initialCount - this.logs.length;
    if (removedCount > 0) {
      this.logError(`Cleaned up ${removedCount} old error logs`, { 
        daysToKeep, 
        removedCount 
      }, 'info');
    }
  }
}

// Enhanced API Error Handler
export class APIErrorHandler {
  
  static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Unknown error occurred' 
      }));
      
      const error = new Error(
        errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
      
      ErrorHandlingService.logError(error, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
      });
      
      throw error;
    }
    
    return response.json();
  }
  
  static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    maxRetries = 3
  ): Promise<T> {
    return ErrorHandlingService.withRetry(
      async () => {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        
        return this.handleResponse<T>(response);
      },
      maxRetries,
      1000,
      { url, method: options.method || 'GET' }
    );
  }
}

// Form Validation Error Handler
export class FormValidationHandler {
  
  static validateEmail(email: string): { isValid: boolean; message?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }
  
  static validatePhone(phone: string): { isValid: boolean; message?: string } {
  const phoneRegex = /^[+]?[1-9][\d]{3,14}$/;
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    if (!phone.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, message: 'Please enter a valid phone number' };
    }
    
    return { isValid: true };
  }
  
  static validateRequired(value: string, fieldName: string): { isValid: boolean; message?: string } {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    
    return { isValid: true };
  }
  
  static validateBookingForm(formData: Record<string, unknown>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    // Validate required fields
  const nameValidation = this.validateRequired(formData.name as string, 'Name');
    if (!nameValidation.isValid) errors.name = nameValidation.message!;
    
  const emailValidation = this.validateEmail(formData.email as string);
    if (!emailValidation.isValid) errors.email = emailValidation.message!;
    
  const phoneValidation = this.validatePhone(formData.phone as string);
    if (!phoneValidation.isValid) errors.phone = phoneValidation.message!;
    
    // Validate date
    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
  const bookingDate = new Date(formData.date as string);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        errors.date = 'Booking date cannot be in the past';
      }
    }
    
    // Validate time
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default ErrorHandlingService;
