# POS Website - Complete System Documentation

## 🎯 Project Overview

The Portals of Selves (POS) website is a comprehensive booking and payment platform for healing services, retreats, workshops, and business consultations. The system includes:

- **Universal Payment System** (PayPal & Stripe integration)
- **Booking Management** (localStorage with admin dashboard)
- **Newsletter System** (Express backend with JSON storage)
- **Responsive UI/UX** (React + TypeScript + Tailwind)
- **Admin Analytics** (Real-time booking stats and CSV export)

## 🏗️ System Architecture

```
POS Website/
├── Frontend (React + TypeScript + Vite)
│   ├── Payment Integration (PayPal + Stripe)
│   ├── Booking Management (Universal system)
│   ├── Admin Dashboard (Analytics & Export)
│   └── Newsletter Component (Frontend UI)
├── Newsletter Backend (Express + Node.js)
│   ├── REST API (/api/newsletter)
│   ├── JSON Storage (newsletter-subscribers.json)
│   └── Email Validation
└── Configuration
    ├── Environment Variables (.env)
    ├── Payment Config (Universal)
    └── Build/Deploy Scripts
```

## 🚀 Quick Start Guide

### 1. Installation & Setup

```powershell
# Clone and install dependencies
cd "POS Website 1"
npm install

# Set up environment variables
# Copy .env.example to .env and update values
cp .env.example .env
```

### 2. Environment Configuration (.env)

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Stripe Configuration  
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here

# Newsletter API (for production)
VITE_NEWSLETTER_API_URL=http://localhost:3001
```

### 3. Start Development

```powershell
# Start main development server
npm run dev

# Start newsletter server (separate terminal)
.\start-newsletter.ps1
```

### 4. Production Build

```powershell
# Build for production
npm run build

# Preview production build
npm run preview
```

## 💳 Payment System

### Features
- ✅ **PayPal Integration** (Live production environment)
- ✅ **Stripe Integration** (Card payments)
- ✅ **Universal Configuration** (Single payment config)
- ✅ **Amount Validation** ($1.00 - $10,000.00)
- ✅ **Multi-Currency Support** (USD default)
- ✅ **Error Handling** (User-friendly error messages)

### Implementation
```typescript
// Universal payment configuration
src/config/payment.ts

// Payment service (handles all payment methods)
src/services/paymentService.ts

// Booking management (localStorage + analytics)
src/services/bookingManager.ts

// Payment UI components
src/components/payment/PayPalPayment.tsx
src/pages/booking-payment.tsx
```

### Testing Payment Flow
1. Navigate to any service page (Feq'ad, Mesq'al, Retreats, Workshops)
2. Fill booking form and click "Book Now"
3. Complete payment on `/booking` page
4. Verify booking in Admin Dashboard

## 📝 Booking System

### Supported Services
- **Feq'ad Services** (Energy healing, spiritual guidance)
- **Mesq'al Services** (Business consultation, administrative)
- **Custom Retreats** (Multi-day healing experiences)
- **Community Workshops** (Group sessions and events)

### Booking Data Structure
```typescript
interface BookingData {
  serviceName: string;
  practitionerName: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  category: 'healing' | 'administrative' | 'retreat' | 'workshop';
  notes?: string;
}
```

### Admin Dashboard Features
- 📊 **Real-time Analytics** (Total bookings, revenue, averages)
- 📥 **CSV Export** (Complete booking data with timestamps)
- 🗑️ **Data Management** (Clear all bookings option)
- 📱 **Responsive Design** (Mobile-friendly modal interface)

Access: Look for "📊 Admin Dashboard" button (bottom-left corner)

## 📬 Newsletter System

### Architecture
- **Frontend**: React component with form validation
- **Backend**: Express.js server with REST API
- **Storage**: JSON file (newsletter-subscribers.json)
- **Validation**: Email format and duplicate checking

### API Endpoints
```
POST /api/newsletter/subscribe
GET /api/newsletter/subscribers (admin only)
GET /api/newsletter/health
```

### Setup & Testing
```powershell
# Start newsletter server
.\start-newsletter.ps1

# Test subscription
curl -X POST http://localhost:3001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🔧 Development Tools

### Available Scripts
```json
{
  "dev": "vite",              // Development server
  "build": "vite build",      // Production build
  "preview": "vite preview",  // Preview build
  "type-check": "tsc --noEmit" // TypeScript check
}
```

### VS Code Tasks
```json
{
  "webpack-dev": "npm run dev" // Background dev server
}
```

