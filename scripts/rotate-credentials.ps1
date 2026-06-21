#!/usr/bin/env pwsh
# Credential Rotation Assistant
# This script guides you through rotating all exposed credentials

param(
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"

Write-Host "=== Credential Rotation Assistant ===" -ForegroundColor Yellow
Write-Host ""

function Show-StripeRotation {
    Write-Host "🔄 STRIPE CREDENTIAL ROTATION" -ForegroundColor Cyan
    Write-Host "Current exposed key: REDACTED_STRIPE_PUBLIC_KEY (redacted in repo)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://dashboard.stripe.com/apikeys" -ForegroundColor White
    Write-Host "2. Click 'Create restricted key' or 'Reveal' existing secret key" -ForegroundColor White
    Write-Host "3. Copy the NEW secret key (sk_live_...)" -ForegroundColor White
    Write-Host "4. Update your production environment variables" -ForegroundColor White
    Write-Host "5. Delete the old public key if possible, or regenerate" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Test payments after rotation!" -ForegroundColor Red
}

function Show-PayPalRotation {
    Write-Host "🔄 PAYPAL CREDENTIAL ROTATION" -ForegroundColor Cyan
    Write-Host "Current exposed client ID: AcChyGp-9gAhHh_..." -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://developer.paypal.com/developer/applications/" -ForegroundColor White
    Write-Host "2. Select your application" -ForegroundColor White
    Write-Host "3. Generate new Client ID and Secret" -ForegroundColor White
    Write-Host "4. Update VITE_PAYPAL_CLIENT_ID in .env files" -ForegroundColor White
    Write-Host "5. Update PayPal secret in production environment" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Test PayPal payments after rotation!" -ForegroundColor Red
}

function Show-SMTPRotation {
    Write-Host "🔄 SMTP CREDENTIAL ROTATION" -ForegroundColor Cyan
    Write-Host "Current exposed password: xofw jkau..." -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Google Account settings: https://myaccount.google.com/" -ForegroundColor White
    Write-Host "2. Navigate to Security > 2-Step Verification > App passwords" -ForegroundColor White
    Write-Host "3. Delete the old app password" -ForegroundColor White
    Write-Host "4. Generate a new app password for 'Mail'" -ForegroundColor White
    Write-Host "5. Update SMTP_PASS and EMAIL_APP_PASSWORD in server/.env" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Test email functionality after rotation!" -ForegroundColor Red
}

function Show-JWTRotation {
    Write-Host "🔄 JWT SECRET ROTATION" -ForegroundColor Cyan
    Write-Host "Current JWT secret may be exposed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Yellow
    Write-Host "1. Generate new JWT secret:" -ForegroundColor White
    Write-Host "   node -e `"console.log(require('crypto').randomBytes(64).toString('hex'))`"" -ForegroundColor Gray
    Write-Host "2. Update JWT_SECRET in production environment" -ForegroundColor White
    Write-Host "3. All existing JWT tokens will be invalidated" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Users will need to log in again after rotation!" -ForegroundColor Red
}

function Update-LocalEnvFiles {
    Write-Host "🔄 UPDATING LOCAL ENVIRONMENT FILES" -ForegroundColor Cyan
    Write-Host ""
    
    # Get new credentials
    $newStripeKey = Read-Host "Enter new Stripe public key (pk_live_...)"
    $newPayPalClientId = Read-Host "Enter new PayPal client ID"
    $newSMTPPass = Read-Host "Enter new SMTP app password" -AsSecureString
    $newJWTSecret = Read-Host "Enter new JWT secret"
    
    # Convert secure string
    $smtpPlainText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newSMTPPass))
    
    # Update .env.local
    Write-Host "Updating .env.local..." -ForegroundColor Yellow
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent -replace "REDACTED_STRIPE_PUBLIC_KEY", $newStripeKey
    $envContent = $envContent -replace "REDACTED_PAYPAL_CLIENT_ID", $newPayPalClientId
    Set-Content ".env.local" -Value $envContent
    
    # Update server/.env
    Write-Host "Updating server/.env..." -ForegroundColor Yellow
    $serverEnvContent = Get-Content "server/.env" -Raw
    $serverEnvContent = $serverEnvContent -replace "REDACTED_SMTP_PASS", $smtpPlainText
    $serverEnvContent = $serverEnvContent -replace "REDACTED_EMAIL_APP_PASSWORD", $smtpPlainText
    $serverEnvContent = $serverEnvContent -replace "your-jwt-secret-key-here", $newJWTSecret
    Set-Content "server/.env" -Value $serverEnvContent
    
    Write-Host "✅ Local environment files updated!" -ForegroundColor Green
    Write-Host "⚠️  Remember to update production environment variables too!" -ForegroundColor Yellow
}

# Main menu
if ($Service -eq "") {
    Write-Host "Choose credential rotation option:" -ForegroundColor Yellow
    Write-Host "1. Show Stripe rotation steps" -ForegroundColor White
    Write-Host "2. Show PayPal rotation steps" -ForegroundColor White
    Write-Host "3. Show SMTP rotation steps" -ForegroundColor White
    Write-Host "4. Show JWT rotation steps" -ForegroundColor White
    Write-Host "5. Update local environment files (interactive)" -ForegroundColor White
    Write-Host "6. Show all rotation steps" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter choice (1-6)"
    
    switch ($choice) {
        "1" { Show-StripeRotation }
        "2" { Show-PayPalRotation }
        "3" { Show-SMTPRotation }
        "4" { Show-JWTRotation }
        "5" { Update-LocalEnvFiles }
        "6" { 
            Show-StripeRotation
            Write-Host ""
            Show-PayPalRotation
            Write-Host ""
            Show-SMTPRotation
            Write-Host ""
            Show-JWTRotation
        }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
} else {
    switch ($Service.ToLower()) {
        "stripe" { Show-StripeRotation }
        "paypal" { Show-PayPalRotation }
        "smtp" { Show-SMTPRotation }
        "jwt" { Show-JWTRotation }
        "update" { Update-LocalEnvFiles }
        default { Write-Host "Unknown service: $Service" -ForegroundColor Red }
    }
}

Write-Host ""
Write-Host "💡 Usage examples:" -ForegroundColor Cyan
Write-Host "  .\scripts\rotate-credentials.ps1 -Service stripe" -ForegroundColor Gray
Write-Host "  .\scripts\rotate-credentials.ps1 -Service update" -ForegroundColor Gray