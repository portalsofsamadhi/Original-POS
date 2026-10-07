# PowerShell script to identify and delete unused LFS images
# This script analyzes your codebase and removes images that aren't referenced

param(
    [switch]$DryRun,
    [switch]$Confirm
)

Write-Host "=== LFS Unused Image Cleanup Script ===" -ForegroundColor Green

if (!$DryRun -and !$Confirm) {
    Write-Host "WARNING: This script will delete unused image files!" -ForegroundColor Red
    Write-Host "Use -DryRun to see what would be deleted, or -Confirm to proceed" -ForegroundColor Yellow
    Write-Host "`nUsage examples:" -ForegroundColor Cyan
    Write-Host "  ./cleanup-unused-images.ps1 -DryRun    # Show what would be deleted"
    Write-Host "  ./cleanup-unused-images.ps1 -Confirm   # Actually delete files"
    exit 1
}

# Extract all unique image references from the codebase
Write-Host "Analyzing codebase for image references..." -ForegroundColor Yellow

# Get all image references from grep results (already extracted from your analysis)
$referencedImages = @(
    # Core branding files
    "public/poslogo.png",
    "public/feqad-wolde.jpg", 
    "public/mesqal-kebra.jpg",
    "public/Welcome.png",
    
    # Hero/main images
    "public/images/Site Files/Picsart_22-06-21_21-55-35-921_edited.jpg",
    "public/images/Site Files/IMG-20200611-WA0028_edited.jpg",
    "public/images/Site Files/For Course_edited_edited.png",
    "public/images/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.jpg",
    "public/images/Site Files/13315_1369e9efd35a8daf5c2382e05edaec5f-1_8_2024 1_27_12 PM.jpg",
    
    # Client logos (used in mesqal-services.tsx)
    "public/client-logos/bakaberg-logo.png",
    "public/client-logos/bella-logo.png", 
    "public/client-logos/blm-boston-logo.png",
    "public/client-logos/black-storytelling-week-logo.svg",
    "public/client-logos/rastafari-tv-logo.jpg",
    "public/client-logos/daraja-logo.png",
    "public/client-logos/entrepreneurs-playground-logo.png",
    "public/client-logos/idea-to-pitch-logo.png",
    "public/client-logos/lion-pub-logo.png",
    "public/client-logos/site-media-logo.png",
    "public/client-logos/slfnd-logo.png",
    "public/client-logos/Screenshot 2024-05-26 122411.png",
    
    # Cell phone images (retreat-tours.tsx)
    "public/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-43-32-743.png",
    "public/images/Cell Phone/VID-20250623-WA0000.mp4",
    
    # Certification images (feqad-services.tsx)
    "public/images/certifications/Bodsphere's Certificate of 60-Hrs Yin Yoga Teacher Training Program.png",
    "public/images/certifications/Darrian Williams's NLP Life Coach Certification-1.png", 
    "public/images/certifications/Reiki 1 2 Master Certificate - Darrian Ishmael Williams-3.png",
    "public/images/certifications/image_4b0e6694-6d8d-4a6f-bda8-9c467ffbad7220220415_012955.jpg",
    "public/images/certifications/image_846d5c2b-f503-41c6-b5dd-f9a2395ea1b420220415_012950.jpg",
    
    # Blog images (blogLoader.ts)
    "public/images/ali-abdul-rahman-Xva-TYqwHhA-unsplash.jpg",
    "public/images/artiom-vallat-HWkd3r8uqzY-unsplash.jpg", 
    "public/images/daniel-sinoca-UjXGaJHH2jE-unsplash.jpg",
    "public/images/ashley-byrd-uUOQlm3Idv0-unsplash.jpg",
    "public/images/anirudh-chavali-JpeV5C_3M3Y-unsplash.jpg",
    "public/images/angus-gray-qEaELLSYZW0-unsplash.jpg",
    
    # Course images (courses.tsx)
    "public/images/erastus-mccart-i6UdBLu_wwk-unsplash.jpg",
    "public/images/david-courbit-M8xxVih_V_U-unsplash.jpg",
    "public/images/heather-green-SzDrE3_msOs-unsplash.jpg",
    "public/images/genevieve-dallaire-7zT-vbOFoSM-unsplash.jpg",
    
    # Retreat background images 
    "public/images/alexis-plasencia-tTHLZtGL4Os-unsplash.jpg",
    
    # Video files
    "public/videos/13279103_3840_2160_24fps.mp4",
    
    # Testimonial placeholder images (these might not exist yet)
    "public/images/testimonials/hildegard-avatar.jpg",
    "public/images/testimonials/hugo-avatar.jpg", 
    "public/images/testimonials/carol-avatar.jpg",
    "public/images/testimonials/julia-avatar.jpg"
)