### Testing
```javascript
// Load test suite in browser console
// File: test-booking-flow.js
window.runPOSTests();        // Complete test suite
window.testBookingFlow();    // Booking system only
window.testPaymentConfig();  // Payment configuration
window.testNewsletterFlow(); // Newsletter functionality
```

## 📁 File Structure

```
src/
├── components/
│   ├── admin/
│   │   └── BookingDashboard.tsx    // Admin analytics interface
│   ├── home/
│   │   ├── Newsletter.tsx          // Newsletter subscription
│   │   └── BlogSection.tsx         // Blog content display
│   ├── layout/
│   │   ├── Navbar.tsx              // Navigation with booking links
│   │   └── Footer.tsx              // Footer with contact info
│   ├── payment/
│   │   └── PayPalPayment.tsx       // PayPal payment component
│   └── ui/                         // Reusable UI components
├── config/
│   └── payment.ts                  // Universal payment configuration
├── services/
│   ├── paymentService.ts           // Payment processing logic
│   └── bookingManager.ts           // Booking storage & analytics
├── pages/
│   ├── booking-payment.tsx         // Universal payment page
│   ├── feqad-services.tsx          // Feq'ad service listings
│   ├── mesqal-services.tsx         // Mesq'al service listings
│   ├── plan-retreat.tsx            // Retreat booking page
│   └── community-workshops.tsx     // Workshop listings
└── data/
    └── blogPosts.ts                // Blog content (markdown)
```

## 🔐 Security & Production

### Environment Security
- ✅ Environment variables for sensitive keys
- ✅ Client-side keys only (no server secrets)
- ✅ HTTPS-ready configuration
- ✅ CORS configuration for newsletter API

### Data Storage
- **Bookings**: localStorage (client-side, temporary)
- **Newsletter**: JSON file (server-side, persistent)
- **Payments**: External processors (PayPal/Stripe)

### Production Checklist
- [ ] Update PayPal Client ID for production
- [ ] Update Stripe keys for production  
- [ ] Configure newsletter server deployment
- [ ] Set up HTTPS certificates
- [ ] Configure domain and DNS
- [ ] Test all payment flows in production

## 🐛 Troubleshooting

### Common Issues

**Payment Not Working**
```bash
# Check environment variables
echo $VITE_PAYPAL_CLIENT_ID
echo $VITE_STRIPE_PUBLIC_KEY

# Verify configuration
npx tsc --noEmit
```

**Newsletter Errors**
```powershell
# Check if server is running
curl http://localhost:3001/api/newsletter/health

# Restart newsletter server
.\start-newsletter.ps1
```

**TypeScript Errors**
```bash
# Check for type errors
npx tsc --noEmit

# Install missing types
npm install @types/node @types/react
```

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Error Logs
- **Browser Console**: Frontend errors and payment issues
- **Terminal**: Build and TypeScript errors
- **Newsletter Server**: API and subscription errors

## 📊 Analytics & Monitoring

### Booking Analytics
- Total bookings and revenue
- Average booking value
- Payment method breakdown
- Service category breakdown
- Monthly booking trends

### Export Options
- CSV export with all booking details
- Timestamp and transaction tracking
- Client contact information
- Service and payment details

### Performance Metrics
- Page load times (optimized with Vite)
- Payment completion rates
- Newsletter subscription rates
- Mobile responsiveness

## 🔄 Future Enhancements

### Planned Features
- [ ] **Database Integration** (Replace localStorage)
- [ ] **Email Notifications** (Booking confirmations)
- [ ] **Calendar Integration** (Google Calendar sync)
- [ ] **SMS Notifications** (Booking reminders)
- [ ] **User Accounts** (Client portal)
- [ ] **Inventory Management** (Service availability)
- [ ] **Advanced Analytics** (Dashboard improvements)

### Technical Improvements
- [ ] **Backend API** (Replace localStorage with database)
- [ ] **Authentication** (Admin login system)
- [ ] **Testing Suite** (Unit and integration tests)
- [ ] **CI/CD Pipeline** (Automated deployment)
- [ ] **Error Tracking** (Sentry integration)
- [ ] **Performance Monitoring** (Real user metrics)

## 📞 Support & Maintenance

### Contact Information
- **Technical Issues**: Check GitHub issues
- **Payment Problems**: Contact PayPal/Stripe support
- **Business Inquiries**: Use website contact form

### Maintenance Schedule
- **Weekly**: Check booking data and newsletter subscribers
- **Monthly**: Review payment processing and analytics
- **Quarterly**: Update dependencies and security patches

---

**Last Updated**: June 10, 2025  
**Version**: 2.0.0  
**Status**: Production Ready ✅
