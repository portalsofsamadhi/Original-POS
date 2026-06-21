#!/usr/bin/env pwsh
# Git History Scrub Script - Clean Version
# WARNING: This is a DESTRUCTIVE operation that rewrites git history

param(
    [switch]$Execute,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "=== Git History Scrub Script ===" -ForegroundColor Yellow
Write-Host "This script will remove secrets from your entire git history" -ForegroundColor Red
Write-Host ""

# Safety checks
if (-not $Execute) {
    Write-Host "SAFETY MODE: Add -Execute flag to actually run the scrub" -ForegroundColor Yellow
    Write-Host "Example: .\scripts\scrub-git-history-clean.ps1 -Execute" -ForegroundColor Yellow
    Write-Host ""
}

# Check git-filter-repo availability
Write-Host "Checking git-filter-repo availability..." -ForegroundColor Cyan
try {
    $filterRepoVersion = git filter-repo --version 2>$null
    if ($filterRepoVersion) {
        Write-Host "✅ git-filter-repo found: $filterRepoVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ git-filter-repo not found" -ForegroundColor Red
        Write-Host "Install with: pip install git-filter-repo" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ git-filter-repo not found. Install with: pip install git-filter-repo" -ForegroundColor Red
    exit 1
}

# Check replacements file
$replacementsFile = "replacements.txt"
if (-not (Test-Path $replacementsFile)) {
    Write-Host "❌ replacements.txt not found in current directory" -ForegroundColor Red
    exit 1
}

$replacementCount = (Get-Content $replacementsFile | Measure-Object -Line).Lines
Write-Host "✅ Found replacements file with $replacementCount replacements" -ForegroundColor Green

# Show what will be replaced
Write-Host ""
Write-Host "Preview of replacements:" -ForegroundColor Cyan
Get-Content $replacementsFile | Select-Object -First 3 | ForEach-Object {
    $parts = $_ -split ' ==> '
    if ($parts.Length -eq 2) {
        Write-Host "  '$($parts[0])' -> '$($parts[1])'" -ForegroundColor Gray
    }
}
Write-Host "  ... and $(($replacementCount - 3)) more replacements" -ForegroundColor Gray

if (-not $Execute) {
    Write-Host ""
    Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host "To execute: .\scripts\scrub-git-history-clean.ps1 -Execute" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Before executing, ensure you have:" -ForegroundColor Red
    Write-Host "1. Rotated all exposed credentials (Stripe, PayPal, SMTP)" -ForegroundColor White
    Write-Host "2. Updated production environment variables" -ForegroundColor White
    Write-Host "3. Created a backup of your repository" -ForegroundColor White
    Write-Host "4. Committed all current changes" -ForegroundColor White
    exit 0
}

# Final confirmation
if (-not $Force) {
    Write-Host "🚨 FINAL CONFIRMATION 🚨" -ForegroundColor Red
    Write-Host "This will PERMANENTLY rewrite your git history!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Have you completed ALL of the following?" -ForegroundColor Yellow
    Write-Host "✓ Rotated Stripe credentials" -ForegroundColor White
    Write-Host "✓ Rotated PayPal credentials" -ForegroundColor White  
    Write-Host "✓ Rotated SMTP credentials" -ForegroundColor White
    Write-Host "✓ Updated production environment" -ForegroundColor White
    Write-Host "✓ Created repository backup" -ForegroundColor White
    Write-Host ""
    $confirm = Read-Host "Type 'I HAVE COMPLETED ALL STEPS' to proceed"
    if ($confirm -ne "I HAVE COMPLETED ALL STEPS") {
        Write-Host "Aborting. Complete all prerequisites first." -ForegroundColor Red
        exit 1
    }
}

# Execute git-filter-repo
Write-Host ""
Write-Host "🚨 EXECUTING DESTRUCTIVE OPERATION 🚨" -ForegroundColor Red
Write-Host "Rewriting git history to remove secrets..." -ForegroundColor Yellow

$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

try {
    Write-Host "Running git filter-repo..." -ForegroundColor Yellow
    git filter-repo --replace-text $replacementsFile --force
    
    Write-Host ""
    Write-Host "✅ Git history scrub completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Review changes: git log --oneline -10" -ForegroundColor White
    Write-Host "2. Test your application thoroughly" -ForegroundColor White
    Write-Host "3. Force push: git push --force-with-lease origin $currentBranch" -ForegroundColor White
    Write-Host "4. Notify team members to re-clone repository" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 All secrets have been removed from git history!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Git filter-repo failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "- Ensure git-filter-repo is installed: pip install git-filter-repo" -ForegroundColor White
    Write-Host "- Check that you're in a git repository" -ForegroundColor White
    Write-Host "- Verify replacements.txt format is correct" -ForegroundColor White
    exit 1
}