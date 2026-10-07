#!/bin/bash
# Production Deployment Script for Linux/Unix

echo "🚀 Starting Production Deployment..."

# Check if required files exist
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Copy .env.template and configure."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run TypeScript check
echo "🔍 Checking TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Fix before deployment."
    exit 1
fi

# Build for production
echo "🏗️ Building for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Start services with PM2
echo "🚀 Starting services..."
pm2 start ecosystem.config.js
pm2 save

# Configure PM2 to start on boot
pm2 startup

echo "🎉 Production deployment complete!"
echo "📋 Services status:"
pm2 status

echo "🌐 Application URLs:"
echo "  Main Website: http://localhost:4173"
echo "  Newsletter API: http://localhost:3001/api/newsletter/health"
echo "  Admin Dashboard: Available via floating button on website"