# Get all LFS files
$lfsFiles = git lfs ls-files | ForEach-Object {
    $parts = $_ -split '\* '
    if ($parts.Length -gt 1) {
        $parts[1].Trim()
    }
}

Write-Host "Found $($lfsFiles.Count) total LFS files" -ForegroundColor Cyan
Write-Host "Found $($referencedImages.Count) referenced images in code" -ForegroundColor Cyan

# Identify unused files
$unusedFiles = @()
$usedFiles = @()
$missingFiles = @()

foreach ($lfsFile in $lfsFiles) {
    $isUsed = $false
    
    foreach ($referencedImage in $referencedImages) {
        if ($lfsFile -eq $referencedImage) {
            $isUsed = $true
            $usedFiles += $lfsFile
            break
        }
    }
    
    if (!$isUsed) {
        $unusedFiles += $lfsFile
    }
}

# Check for missing referenced files
foreach ($referencedImage in $referencedImages) {
    if ($referencedImage -notin $lfsFiles -and (Test-Path $referencedImage)) {
        $missingFiles += $referencedImage
    }
}

Write-Host "`n=== Analysis Results ===" -ForegroundColor Green
Write-Host "Used files: $($usedFiles.Count)" -ForegroundColor Green
Write-Host "Unused files: $($unusedFiles.Count)" -ForegroundColor Red
Write-Host "Referenced but not in LFS: $($missingFiles.Count)" -ForegroundColor Yellow

# Major unused directories we can safely delete
$majorUnusedDirectories = @(
    "public/images - Copy",  # This entire directory appears to be duplicates
    "public/Reviews"         # Only 2 screenshot files, not referenced in code
)

# Calculate potential space savings
$totalSize = 0
$unusedSize = 0

foreach ($file in $unusedFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $unusedSize += $size
    }
}

foreach ($file in $lfsFiles) {
    if (Test-Path $file) {
        $totalSize += (Get-Item $file).Length
    }
}

if ($DryRun) {
    Write-Host "`n=== DRY RUN - Files that would be deleted ===" -ForegroundColor Cyan
    
    Write-Host "`nMajor unused directories:" -ForegroundColor Yellow
    foreach ($dir in $majorUnusedDirectories) {
        if (Test-Path $dir) {
            $dirSize = (Get-ChildItem $dir -Recurse -File | Measure-Object -Property Length -Sum).Sum
            Write-Host "  $dir ($([math]::Round($dirSize/1MB, 2)) MB)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nIndividual unused files:" -ForegroundColor Yellow
    foreach ($file in $unusedFiles) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            $sizeMB = [math]::Round($size/1MB, 2)
            if ($sizeMB -gt 0.1) { # Only show files > 0.1MB
                Write-Host "  $file ($sizeMB MB)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "`n=== Space Savings Summary ===" -ForegroundColor Green
    Write-Host "Total LFS size: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor Cyan
    Write-Host "Unused file size: $([math]::Round($unusedSize/1MB, 2)) MB" -ForegroundColor Red
    Write-Host "Potential savings: $([math]::Round(($unusedSize/$totalSize)*100, 1))%" -ForegroundColor Green
    
    Write-Host "`nTo actually delete these files, run with -Confirm" -ForegroundColor Green
    exit 0
}

if ($Confirm) {
    Write-Host "`n=== Deleting unused LFS files ===" -ForegroundColor Red
    $deletedCount = 0
    $deletedSize = 0
    
    # Delete major unused directories first
    foreach ($dir in $majorUnusedDirectories) {
        if (Test-Path $dir) {
            $dirSize = (Get-ChildItem $dir -Recurse -File | Measure-Object -Property Length -Sum).Sum
            Remove-Item $dir -Recurse -Force
            Write-Host "  Deleted directory: $dir ($([math]::Round($dirSize/1MB, 2)) MB)" -ForegroundColor Green
            $deletedSize += $dirSize
        }
    }
    
    # Delete individual unused files
    foreach ($file in $unusedFiles) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            Remove-Item $file -Force
            Write-Host "  Deleted: $file ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
            $deletedCount++
            $deletedSize += $size
        }
    }
    
    Write-Host "`n=== Summary ===" -ForegroundColor Green
    Write-Host "Files deleted: $deletedCount" -ForegroundColor Cyan
    Write-Host "Space freed: $([math]::Round($deletedSize/1MB, 2)) MB" -ForegroundColor Cyan
    
    Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
    Write-Host "1. Update Git LFS tracking:"
    Write-Host "   git add -A"
    Write-Host "   git commit -m 'Remove unused LFS images to reduce quota usage'"
    Write-Host "2. Push changes:"
    Write-Host "   git push"
    Write-Host "3. The remaining $($usedFiles.Count) files are actively used by your application"
}
