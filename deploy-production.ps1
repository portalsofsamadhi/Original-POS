#!/usr/bin/env pwsh
# Production Build and Deploy Script

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Green

# Check if required files exist
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found. Copy .env.template and configure." -ForegroundColor Red
    exit 1
}

# Run TypeScript check
Write-Host "🔍 Checking TypeScript..." -ForegroundColor Blue
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript errors found. Fix before deployment." -ForegroundColor Red
    exit 1
}

# Build for production
Write-Host "🏗️ Building for production..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed." -ForegroundColor Red
    exit 1
}

# Test production build
Write-Host "🧪 Testing production build..." -ForegroundColor Blue
npm run preview &
$previewPid = $!
Start-Sleep 5

# Test health endpoints
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4173" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main website is responsive" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Main website test failed" -ForegroundColor Red
}

# Stop preview server
Stop-Process -Id $previewPid -Force

Write-Host "🎉 Production build ready for deployment!" -ForegroundColor Green
Write-Host "📁 Built files are in: ./dist/" -ForegroundColor Yellow
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy ./dist/ folder to your hosting provider" -ForegroundColor White
Write-Host "  2. Start newsletter server: .\start-newsletter.ps1" -ForegroundColor White
Write-Host "  3. Configure SSL and domain" -ForegroundColor White
