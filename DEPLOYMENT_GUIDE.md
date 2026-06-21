# POS Website - Deployment Guide

## 🚀 Deployment Steps

### 1. Pre-Deployment Checklist

```powershell
# Verify all components work
npm run type-check          # Check TypeScript
npm run build               # Test production build
npm run preview            # Test production locally

# Test all systems
.\start-newsletter.ps1     # Start newsletter server
# Open browser and test booking flow
# Verify admin dashboard works
# Test newsletter subscription
```

### 2. Production Environment Setup

#### Option A: Static Hosting (Netlify/Vercel)
```bash
# Build for static deployment
npm run build

# Deploy dist/ folder to:
# - Netlify: Connect GitHub repo
# - Vercel: Connect GitHub repo  
# - GitHub Pages: Use dist/ folder
```

#### Option B: VPS/Server Deployment
```bash
# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Clone and setup
git clone [repository-url]
cd "POS Website 1"
npm install
npm run build

# Start services
pm2 start "npm run preview" --name "pos-website"
pm2 start newsletter-server.ts --name "newsletter-api"
pm2 save
```

### 3. Environment Variables (Production)

Create `.env` file with production values:
```env
# PayPal (LIVE keys)
VITE_PAYPAL_CLIENT_ID=your_live_paypal_client_id

# Stripe (LIVE keys)  
VITE_STRIPE_PUBLIC_KEY=your_live_stripe_public_key

# Newsletter API URL (production server)
VITE_NEWSLETTER_API_URL=https://yourdomain.com/api

# Email service (if using newsletter)
EMAIL_USER=your_email@domain.com
EMAIL_APP_PASSWORD=your_app_password
```

### 4. Domain & SSL Setup

```bash
# Configure Nginx (if using VPS)
sudo nano /etc/nginx/sites-available/portalsofsamadhi.com

# Sample Nginx config:
server {
    listen 443 ssl;
    server_name portalsofsamadhi.com www.portalsofsamadhi.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:4173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Database Migration (Future)

When ready to move from localStorage to database:
```bash
# Install MongoDB or PostgreSQL
# Update booking service to use database
# Migrate existing localStorage data
# Update admin dashboard to use database API
```

### 6. Monitoring & Backup

```bash
# Setup log monitoring
pm2 logs pos-website
pm2 logs newsletter-api

# Backup script
#!/bin/bash
# backup-pos.sh
tar -czf "pos-backup-$(date +%Y%m%d).tar.gz" \
  dist/ \
  newsletter-subscribers.json \
  .env
```

### 7. Testing Production

```javascript
// In browser console after deployment
// Test payment configuration
fetch('/api/newsletter/health')
  .then(r => r.json())
  .then(d => console.log('Newsletter API:', d));

// Test booking flow
window.runPOSTests(); // If test file is included
```

### 8. Go-Live Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] PayPal live credentials verified
- [ ] Stripe live credentials verified  
- [ ] Newsletter API accessible
- [ ] All booking flows tested
- [ ] Admin dashboard accessible
- [ ] Error tracking configured
- [ ] Backup system in place
- [ ] Monitoring alerts setup

---

**Status**: Ready for Deployment ✅  
**Last Updated**: June 10, 2025
