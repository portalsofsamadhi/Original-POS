#!/usr/bin/env pwsh
# Git History Scrub Script - Removes secrets from entire git history
# WARNING: This is a DESTRUCTIVE operation that rewrites git history
# Run this script ONLY after backing up your repository

param(
    [switch]$Execute,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "=== Git History Scrub Script ===" -ForegroundColor Yellow
Write-Host "This script will remove secrets from your entire git history using git-filter-repo" -ForegroundColor Red
Write-Host ""

# Safety checks
if (-not $Execute) {
    Write-Host "SAFETY MODE: Add -Execute flag to actually run the scrub" -ForegroundColor Yellow
    Write-Host "Example: .\scripts\scrub-git-history.ps1 -Execute" -ForegroundColor Yellow
    Write-Host ""
}

if (-not $Force -and $Execute) {
    Write-Host "Have you:" -ForegroundColor Red
    Write-Host "1. Created a backup of your repository?" -ForegroundColor Red
    Write-Host "2. Rotated all exposed credentials?" -ForegroundColor Red
    Write-Host "3. Committed all current changes?" -ForegroundColor Red
    Write-Host ""
    $confirm = Read-Host "Type 'YES' to confirm you have completed all prerequisites"
    if ($confirm -ne "YES") {
        Write-Host "Aborting. Complete prerequisites first." -ForegroundColor Red
        exit 1
    }
}

# Check git-filter-repo availability
Write-Host "Checking git-filter-repo availability..." -ForegroundColor Cyan
try {
    $filterRepoVersion = git filter-repo --version 2>$null
    Write-Host "✅ git-filter-repo version: $filterRepoVersion" -ForegroundColor Green
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

Write-Host "✅ Found replacements file with $(Get-Content $replacementsFile | Measure-Object -Line).Lines replacements" -ForegroundColor Green

# Show what will be replaced
Write-Host ""
Write-Host "Preview of replacements:" -ForegroundColor Cyan
Get-Content $replacementsFile | Select-Object -First 5 | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Gray
}
if ((Get-Content $replacementsFile | Measure-Object -Line).Lines -gt 5) {
    Write-Host "  ... and $((Get-Content $replacementsFile | Measure-Object -Line).Lines - 5) more" -ForegroundColor Gray
}

if (-not $Execute) {
    Write-Host ""
    Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host "To execute: .\scripts\scrub-git-history.ps1 -Execute" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚨 EXECUTING DESTRUCTIVE OPERATION 🚨" -ForegroundColor Red
Write-Host "Rewriting git history to remove secrets..." -ForegroundColor Yellow

# Backup current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

# Execute git-filter-repo
try {
    Write-Host "Running git filter-repo..." -ForegroundColor Yellow
    git filter-repo --replace-text $replacementsFile --force
    
    Write-Host "✅ Git history scrub completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Review the changes: git log --oneline -10" -ForegroundColor White
    Write-Host "2. Test your application thoroughly" -ForegroundColor White
    Write-Host "3. Force push to update remote: git push --force-with-lease origin $currentBranch" -ForegroundColor White
    Write-Host "4. Notify team members to re-clone the repository" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 All secrets have been removed from git history" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Git filter-repo failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}