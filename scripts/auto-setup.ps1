<#
Automated local setup helper
- Creates .env.local using environment variables when available or prompts interactively
- Ensures .env.local is ignored by git
- Verifies .env.local does not contain REDACTED and is untracked
- Optionally runs the smoke-test script

Usage: run from repository root
  .\scripts\auto-setup.ps1
#>

function MaskValue($s) {
  if (-not $s) { return '<not set>' }
  if ($s.Length -le 10) { return ('*' * ($s.Length -4)) + $s.Substring($s.Length-4) }
  return ($s.Substring(0,6) + '...' + $s.Substring($s.Length-4))
}

Write-Host "Automated local env setup starting..." -ForegroundColor Cyan

$envFile = Join-Path (Get-Location) '.env.local'

# Gather candidates (prefer environment variables)
$keys = @('VITE_GOOGLE_CLIENT_ID','GOOGLE_CLIENT_ID','VITE_STRIPE_PUBLIC_KEY','VITE_PAYPAL_CLIENT_ID')
$values = @{}

function Get-EnvValue([string]$name) {
  # Prefer the $env: provider when possible
  if ($env:$name) { return $env:$name }
  # Fallback to .NET API for dynamic names
  return [Environment]::GetEnvironmentVariable($name, 'Process')
}

foreach ($k in $keys) {
  $values[$k] = Get-EnvValue $k
}

# Prompt for missing values
foreach ($k in $keys) {
  if (-not $values[$k]) {
    $prompt = "Enter value for $k (leave blank to skip):"
    $response = Read-Host $prompt
    if ($response -and $response.Trim().Length -gt 0) {
      $values[$k] = $response.Trim()
    }
  }
}

# Create .env.local
if (Test-Path $envFile) {
  Write-Host ".env.local already exists at $envFile — opening for edit." -ForegroundColor Yellow
  notepad $envFile
} else {
  $lines = @()
  foreach ($k in $keys) {
    if ($values[$k]) { $lines += "$k=$($values[$k])" }
  }
  if ($lines.Count -eq 0) {
    Write-Host "No values provided; .env.local will not be created." -ForegroundColor Yellow
    exit 0
  }
  Set-Content -Path $envFile -Value ($lines -join "`n") -Encoding UTF8
  Write-Host ".env.local created at $envFile" -ForegroundColor Green
}

# Ensure .env.local is in .gitignore
$gitignore = Join-Path (Get-Location) '.gitignore'
if (Test-Path $gitignore) {
  $gi = Get-Content $gitignore -Raw
  if ($gi -notmatch '(?m)^\s*\.env.local\s*$') {
    Add-Content -Path $gitignore -Value "`n# local envs`n.env.local"
    Write-Host "Added .env.local to .gitignore" -ForegroundColor Green
  } else {
    Write-Host ".env.local already ignored by git" -ForegroundColor DarkGreen
  }
} else {
  Write-Host ".gitignore not found — please ensure .env.local is ignored in your workflow." -ForegroundColor Yellow
}

# Quick safety checks
if (Select-String -Path $envFile -Pattern 'REDACTED' -SimpleMatch -Quiet) {
  Write-Host "ERROR: .env.local contains the word REDACTED — replace placeholders with real values and re-run." -ForegroundColor Red
  exit 1
}

Write-Host "Verifying .env.local is untracked by git..." -ForegroundColor Cyan
try {
  # if tracked, this will succeed and return 0; we want it to throw
  git ls-files --error-unmatch .env.local > $null 2>&1
  Write-Host "WARNING: .env.local is tracked by git. Remove it from the repository immediately to avoid committing secrets." -ForegroundColor Red
  Write-Host "To remove it from git history: run \"git rm --cached .env.local\" and then commit with \"git commit -m 'remove .env.local'\"" -ForegroundColor Yellow
  exit 1
} catch {
  Write-Host ".env.local is untracked — good." -ForegroundColor Green
}

Write-Host "Summary (masked values):" -ForegroundColor Cyan
foreach ($k in $keys) {
  $v = $values[$k]
  Write-Host (" - {0}: {1}" -f $k, (MaskValue $v))
}

# Optional smoke test
$runSmoke = Read-Host "Run smoke-test now? (Y/N)"
if ($runSmoke -and $runSmoke.Trim().ToUpper() -eq 'Y') {
  if (Test-Path (Join-Path (Get-Location) 'scripts\smoke-test.js')) {
    Write-Host "Running smoke-test.js..." -ForegroundColor Cyan
    node .\scripts\smoke-test.js
    Write-Host "Smoke test finished." -ForegroundColor Green
  } else {
    Write-Host "No smoke-test.js found, skipping." -ForegroundColor Yellow
  }
}

Write-Host "Automated setup complete. Your secrets remain local and uncommitted." -ForegroundColor Green
