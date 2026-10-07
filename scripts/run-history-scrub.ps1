<#
usage:
  # Dry-run (default): prepares backup mirror and shows the exact git-filter-repo command to run
  .\scripts\run-history-scrub.ps1

  # To actually run (destructive) pass -ConfirmRun
  .\scripts\run-history-scrub.ps1 -ConfirmRun

Notes:
- This script will NOT run any destructive rewrite unless explicitly passed -ConfirmRun.
- It requires git-filter-repo to be installed and on PATH when running the destructive step.
#>

param(
    [switch]$ConfirmRun
)

Write-Host 'Preparing git history scrub (dry-run mode).' -ForegroundColor Yellow

$repoPath = (Get-Location).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $repoPath "backup-history-$timestamp"

Write-Host ('1) Creating a mirror backup in: {0}' -f $backupDir)
git clone --no-local --mirror $repoPath $backupDir

if ($LASTEXITCODE -ne 0) {
    Write-Host 'Failed to create mirror backup. Aborting.' -ForegroundColor Red
    exit 1
}

Write-Host 'Mirror backup created. Next: verify your "replacements.txt" file contains the mappings you want to replace.' -ForegroundColor Green

$replacements = Join-Path $repoPath "replacements.txt"
if (-Not (Test-Path $replacements)) {
    Write-Host ('WARNING: replacements.txt not found at {0}' -f $replacements) -ForegroundColor Yellow
} else {
    Write-Host ('Found replacements file at: {0}' -f $replacements) -ForegroundColor Green
}

Write-Host ''
Write-Host 'Dry-run complete. No destructive steps have been executed.' -ForegroundColor Cyan

if (-Not $ConfirmRun) {
    Write-Host 'To run the history rewrite, run this script again with the -ConfirmRun flag.' -ForegroundColor Yellow
    Write-Host 'Example: .\scripts\run-history-scrub.ps1 -ConfirmRun' -ForegroundColor Yellow
    exit 0
}

Write-Host 'ConfirmRun provided — performing destructive history rewrite now.' -ForegroundColor Red

if (-Not (Get-Command git-filter-repo -ErrorAction SilentlyContinue)) {
    Write-Host 'git-filter-repo not found on PATH. Please install it first: https://github.com/newren/git-filter-repo' -ForegroundColor Red
    exit 2
}

if (-Not (Test-Path $replacements)) {
    Write-Host "replacements.txt missing. Aborting." -ForegroundColor Red
    exit 3
}

Push-Location $backupDir
try {
    Write-Host ('Running: git-filter-repo --replace-text {0}' -f $replacements) -ForegroundColor Yellow
    git-filter-repo --replace-text $replacements
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'git-filter-repo failed. Check output above.' -ForegroundColor Red
        exit 4
    }

    Write-Host "Rewrite complete on backup mirror. Inspect the backup at: $backupDir" -ForegroundColor Green
    Write-Host "If satisfied, you can force-push the cleaned refs to origin from this mirror:" -ForegroundColor Cyan
    Write-Host ('  cd {0}; git remote add origin <remote-url>  # if missing' -f $backupDir) -ForegroundColor Cyan
    Write-Host '  git push --force --all origin' -ForegroundColor Cyan
    Write-Host '  git push --force --tags origin' -ForegroundColor Cyan
} finally {
    Pop-Location
}

    Write-Host 'Done. Remember to notify collaborators and provide re-clone instructions.' -ForegroundColor Green
