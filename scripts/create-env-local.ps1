param()

Write-Host "This helper will create an untracked .env.local with your secrets." -ForegroundColor Cyan
Write-Host "It will NOT commit or print your secrets. Press Ctrl+C to cancel." -ForegroundColor Yellow

$path = Join-Path -Path (Get-Location) -ChildPath ".env.local"
if (Test-Path $path) {
  Write-Host ".env.local already exists. I'll open it for editing instead." -ForegroundColor Yellow
  notepad $path
  exit 0
}

$google = Read-Host "Enter VITE_GOOGLE_CLIENT_ID (frontend client id)"
$serverGoogle = Read-Host "Enter GOOGLE_CLIENT_ID (server-side client id) [press Enter to use same as frontend]"
if ([string]::IsNullOrWhiteSpace($serverGoogle)) { $serverGoogle = $google }

$content = @()
$content += "VITE_GOOGLE_CLIENT_ID=$google"
$content += "GOOGLE_CLIENT_ID=$serverGoogle"
$content += "# Add other local-only secrets below"

Set-Content -Path $path -Value ($content -join "`n") -Encoding UTF8

Write-Host ".env.local created at $path and is ignored by git (if .gitignore contains .env.local)." -ForegroundColor Green
Write-Host "Remember: do not commit this file. Use your host platform's environment settings for production." -ForegroundColor Yellow
