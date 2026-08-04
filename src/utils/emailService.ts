import { toast } from "../components/ui/use-toast";
import ErrorHandlingService, { APIErrorHandler } from "../services/errorHandling";
import PRODUCTION_CONFIG from "../config/production";
import { TEAM_EMAIL } from "../config/email";
import { apiUrl } from "./apiUrl";

export { TEAM_EMAIL };

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  /** Visitor email — used so team can Reply directly to them */
  replyTo?: string;
  priority?: 'high' | 'normal' | 'low';
  templateName?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<EmailResponse> => {
  try {
    // Validate email payload
    if (!payload.to || !payload.subject || !payload.html) {
      throw new Error('Missing required email fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.to)) {
      throw new Error('Invalid email address format');
    }

    const response = await APIErrorHandler.makeRequest<EmailResponse>(
      apiUrl("/api/send-email"),
      {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'portals-of-samadhi-website'
        }),
      },
      PRODUCTION_CONFIG.email.maxRetries
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to send email');
    }

    ErrorHandlingService.logError(
      `Email sent successfully to ${payload.to}`,
      { 
        recipient: payload.to,
        subject: payload.subject,
        messageId: response.messageId,
        templateName: payload.templateName 
      },
      'info'
    );

    return { success: true, messageId: response.messageId };
  } catch (error) {
    ErrorHandlingService.handleEmailError(
      error,
      payload.to,
      payload.templateName || "generic"
    );
    throw error;
  }
};

export const sendBookingConfirmation = async (
  email: string,
  serviceName: string,
  practitionerName: string,
  date: Date,
  time: string,
  paymentCompleted: boolean = false,
  transactionId?: string,
  amount?: number
) => {
  const subject = `✅ Booking Confirmed - ${serviceName} with ${practitionerName}`;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #15803d, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; color: #374151; }
        .detail-value { color: #111827; }
        .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-align: center; margin: 20px 0; }
        .status.confirmed { background: #dcfce7; color: #166534; }
        .contact-info { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        @media (max-width: 600px) {
          .container { padding: 10px; }
          .detail-row { flex-direction: column; }
          .detail-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🕉️ Portals of Samadhi</div>
          <h1 style="margin: 0;">Booking Confirmation</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your wellness journey is confirmed!</p>
        </div>
        
        <div class="content">
          <div class="status confirmed">
            ✅ Booking Confirmed
          </div>
          
          <div class="booking-details">
            <h2 style="margin-top: 0; color: #15803d;">Appointment Details</h2>
            
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Practitioner:</span>
              <span class="detail-value">${practitionerName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(date)}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${time}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Payment Status:</span>
              <span class="detail-value" style="color: ${paymentCompleted ? '#22c55e' : '#f59e0b'}">
                ${paymentCompleted ? '✅ Completed' : '⏳ Pending'}
              </span>
            </div>
            
            ${transactionId ? `
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value">${transactionId}</span>
            </div>
            ` : ''}
            
            ${amount ? `
            <div class="detail-row">
              <span class="detail-label">Amount Paid:</span>
              <span class="detail-value">$${amount.toFixed(2)}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="contact-info">
            <h3 style="margin-top: 0; color: #15803d;">📞 Contact Information</h3>
            <p><strong>Website:</strong> <a href="${PRODUCTION_CONFIG.urls.frontend}" style="color: #15803d;">${PRODUCTION_CONFIG.urls.frontend}</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@portalsofsamadhi.com" style="color: #15803d;">info@portalsofsamadhi.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+15102919399" style="color: #15803d;">(510) 291-9399</a></p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">📝 Important Notes</h3>
            <ul style="color: #6b7280;">
              <li>Please arrive 5-10 minutes early for your appointment</li>
              <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
              <li>Bring any relevant health information or questions you may have</li>
              <li>We look forward to supporting your wellness journey!</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>This confirmation was sent from Portals of Samadhi</p>
          <p>Oakland, California - Airy Castle, Jamaica</p>
          <p>© ${new Date().getFullYear()} Portals of Samadhi. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ 
    to: email, 
    subject, 
    html,
    priority: 'high',
    templateName: 'booking-confirmation'
  });
};

export const sendPaymentReceipt = async (
  email: string,
  transactionId: string,
  amount: number,
  paymentMethod: string,
  serviceName: string
) => {
  const subject = `🧾 Payment Receipt - ${serviceName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #15803d; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .receipt-details { background: white; padding: 20px; border-radius: 8px; border: 2px solid #22c55e; }
        .amount { font-size: 24px; font-weight: bold; color: #15803d; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧾 Payment Receipt</h1>
          <p>Portals of Samadhi</p>
        </div>
        <div class="content">
          <div class="receipt-details">
            <div class="amount">$${amount.toFixed(2)}</div>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> ✅ Completed</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ 
    to: email, 
    subject, 
    html,
    priority: 'normal',
    templateName: 'payment-receipt'
  });
};

export const sendBookingReminder = async (
  email: string,
  serviceName: string,
  practitionerName: string,
  date: Date,
  time: string,
  hoursUntil: number
) => {
  const subject = `⏰ Reminder: ${serviceName} appointment in ${hoursUntil} hours`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fffbeb; padding: 30px; border-radius: 0 0 8px 8px; }
        .reminder-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Appointment Reminder</h1>
        </div>
        <div class="content">
          <div class="reminder-box">
            <h2>Your appointment is coming up!</h2>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Practitioner:</strong> ${practitionerName}</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>In:</strong> ${hoursUntil} hours</p>
          </div>
          <p>Please arrive 5-10 minutes early. If you need to reschedule, please contact us as soon as possible.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ 
    to: email, 
    subject, 
    html,
    priority: 'high',
    templateName: 'appointment-reminder'
  });
};
