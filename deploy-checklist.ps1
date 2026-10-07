<#
deploy-checklist.ps1
Runs smoke tests against the pos-api endpoints. Update $apiBase as needed.
Usage: .\deploy-checklist.ps1
#>

$ErrorActionPreference = 'Stop'

# Set API base (change to production URL or keep localhost for local testing)
# In PowerShell, use an explicit check for the env var
if ($env:API_BASE -and $env:API_BASE.Trim().Length -gt 0) {
    $apiBase = $env:API_BASE
} else {
    $apiBase = 'http://localhost:10000'
}

Write-Host "Running smoke tests against $apiBase" -ForegroundColor Cyan

function Test-Health {
    Write-Host 'Checking /api/health...' -NoNewline
    $res = Invoke-RestMethod -Uri "$apiBase/api/health" -Method GET -ErrorAction Stop
    Write-Host ' OK' -ForegroundColor Green
    $res | ConvertTo-Json -Depth 5
}

function Get-DebugConfig {
    if ($env:DEBUG_GOOGLE_AUTH -ne 'true') { Write-Host 'Skipping debug check (DEBUG_GOOGLE_AUTH != true)'; return }
    Write-Host 'Checking /api/debug/google-config...' -NoNewline
    $res = Invoke-RestMethod -Uri "$apiBase/api/debug/google-config" -Method GET -ErrorAction Stop
    Write-Host ' OK' -ForegroundColor Green
    $res | ConvertTo-Json -Depth 5
}

function Test-NewsletterSubscription {
    Write-Host "Checking /api/newsletter/check?email=you@example.com" -NoNewline
    $res = Invoke-RestMethod -Uri "$apiBase/api/newsletter/check?email=you@example.com" -Method GET -ErrorAction Stop
    Write-Host ' OK' -ForegroundColor Green
    $res | ConvertTo-Json -Depth 5
}

function Get-AdminBookings {
    if (-not $env:ADMIN_BEARER_TOKEN) { Write-Host 'Skipping admin bookings (ADMIN_BEARER_TOKEN not set)'; return }
    Write-Host 'Checking /api/bookings (admin) ...' -NoNewline
    $headers = @{ Authorization = $env:ADMIN_BEARER_TOKEN }
    $res = Invoke-RestMethod -Uri "$apiBase/api/bookings" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host ' OK' -ForegroundColor Green
    $res | ConvertTo-Json -Depth 5
}

try {
    Test-Health
    Get-DebugConfig
    Test-NewsletterSubscription
    Get-AdminBookings
    Write-Host 'All smoke tests completed.' -ForegroundColor Green
} catch {
    Write-Host 'Smoke test failed:' -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
