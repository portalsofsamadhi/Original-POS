import { useState } from 'react';
import { createPortal } from 'react-dom';

const PrivacyPolicy = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const privacyContent = `
PRIVACY POLICY

Last Updated: ${new Date().toLocaleDateString()}

1. INFORMATION WE COLLECT

We collect information you provide directly to us, such as:
Personal information (name, email address, phone number)
Payment information (processed securely through third-party providers)
Booking and appointment details
Communications with us
Usage data and analytics

2. HOW WE USE YOUR INFORMATION

We use the information we collect to:
Provide, maintain, and improve our services
Process bookings and payments
Send you confirmations, updates, and marketing communications
Respond to your comments and questions
Analyze usage patterns and improve user experience
Comply with legal obligations

3. INFORMATION SHARING

We may share your information with:
Service providers who assist in our operations
Payment processors for transaction processing
Legal authorities when required by law
Business partners with your consent

4. MOBILE APPLICATION

Our mobile application may:
Access device storage for app functionality
Use device cameras/microphones with your permission
Collect device information for optimization
Send push notifications (which you can disable)
Access location data (with your explicit consent)

5. DATA SECURITY

We implement appropriate security measures including:
Encryption of sensitive data
Secure server infrastructure
Regular security audits
Limited access to personal information

6. COOKIES AND TRACKING

We use cookies and similar technologies to:
Remember your preferences
Analyze website traffic
Provide personalized experiences
Enable social media features

7. YOUR RIGHTS

You have the right to:
Access your personal information
Correct inaccurate data
Request deletion of your data
Opt-out of marketing communications
Withdraw consent for data processing

8. DATA RETENTION

We retain your information for as long as necessary to:
Provide our services
Comply with legal obligations
Resolve disputes
Enforce our agreements

9. INTERNATIONAL TRANSFERS

Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place.

10. CHILDREN'S PRIVACY

Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.

11. CALIFORNIA PRIVACY RIGHTS

California residents have additional rights under the CCPA, including the right to know what personal information is collected and how it's used.

12. CHANGES TO THIS POLICY

We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.

13. CONTACT INFORMATION

If you have questions about this privacy policy, please contact us at:
Email: info@portalsofsamadhi.com
Website: https://portalsofsamadhi.com

14. APP-SPECIFIC TERMS

If you install our mobile application:
The app may collect device identifiers for functionality
We may access device features with your permission
App usage data helps us improve performance
You can uninstall the app at any time
App data may be stored locally on your device

By using our services, you acknowledge that you have read and understood this Privacy Policy.
  `;

  return (
    <>
      <button
        onClick={() => setShowPrivacyModal(true)}
        className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
        style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Privacy Policy
      </button>

      {showPrivacyModal && typeof window !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#15803d'
              }}>
                Privacy Policy
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  lineHeight: 1
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1,
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#374151'
            }}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {privacyContent}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowPrivacyModal(false)}
                style={{
                  backgroundColor: '#15803d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#166534';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#15803d';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PrivacyPolicy;
