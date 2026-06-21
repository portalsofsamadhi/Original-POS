#!/usr/bin/env pwsh
# DreamHost Deployment Preparation Script

Write-Host "🌐 Preparing POS Website for DreamHost Deployment..." -ForegroundColor Green

# Create deployment directory
$deployDir = "dreamhost-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "📁 Created deployment directory: $deployDir" -ForegroundColor Blue

# Build the React app
Write-Host "🏗️ Building React application..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Cannot proceed with deployment." -ForegroundColor Red
    exit 1
}

# Copy frontend files
Write-Host "📂 Copying frontend files..." -ForegroundColor Blue
Copy-Item "dist\*" -Destination $deployDir -Recurse

# Create API directory structure
$apiDir = "$deployDir\api\newsletter"
New-Item -ItemType Directory -Path $apiDir -Force | Out-Null

# Copy PHP backend files
Write-Host "🐘 Copying PHP backend files..." -ForegroundColor Blue
Copy-Item "php-backend\newsletter-service.php" -Destination $apiDir
Copy-Item "php-backend\subscribe.php" -Destination "$apiDir\subscribe.php"
Copy-Item "php-backend\update-profile.php" -Destination "$apiDir\update-profile.php"
Copy-Item "php-backend\subscribers.php" -Destination "$apiDir\subscribers.php"
Copy-Item "php-backend\health.php" -Destination "$apiDir\health.php"

# Create .htaccess file
Write-Host "⚙️ Creating .htaccess file..." -ForegroundColor Blue
$htaccessContent = @"
# React Router support
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api/). /index.html [L]

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
"@

Set-Content -Path "$deployDir\.htaccess" -Value $htaccessContent

# Create deployment README
Write-Host "📋 Creating deployment instructions..." -ForegroundColor Blue
$deployReadme = @"
# DreamHost Deployment Package

## Upload Instructions

1. **Upload all files** in this folder to your DreamHost domain root
2. **Maintain the folder structure** exactly as shown
3. **Configure database** in api/newsletter/newsletter-service.php
4. **Update admin key** in api/newsletter/subscribers.php

## File Structure
```
yourdomain.com/
├── index.html
├── assets/
├── images/
├── api/
│   └── newsletter/
│       ├── newsletter-service.php
│       ├── subscribe.php
│       ├── update-profile.php
│       ├── subscribers.php
│       └── health.php
└── .htaccess
```

## Database Setup
1. Create MySQL database in DreamHost panel
2. Edit api/newsletter/newsletter-service.php
3. Update database credentials

## Testing
Visit: https://yourdomain.com/api/newsletter/health.php

## Support
See DREAMHOST_DEPLOYMENT.md for detailed instructions
"@

Set-Content -Path "$deployDir\README.txt" -Value $deployReadme

# Create configuration template
Write-Host "⚙️ Creating configuration template..." -ForegroundColor Blue
$configTemplate = @"
<?php
// CONFIGURATION REQUIRED
// Edit these values with your DreamHost database credentials

private `$host = 'mysql.yourdomain.com';        // Your MySQL hostname
private `$dbname = 'your_database_name';        // Your database name  
private `$username = 'your_database_user';      // Your database username
private `$password = 'your_database_password';  // Your database password

// Also update in subscribers.php:
`$adminKey = 'your_unique_admin_key_here';      // Change this admin key
?>
"@

Set-Content -Path "$deployDir\api\newsletter\CONFIG_TEMPLATE.php" -Value $configTemplate

# Show deployment summary
Write-Host "`n🎉 DreamHost deployment package ready!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Yellow

Write-Host "📁 Deployment folder: $deployDir" -ForegroundColor White
Write-Host "📊 Frontend files: " -NoNewline -ForegroundColor White
$frontendFiles = (Get-ChildItem $deployDir -Exclude "api" | Measure-Object).Count
Write-Host "$frontendFiles items" -ForegroundColor Green

Write-Host "🐘 PHP backend files: " -NoNewline -ForegroundColor White  
$phpFiles = (Get-ChildItem "$deployDir\api\newsletter" | Measure-Object).Count
Write-Host "$phpFiles files" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure database credentials in $deployDir\api\newsletter\newsletter-service.php" -ForegroundColor White
Write-Host "2. Update admin key in $deployDir\api\newsletter\subscribers.php" -ForegroundColor White
Write-Host "3. Upload all files to your DreamHost domain root" -ForegroundColor White
Write-Host "4. Test at https://yourdomain.com/api/newsletter/health.php" -ForegroundColor White

Write-Host "`n🚀 Ready for DreamHost upload!" -ForegroundColor Green
