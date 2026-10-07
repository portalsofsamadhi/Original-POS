# 🚀 Render Deployment Guide for POS Website

## Overview
Your POS Website has been optimized for Render deployment with:
- **Frontend**: Static React/Vite app
- **Backend**: Node.js Express API server
- **Database**: File-based JSON storage (upgradeable to PostgreSQL)

## 🔧 Changes Made for Render Compatibility

### 1. **Backend Migration (PHP → Node.js)**
- Created `server/index.js` with Express API
- Replicated PHP functionality:
  - `/api/bookings` - Get/Create bookings
  - `/api/newsletter/subscribers` - Newsletter management
  - `/api/newsletter/subscribe` - User subscription
  - `/api/newsletter/update-profile` - Profile updates
  - `/api/health` - Health check

### 2. **Updated API Calls**
- Frontend now uses environment-aware API URLs
- Development: `http://localhost:10000`
- Production: Set automatically by Render

### 3. **Configuration Files**
- **`render.yaml`**: Defines both frontend and backend services
- **`.env.development`**: Local development API URL
- **`.env.production`**: Production environment (populated by Render)

### 4. **Package.json Updates**
- Added backend development scripts
- Added CORS dependency
- Added concurrently for full-stack development

## 📦 Deployment Steps

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Optimize for Render deployment with Node.js backend"
git push origin main
```

### 2. **Create Render Services**

#### Frontend (Static Site)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New Static Site"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `pos-website`
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `./dist`

#### Backend API (Web Service)
1. Click "New Web Service"
2. Connect same GitHub repo
3. Configure:
   - **Name**: `pos-api`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci`
   - **Start Command**: `node server/index.js`
   - **Plan**: `Starter` (Free)

### 3. **Environment Variables**
Set in Render dashboard for frontend:
- `VITE_API_URL`: Will be auto-populated with backend URL

## 🧪 Local Testing

### Full Stack Development
```bash
# Terminal 1: Frontend (port 3002)
npm run dev

# Terminal 2: Backend (port 10000)  
npm run dev:server

# Or run both together:
npm run dev:full
```

### Test API Endpoints
- Health: `http://localhost:10000/api/health`
- Bookings: `http://localhost:10000/api/bookings` (with auth header)
- Newsletter: `http://localhost:10000/api/newsletter/subscribers`

## 📊 Production URLs (After Deployment)

- **Frontend**: `https://pos-website.onrender.com`
- **Backend API**: `https://pos-api.onrender.com`
- **Health Check**: `https://pos-api.onrender.com/api/health`

## 🔐 Security Features

- **CORS**: Configured to allow frontend domain
- **Bearer Token**: Admin endpoints require authentication
- **Headers**: Security headers configured
- **Environment**: Production/development environment detection

## 📝 File Storage

Currently using JSON files for data storage:
- `bookings.json` - Booking data
- `subscribers.json` - Newsletter subscribers

### 🎯 Database Upgrade Path (Optional)
For production scaling, consider upgrading to PostgreSQL:
1. Add PostgreSQL service in `render.yaml`
2. Replace file operations with database queries
3. Use environment variables for database connection

## 🚨 Troubleshooting

### Common Issues:
1. **500 Error**: Check server logs in Render dashboard
2. **API Connection**: Verify `VITE_API_URL` environment variable
3. **CORS Errors**: Ensure backend CORS settings include frontend domain
4. **Build Failures**: Check Node.js version compatibility

### Debug Commands:
```bash
# Check server syntax
node -c server/index.js

# Test API locally
curl http://localhost:10000/api/health

# Check environment variables
echo $VITE_API_URL
```

## 🎉 Benefits of This Setup

1. **Free Hosting**: Both services run on Render's free tier
2. **Auto-deployment**: Pushes to main branch auto-deploy
3. **Scalable**: Easy to upgrade to paid tiers for more resources
4. **Monitoring**: Built-in logging and health checks
5. **SSL**: Automatic HTTPS certificates
6. **CDN**: Static files served via global CDN

## 📈 Next Steps After Deployment

1. **Test all functionality** on production URLs
2. **Update domain settings** if using custom domain
3. **Monitor performance** via Render dashboard
4. **Set up monitoring** for health checks
5. **Consider database migration** for higher traffic

Your app is now **Render-ready**! The migration from PHP to Node.js should resolve the production 500 errors you were experiencing.
