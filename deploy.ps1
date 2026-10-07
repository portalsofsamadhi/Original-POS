# Production deployment script for Windows/PowerShell

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Build the frontend with production environment
Write-Host "📦 Building frontend with production environment..." -ForegroundColor Cyan
Copy-Item ".env.production" ".env" -Force
npm run build

# Verify server files are ready
Write-Host "🔧 Verifying server configuration..." -ForegroundColor Cyan
if (-not (Test-Path "server/index.js")) {
    Write-Host "❌ Server file not found!" -ForegroundColor Red
    exit 1
}

# Test server syntax
Write-Host "🧪 Testing server syntax..." -ForegroundColor Cyan
node -c "server/index.js"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server syntax error!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "🌐 Frontend built successfully in ./dist" -ForegroundColor Yellow
Write-Host "⚡ Server ready at server/index.js" -ForegroundColor Yellow
Write-Host "🔗 API will be available at https://pos-api.onrender.com" -ForegroundColor Magenta
Write-Host "🔗 Frontend will be available at https://www.portalsofsamadhi.com" -ForegroundColor Magenta