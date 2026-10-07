#!/bin/bash
# Production deployment script for Render.com

echo "🚀 Starting production deployment..."

# Build the frontend with production environment
echo "📦 Building frontend with production environment..."
cp .env.production .env
npm run build

# Verify server files are ready
echo "🔧 Verifying server configuration..."
if [ ! -f "server/index.js" ]; then
    echo "❌ Server file not found!"
    exit 1
fi

# Test server syntax
echo "🧪 Testing server syntax..."
node -c server/index.js
if [ $? -ne 0 ]; then
    echo "❌ Server syntax error!"
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo "🌐 Frontend built successfully in ./dist"
echo "⚡ Server ready at server/index.js"
echo "🔗 API will be available at https://pos-api.onrender.com"
echo "🔗 Frontend will be available at https://www.portalsofsamadhi.com"