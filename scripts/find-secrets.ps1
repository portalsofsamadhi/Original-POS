# Find known secret patterns across the working tree (PowerShell)
# Usage: Open PowerShell at repo root and run: .\scripts\find-secrets.ps1
# This script is non-destructive and only searches files for known patterns.

$patterns = @(
    'REDACTED_STRIPE_PUBLIC_KEY',
    'REDACTED_PAYPAL_CLIENT_ID',
    'diff rwiv ectx jzvw',
    'EMAIL_APP_PASSWORD',
    'SMTP_PASS',
    'VITE_PAYPAL_CLIENT_ID',
    'VITE_STRIPE_PUBLIC_KEY',
    'VITE_GOOGLE_CLIENT_ID'
)

Write-Host "Searching repository for known patterns...`n"

foreach ($p in $patterns) {
    Write-Host "Pattern: $p" -ForegroundColor Cyan
    $foundMatches = Get-ChildItem -Recurse -File -Force | Where-Object { $_.FullName -notmatch '\.git\\' -and $_.FullName -notmatch 'node_modules' } | Select-String -Pattern $p -SimpleMatch -List
    if ($foundMatches) {
        foreach ($m in $foundMatches) {
            Write-Host "  Found in: $($m.Path):$($m.LineNumber)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  No matches" -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "Done. If you see findings, follow SECURITY_SCRUB_INSTRUCTIONS.md to scrub history or rotate keys." -ForegroundColor Magenta
