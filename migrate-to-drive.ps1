# PowerShell script to help migrate LFS files to Google Drive
# This script will:
# 1. List all LFS files with their full paths
# 2. Create a mapping file for URL replacements
# 3. Generate commands to remove LFS files after migration

Write-Host "=== LFS File Migration Helper ===" -ForegroundColor Green

# Get all LFS files
$lfsFiles = git lfs ls-files | ForEach-Object {
    $parts = $_ -split '\* '
    if ($parts.Length -gt 1) {
        $parts[1].Trim()
    }
}

Write-Host "`nFound $($lfsFiles.Count) LFS files:" -ForegroundColor Yellow

# Create organized list by category
$imageFiles = @()
$videoFiles = @()
$logoFiles = @()
$reviewFiles = @()
$profileFiles = @()
$otherFiles = @()

foreach ($file in $lfsFiles) {
    if ($file -match "client-logos") {
        $logoFiles += $file
    }
    elseif ($file -match "Reviews") {
        $reviewFiles += $file
    }
    elseif ($file -match "(feqad-wolde|mesqal-kebra|poslogo)") {
        $profileFiles += $file
    }
    elseif ($file -match "\.mp4$") {
        $videoFiles += $file
    }
    elseif ($file -match "\.(png|jpg)$") {
        $imageFiles += $file
    }
    else {
        $otherFiles += $file
    }
}

# Create directory structure info for Google Drive
Write-Host "`n=== Recommended Google Drive Folder Structure ===" -ForegroundColor Cyan
Write-Host "POS-Website-Assets/"
Write-Host "├── images/"
Write-Host "├── client-logos/"
Write-Host "├── videos/"
Write-Host "├── reviews/"
Write-Host "└── profiles/"

# Output categorized files
Write-Host "`n=== Files by Category ===" -ForegroundColor Cyan

Write-Host "`nProfile Images ($($profileFiles.Count)):" -ForegroundColor Yellow
$profileFiles | ForEach-Object { Write-Host "  $_" }

Write-Host "`nClient Logos ($($logoFiles.Count)):" -ForegroundColor Yellow
$logoFiles | ForEach-Object { Write-Host "  $_" }

Write-Host "`nReview Screenshots ($($reviewFiles.Count)):" -ForegroundColor Yellow
$reviewFiles | ForEach-Object { Write-Host "  $_" }

Write-Host "`nVideo Files ($($videoFiles.Count)):" -ForegroundColor Yellow
$videoFiles | ForEach-Object { Write-Host "  $_" }

Write-Host "`nOther Image Files ($($imageFiles.Count)):" -ForegroundColor Yellow
$imageFiles | ForEach-Object { Write-Host "  $_" }

if ($otherFiles.Count -gt 0) {
    Write-Host "`nOther Files ($($otherFiles.Count)):" -ForegroundColor Yellow
    $otherFiles | ForEach-Object { Write-Host "  $_" }
}

# Create a mapping template for Google Drive URLs
$mappingContent = @"
# LFS to Google Drive URL Mapping
# Format: local_path=google_drive_url
# Replace with actual Google Drive direct download links

# Profile Images
public/feqad-wolde.jpg=https://drive.google.com/uc?id=YOUR_FILE_ID_HERE
public/mesqal-kebra.jpg=https://drive.google.com/uc?id=YOUR_FILE_ID_HERE
public/poslogo.png=https://drive.google.com/uc?id=YOUR_FILE_ID_HERE
public/Welcome.png=https://drive.google.com/uc?id=YOUR_FILE_ID_HERE

"@

foreach ($file in $lfsFiles) {
    if ($file -notmatch "(feqad-wolde|mesqal-kebra|poslogo|Welcome)") {
        $mappingContent += "$file=https://drive.google.com/uc?id=YOUR_FILE_ID_HERE`n"
    }
}

$mappingContent | Out-File -FilePath "lfs-to-drive-mapping.txt" -Encoding UTF8

Write-Host "`n=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Upload files to Google Drive in organized folders"
Write-Host "2. Get shareable links for each file (make sure they're public)"
Write-Host "3. Update lfs-to-drive-mapping.txt with actual Google Drive URLs"
Write-Host "4. Run the code replacement script"
Write-Host "5. Remove LFS files and update .gitattributes"

Write-Host "`nMapping template created: lfs-to-drive-mapping.txt" -ForegroundColor Cyan
Write-Host "File list saved for reference." -ForegroundColor Cyan
