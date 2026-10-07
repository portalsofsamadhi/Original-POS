# DreamHost Shared Hosting Deployment Guide

## 🎯 Overview

This guide shows how to deploy your POS Website to DreamHost Shared Hosting using:
- **Static files** for the React frontend
- **PHP backend** for the newsletter API
- **MySQL database** for subscriber storage

## 📋 Pre-Deployment Checklist

### 1. Build the Frontend
```powershell
# Build the React app for production
npm run build
```

### 2. Prepare PHP Backend
- ✅ PHP files created in `/php-backend/` folder
- ✅ MySQL-compatible database service
- ✅ CORS headers for cross-domain requests

## 🚀 Deployment Steps

### Step 1: Set Up MySQL Database

1. **Login to DreamHost Panel**
2. **Navigate to MySQL Databases**
3. **Create New Database:**
   - Database Name: `newsletter_db`
   - Hostname: Choose or create hostname
   - Username: Create database user
   - Password: Generate secure password

4. **Note down credentials:**
   ```
   Hostname: mysql.yourdomain.com
   Database: newsletter_db
   Username: your_db_user
   Password: your_secure_password
   ```

### Step 2: Configure PHP Backend

1. **Edit `php-backend/newsletter-service.php`:**
   ```php
   private $host = 'mysql.yourdomain.com';     // Your MySQL hostname
   private $dbname = 'newsletter_db';          // Your database name
   private $username = 'your_db_user';         // Your database username
   private $password = 'your_secure_password'; // Your database password
   ```

2. **Update admin key in `subscribers.php`:**
   ```php
   $adminKey = 'your_unique_admin_key_here'; // Change this!
   ```

### Step 3: Upload Files to DreamHost

#### Option A: File Manager (DreamHost Panel)
1. Login to DreamHost Panel
2. Go to **Files** → **File Manager**
3. Navigate to your domain folder (e.g., `yourdomain.com/`)

#### Option B: FTP/SFTP
Use your preferred FTP client with DreamHost credentials.

#### Upload Structure:
```
yourdomain.com/
├── index.html              (from dist/)
├── assets/                 (from dist/assets/)
├── images/                 (from dist/images/)
├── client-logos/           (from dist/client-logos/)
├── videos/                 (from dist/videos/)
├── manifest.json           (from dist/)
├── robots.txt              (from dist/)
├── sitemap.xml             (from dist/)
├── api/
│   └── newsletter/
│       ├── subscribe.php       (renamed from subscribe.php)
│       ├── update-profile.php  (renamed from update-profile.php)
│       ├── subscribers.php     (renamed from subscribers.php)
│       ├── health.php          (renamed from health.php)
│       └── newsletter-service.php
└── .htaccess               (optional - for URL rewriting)
```

### Step 4: Upload Frontend Files

1. **Upload all files from `dist/` folder** to your domain root
2. **Maintain the folder structure** exactly as in the `dist/` folder

### Step 5: Upload PHP Backend

1. **Create `/api/newsletter/` folder** in your domain root
2. **Upload PHP files:**
   - `newsletter-service.php` → `/api/newsletter/newsletter-service.php`
   - `subscribe.php` → `/api/newsletter/subscribe.php`
   - `update-profile.php` → `/api/newsletter/update-profile.php`
   - `subscribers.php` → `/api/newsletter/subscribers.php`
   - `health.php` → `/api/newsletter/health.php`

### Step 6: Configure Environment Variables

Create `.env` file in your domain root:
```env
# Production Environment
VITE_NEWSLETTER_API_URL=https://yourdomain.com
VITE_PAYPAL_CLIENT_ID=your_live_paypal_client_id
VITE_STRIPE_PUBLIC_KEY=your_live_stripe_public_key
```

### Step 7: Create .htaccess (Optional)

Create `.htaccess` in domain root for better routing:
```apache
# React Router support
RewriteEngine On
RewriteBase /

# Handle Angular and other client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api/). /index.html [L]

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🧪 Testing Your Deployment

### 1. Test Main Website
Visit: `https://yourdomain.com`
- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ All service pages accessible

### 2. Test Newsletter API
```bash
# Health check
curl https://yourdomain.com/api/newsletter/health.php

# Test subscription
curl -X POST https://yourdomain.com/api/newsletter/subscribe.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3. Test Booking Flow
1. Navigate to any service page
2. Fill out booking form
3. Proceed to payment page
4. Test payment processing

### 4. Test Admin Dashboard
1. Look for "📊 Admin Dashboard" button
2. Verify booking analytics work
3. Test CSV export functionality

## 🔧 Troubleshooting

### Common Issues

#### **Database Connection Errors**
- Verify MySQL credentials in `newsletter-service.php`
- Check database exists and user has permissions
- Ensure hostname is correct

#### **CORS Errors**
- Verify `setCorsHeaders()` is called in PHP files
- Check `Access-Control-Allow-Origin` headers

#### **404 Errors for API**
- Verify PHP files are uploaded correctly
- Check folder structure: `/api/newsletter/`
- Ensure `.htaccess` doesn't interfere

#### **Payment Issues**
- Verify PayPal and Stripe keys in `.env`
- Check HTTPS is enabled
- Test with PayPal sandbox first

### Error Logs
Check DreamHost error logs:
1. Go to DreamHost Panel
2. **Files** → **Error Logs**
3. Review PHP errors

## 📊 Performance Optimization

### Already Implemented ✅
- Gzip compression in `.htaccess`
- Browser caching headers
- Optimized asset bundling (Vite)
- Minified CSS/JS
- Image optimization

### Additional Optimizations
- Enable DreamHost CDN if available
- Use WebP images where possible
- Monitor Core Web Vitals

## 🔐 Security Checklist

- ✅ HTTPS enabled (DreamHost provides free SSL)
- ✅ Database credentials secured
- ✅ Admin endpoints protected
- ✅ Input validation in PHP
- ✅ SQL injection prevention (PDO)
- ✅ CORS properly configured

## 📞 Support

### DreamHost Support
- **Panel**: Your DreamHost control panel
- **Documentation**: DreamHost knowledge base
- **Tickets**: Submit support tickets for hosting issues

### Application Support
- Check error logs for PHP issues
- Verify API endpoints with browser/Postman
- Monitor newsletter subscription flow

## 🎉 Go Live!

Your POS Website is now live on DreamHost with:
- ✅ **Professional React frontend**
- ✅ **PHP backend with MySQL database**
- ✅ **Universal payment processing**
- ✅ **Newsletter subscription system**
- ✅ **Admin analytics dashboard**

**Visit your live website:** `https://yourdomain.com` 🚀

---

**Deployment Status**: ✅ **READY FOR DREAMHOST**  
**Last Updated**: June 11, 2025
