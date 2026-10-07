# Convert main website images to WebP format and update references
# This script requires ImageMagick to be installed

Write-Host "🖼️  Converting main website images to WebP format..." -ForegroundColor Green

# Check if ImageMagick is installed
try {
    magick --version | Out-Null
    Write-Host "✅ ImageMagick detected" -ForegroundColor Green
} catch {
    Write-Host "❌ ImageMagick not found. Please install ImageMagick first:" -ForegroundColor Red
    Write-Host "   Download from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

# Define main images to convert (based on code analysis)
$imagesToConvert = @(
    "public/feqad-wolde.jpg",
    "public/mesqal-kebra.jpg", 
    "public/Welcome.png",
    "public/poslogo.png",
    "public/images - Copy/Site Files/Picsart_22-06-21_21-55-35-921_edited.jpg",
    "public/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.jpg",
    "public/images - Copy/Phone/IMG_20250619_144257012_HDR.jpg",
    "public/images - Copy/Phone/Picsart_25-07-16_20-20-28-046.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png",
    "public/images/Cell Phone/Picsart_25-06-23_02-43-32-743.png",
    "public/images/genevieve-dallaire-7zT-vbOFoSM-unsplash.jpg",
    "public/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.jpg",
    "public/images/testimonials/hildegard-avatar.jpg",
    "public/images/testimonials/hugo-avatar.jpg", 
    "public/images/testimonials/carol-avatar.jpg",
    "public/images/testimonials/julia-avatar.jpg"
)

# Convert images to WebP
$convertedImages = @()
foreach ($imagePath in $imagesToConvert) {
    if (Test-Path $imagePath) {
        $webpPath = $imagePath -replace '\.(jpg|jpeg|png)$', '.webp'
        Write-Host "Converting: $imagePath -> $webpPath" -ForegroundColor Cyan
        
        try {
            magick "$imagePath" -quality 85 "$webpPath"
            if (Test-Path $webpPath) {
                $convertedImages += @{
                    original = $imagePath
                    webp = $webpPath
                    oldRef = ($imagePath -replace '^public/', '/')
                    newRef = ($webpPath -replace '^public/', '/')
                }
                Write-Host "✅ Converted successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ Conversion failed" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Error converting $imagePath : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  File not found: $imagePath" -ForegroundColor Yellow
    }
}

Write-Host "`n📝 Updating code references..." -ForegroundColor Green

# Define files to update with their old->new reference mappings
$filesToUpdate = @(
    "src/components/home.tsx",
    "src/components/home/Hero.tsx", 
    "src/components/home/about/WhoWeAreSection.tsx",
    "src/pages/retreat-tours-workshops.tsx"
)

# Update file references
foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $updated = $false
        
        foreach ($img in $convertedImages) {
            $oldRef = $img.oldRef
            $newRef = $img.newRef
            
            if ($content -match [regex]::Escape($oldRef)) {
                $content = $content -replace [regex]::Escape($oldRef), $newRef
                $updated = $true
                Write-Host "  Updated reference in $file : $oldRef -> $newRef" -ForegroundColor Cyan
            }
        }
        
        if ($updated) {
            Set-Content $file -Value $content -NoNewline
            Write-Host "✅ Updated $file" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Yellow
    }
}

# Update image preloader
$preloaderFile = "src/utils/imagePreloader.ts"
if (Test-Path $preloaderFile) {
    $content = Get-Content $preloaderFile -Raw
    $updated = $false
    
    foreach ($img in $convertedImages) {
        $oldRef = $img.oldRef
        $newRef = $img.newRef
        
        if ($content -match [regex]::Escape($oldRef)) {
            $content = $content -replace [regex]::Escape($oldRef), $newRef
            $updated = $true
            Write-Host "  Updated preloader reference: $oldRef -> $newRef" -ForegroundColor Cyan
        }
    }
    
    if ($updated) {
        Set-Content $preloaderFile -Value $content -NoNewline
        Write-Host "✅ Updated image preloader" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Conversion complete!" -ForegroundColor Green
Write-Host "📊 Converted $($convertedImages.Count) images to WebP format" -ForegroundColor Green
Write-Host "🔧 Updated code references in $($filesToUpdate.Count) files" -ForegroundColor Green
Write-Host "`n💡 Note: Original images are preserved. You can delete them manually if desired." -ForegroundColor Yellow
