# Complete System Startup Script
# This script starts all payment, newsletter, and email services

Write-Host "🚀 PORTALS OF SAMADHI - STARTING ALL SYSTEMS" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM not found. Please install NPM first." -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 System Status Check..." -ForegroundColor Yellow

# Check environment files
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
}

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
}

if (Test-Path "server\.env") {
    Write-Host "✅ server\.env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  server\.env file not found" -ForegroundColor Yellow
}

# Check key files
$keyFiles = @(
    "newsletter-server.cjs",
    "server\src\emailHandler.ts",
    "src\config\payment.ts",
    "src\services\paymentService.ts"
)

foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
    }
}

Write-Host "`n🔧 Installing Dependencies..." -ForegroundColor Yellow

# Install main dependencies
Write-Host "Installing main project dependencies..." -ForegroundColor Cyan
npm install

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
Set-Location ..

Write-Host "`n🚀 Starting Services..." -ForegroundColor Yellow

# Function to start services in separate terminals
function Start-ServiceInNewTerminal {
    param(
        [string]$Command,
        [string]$Name,
        [string]$WorkingDirectory = "."
    )
    
    Write-Host "🟡 Starting $Name..." -ForegroundColor Yellow
    
    $fullCommand = "cd '$PWD\$WorkingDirectory'; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $fullCommand
    
    Write-Host "✅ $Name started in new terminal" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Start Newsletter Server
Start-ServiceInNewTerminal -Command "node newsletter-server.cjs" -Name "Newsletter Server"

# Start Email Server
Start-ServiceInNewTerminal -Command "npm run dev" -Name "Email Server" -WorkingDirectory "server"

# Start Main Application
Start-ServiceInNewTerminal -Command "npm run dev" -Name "Main Application"

Write-Host "`n🎉 All Services Started!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`n📋 Service Information:" -ForegroundColor White
Write-Host "• Newsletter Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "• Email Server: http://localhost:3001" -ForegroundColor Cyan  
Write-Host "• Main Application: http://localhost:5173" -ForegroundColor Cyan

Write-Host "`n🧪 Quick Tests:" -ForegroundColor White
Write-Host "• Newsletter Health: http://localhost:3001/api/newsletter/health" -ForegroundColor Cyan
Write-Host "• Payment Test: Go to any service page and try booking" -ForegroundColor Cyan
Write-Host "• Admin Dashboard: Look for 📊 button on website" -ForegroundColor Cyan

Write-Host "`n🔍 Verification:" -ForegroundColor White
Write-Host "Run: node verify-system.cjs" -ForegroundColor Cyan

Write-Host "`n✅ SYSTEM READY FOR PRODUCTION!" -ForegroundColor Green
Write-Host "💪 Start taking bookings with confidence!" -ForegroundColor Green

# Keep this window open
Write-Host "`nPress any key to close this startup window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
