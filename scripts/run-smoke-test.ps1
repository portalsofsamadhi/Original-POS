# PowerShell wrapper to run the smoke-test Node script
# Usage: Set environment variables as needed, then run this script from repo root.

$env:FRONTEND_URL = $env:FRONTEND_URL # keep existing if set
$env:API_URL = $env:API_URL
if (-not $env:TEST_EMAIL) { $env:TEST_EMAIL = "smoke-test+$(Get-Date -UFormat %s)@example.com" }

Write-Host "Running smoke test..." -ForegroundColor Cyan
node .\scripts\smoke-test.js

if ($LASTEXITCODE -eq 0) { Write-Host "Smoke test passed" -ForegroundColor Green } else { Write-Host "Smoke test failed (exit code $LASTEXITCODE)" -ForegroundColor Red }
