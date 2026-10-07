#!/usr/bin/env pwsh
# Git History Scrub - Simple Working Version

param(
    [switch]$Execute,
    [switch]$Force
)

Write-Host "=== Git History Scrub ===" -ForegroundColor Yellow
Write-Host ""

if (-not $Execute) {
    Write-Host "DRY RUN MODE - Add -Execute to run for real" -ForegroundColor Yellow
    Write-Host "Example: .\scripts\scrub-simple.ps1 -Execute" -ForegroundColor Yellow
    exit 0
}

# Check git-filter-repo
Write-Host "Checking git-filter-repo..." -ForegroundColor Cyan
$version = git filter-repo --version 2>$null
if (-not $version) {
    Write-Host "ERROR: git-filter-repo not found" -ForegroundColor Red
    Write-Host "Install with: pip install git-filter-repo" -ForegroundColor Yellow
    exit 1
}
Write-Host "Found git-filter-repo: $version" -ForegroundColor Green

# Check replacements file
if (-not (Test-Path "replacements.txt")) {
    Write-Host "ERROR: replacements.txt not found" -ForegroundColor Red
    exit 1
}

$count = (Get-Content "replacements.txt" | Where-Object { $_ -notmatch '^#' -and $_ -ne '' }).Count
Write-Host "Found $count replacements to process" -ForegroundColor Green

# Final confirmation
if (-not $Force) {
    Write-Host ""
    Write-Host "WARNING: This will PERMANENTLY rewrite git history!" -ForegroundColor Red
    Write-Host "Have you rotated all credentials? (y/N): " -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "Aborted." -ForegroundColor Yellow
        exit 1
    }
}

# Execute the scrub
Write-Host ""
Write-Host "EXECUTING GIT HISTORY SCRUB..." -ForegroundColor Red
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    git filter-repo --replace-text replacements.txt --force
    Write-Host ""
    Write-Host "SUCCESS: Git history scrubbed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review: git log --oneline -10" -ForegroundColor White
    Write-Host "2. Force push: git push --force-with-lease origin main" -ForegroundColor White
    Write-Host "3. Team members should re-clone the repo" -ForegroundColor White
} 
catch {
    Write-Host "ERROR: Scrub failed - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}