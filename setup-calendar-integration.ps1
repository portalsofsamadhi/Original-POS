# Google Calendar Integration Setup Script
# Run this script when you're ready to set up Google Calendar integration

Write-Host "Google Calendar Integration Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Composer is installed
Write-Host "Checking for Composer..." -ForegroundColor Yellow
try {
    $composerVersion = composer --version 2>$null
    if ($composerVersion) {
        Write-Host "✓ Composer is installed: $composerVersion" -ForegroundColor Green
        
        # Install PHP dependencies
        Write-Host "Installing Google API Client..." -ForegroundColor Yellow
        Set-Location "php-backend"
        composer install
        Set-Location ".."
        Write-Host "✓ Google API Client installed" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Composer not found. Installing Composer..." -ForegroundColor Red
    Write-Host "Please install Composer from https://getcomposer.org/download/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Check for service account credentials
Write-Host "Checking for Google service account credentials..." -ForegroundColor Yellow
if (Test-Path "php-backend\service-account.json") {
    Write-Host "✓ Service account credentials found" -ForegroundColor Green
} else {
    Write-Host "✗ Service account credentials not found" -ForegroundColor Red
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Google Cloud Console (https://console.cloud.google.com/)" -ForegroundColor Cyan
    Write-Host "2. Create or select a project" -ForegroundColor Cyan
    Write-Host "3. Enable the Google Calendar API" -ForegroundColor Cyan
    Write-Host "4. Create a service account" -ForegroundColor Cyan
    Write-Host "5. Download the JSON key file" -ForegroundColor Cyan
    Write-Host "6. Rename it to 'service-account.json' and place in php-backend folder" -ForegroundColor Cyan
    Write-Host "7. Share your calendar with the service account email" -ForegroundColor Cyan
}

# Test calendar integration
Write-Host "Testing calendar integration..." -ForegroundColor Yellow
if ((Test-Path "php-backend\vendor\autoload.php") -and (Test-Path "php-backend\service-account.json")) {
    Write-Host "✓ All components ready for Google Calendar integration" -ForegroundColor Green
    Write-Host "Your booking system will now automatically add events to Google Calendar" -ForegroundColor Green
} else {
    Write-Host "⚠ Using fallback calendar system (ICS email attachments)" -ForegroundColor Yellow
    Write-Host "Calendar invitations will be sent via email until Google API is set up" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete! Your booking system is ready." -ForegroundColor Green
