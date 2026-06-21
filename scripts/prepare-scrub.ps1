<#
prepare-scrub.ps1

This script prepares a safe, local mirror clone and writes the commands needed to run
`git-filter-repo` using the `replacements.txt` file at the repository root.

It DOES NOT run any destructive commands by default. It will:
  - create a bundle backup of the current repo
  - create a mirror clone (pos-website-mirror.git) next to this repo
  - copy `replacements.txt` into the mirror clone
  - write `scripts/run-git-filter-repo.ps1` that contains the exact commands to run

Read the generated `scripts/run-git-filter-repo.ps1` and run it manually when ready.
#>

# Abort on error
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$backupBundle = Join-Path $repoRoot '..\pos-website-backup.bundle'
$mirrorPath = Join-Path $repoRoot '..\pos-website-mirror.git'
$replacements = Join-Path $repoRoot 'replacements.txt'
$runScript = Join-Path $repoRoot 'scripts\run-git-filter-repo.ps1'

Write-Host "Preparing scrub environment..." -ForegroundColor Cyan

# 1) Create bundle backup
if (Test-Path $backupBundle) {
    Write-Host "Backup bundle already exists at $backupBundle" -ForegroundColor Yellow
} else {
    Write-Host "Creating git bundle backup at $backupBundle" -ForegroundColor Green
    git bundle create $backupBundle --all
    Write-Host "Backup created." -ForegroundColor Green
}

# 2) Create mirror clone (do not modify original repo)
if (Test-Path $mirrorPath) {
    Write-Host "Mirror clone already exists at $mirrorPath" -ForegroundColor Yellow
    Write-Host "If you want a fresh mirror, remove that directory and re-run this script." -ForegroundColor Yellow
} else {
    Write-Host "Creating mirror clone at $mirrorPath" -ForegroundColor Green
    # Use origin URL from the current repo if present, otherwise clone local
    $originUrl = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0 -and $originUrl) {
        Write-Host "Cloning mirror from origin: $originUrl" -ForegroundColor Green
        git clone --mirror $originUrl $mirrorPath
    } else {
        Write-Host "No origin remote found; mirroring local repo instead." -ForegroundColor Yellow
        git clone --mirror $repoRoot $mirrorPath
    }
    Write-Host "Mirror created." -ForegroundColor Green
}

# 3) Ensure replacements.txt exists
if (-not (Test-Path $replacements)) {
    Write-Host "ERROR: replacements.txt not found at $replacements" -ForegroundColor Red
    Write-Host "Open the repository root and add the exact strings you want to replace into replacements.txt" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Found replacements.txt. Copying into mirror clone..." -ForegroundColor Green
    Copy-Item -Path $replacements -Destination $mirrorPath -Force
}

# 4) Write the run script that will actually run git-filter-repo inside the mirror clone
$runScriptContent = @"
# run-git-filter-repo.ps1
# WARNING: This script will run destructive git history rewrite commands.
# It is intentionally NOT executed by prepare-scrub.ps1. Review it carefully before running.

# Edit the $REMOTE_URL variable below to your remote repository URL (HTTPS or git@)
# Example: https://github.com/your-org/pos-website.git

`$REMOTE_URL = 'https://github.com/your-org/pos-website.git'  # <<< EDIT ME BEFORE RUNNING

# Confirm you want to proceed (uncomment the two lines below after editing the remote)
# Write-Host "About to run git-filter-repo on the mirror clone. This will rewrite history and require a force-push." -ForegroundColor Red
# Read-Host -Prompt "Type YES to proceed" | ForEach-Object { if (`$_ -ne 'YES') { Write-Host 'Aborting.'; exit 1 } }

# Run the filter in the mirror clone
Set-Location -Path '..\\pos-website-mirror.git'

# Replace text using replacements.txt
# Ensure git-filter-repo is installed (pip install git-filter-repo)
# git-filter-repo will read replacements.txt in the current directory

# Uncomment to run (after you've edited `$REMOTE_URL` and confirmed)
# git filter-repo --replace-text replacements.txt

# Optionally remove files completely (e.g., .env)
# Uncomment to delete specific paths from history:
# git filter-repo --invert-paths --paths .env --paths php-backend/.env

# After successful rewrite, push back to remote (force)
# git remote set-url origin `$REMOTE_URL
# git push --force --all
# git push --force --tags

Write-Host "Run script written. Edit and run it manually when ready." -ForegroundColor Green
"@

Set-Content -Path $runScript -Value $runScriptContent -Force -Encoding UTF8
Write-Host "Wrote run script to: $runScript" -ForegroundColor Green

Write-Host "Preparation complete. Read scripts/run-git-filter-repo.ps1, edit the REMOTE_URL, and run it only after you have rotated credentials and are ready to force-push." -ForegroundColor Magenta
