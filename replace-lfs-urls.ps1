# PowerShell script to replace LFS file references with Google Drive URLs
# Usage: ./replace-lfs-urls.ps1

param(
    [string]$MappingFile = "lfs-to-drive-mapping.txt"
)

Write-Host "=== LFS URL Replacement Script ===" -ForegroundColor Green

if (!(Test-Path $MappingFile)) {
    Write-Host "Error: Mapping file '$MappingFile' not found!" -ForegroundColor Red
    Write-Host "Please create the mapping file first using migrate-to-drive.ps1" -ForegroundColor Yellow
    exit 1
}

# Read the mapping file
$mappings = @{}
Get-Content $MappingFile | ForEach-Object {
    if ($_ -match "^([^=#]+)=(.+)$" -and !$_.StartsWith("#")) {
        $localPath = $matches[1].Trim()
        $driveUrl = $matches[2].Trim()
        if ($driveUrl -ne "YOUR_FILE_ID_HERE" -and $driveUrl -ne "https://drive.google.com/uc?id=YOUR_FILE_ID_HERE") {
            $mappings[$localPath] = $driveUrl
        }
    }
}

if ($mappings.Count -eq 0) {
    Write-Host "No valid mappings found in $MappingFile" -ForegroundColor Red
    Write-Host "Please update the mapping file with actual Google Drive URLs" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found $($mappings.Count) file mappings" -ForegroundColor Cyan

# Files that need to be updated based on our analysis
$filesToUpdate = @(
    "src/components/layout/Navbar.tsx",
    "src/components/home.tsx", 
    "src/components/home/BiographyDialog.tsx",
    "src/components/home/about/WhoWeAreSection.tsx",
    "src/components/SplashScreen.tsx",
    "src/components/ImageDemo.tsx",
    "src/pages/feqad-services.tsx",
    "src/pages/mesqal-services.tsx", 
    "src/pages/retreat-tours.tsx",
    "src/pages/community-workshops.tsx",
    "src/pages/blog.tsx",
    "src/pages/booking-success.tsx",
    "src/pages/booking-services.tsx", 
    "src/pages/booking-cancel.tsx",
    "src/pages/BlogPost.tsx",
    "src/pages/profile.tsx",
    "src/App.tsx",
    "src/utils/imagePreloader.ts",
    "src/utils/blogLoader.ts"
)

$totalReplacements = 0

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw
        $originalContent = $content
        $fileReplacements = 0
        
        foreach ($localPath in $mappings.Keys) {
            $driveUrl = $mappings[$localPath]
            
            # Handle different path formats
            $patterns = @(
                "/$localPath",           # /public/image.jpg
                "^public/(.+)$"         # public/image.jpg -> /public/image.jpg
            )
            
            foreach ($pattern in $patterns) {
                if ($localPath -match $pattern) {
                    $searchPath = if ($matches[1]) { "/$($matches[1])" } else { "/$localPath" }
                    
                    # Remove /public/ prefix for the search since files use it both ways
                    $searchPathAlt = $searchPath -replace "^/public/", "/"
                    
                    # Replace both formats
                    $beforeCount = ($content | Select-String $searchPath -AllMatches).Matches.Count
                    $content = $content -replace [regex]::Escape($searchPath), $driveUrl
                    
                    $beforeCountAlt = ($content | Select-String $searchPathAlt -AllMatches).Matches.Count
                    $content = $content -replace [regex]::Escape($searchPathAlt), $driveUrl
                    
                    $afterCount = ($content | Select-String $searchPath -AllMatches).Matches.Count + ($content | Select-String $searchPathAlt -AllMatches).Matches.Count
                    $replacements = $beforeCount + $beforeCountAlt - $afterCount
                    
                    if ($replacements -gt 0) {
                        Write-Host "  Replaced $replacements instances of '$searchPath'" -ForegroundColor Green
                        $fileReplacements += $replacements
                    }
                }
            }
        }
        
        if ($content -ne $originalContent) {
            $content | Set-Content $file -NoNewline
            Write-Host "  Updated $file with $fileReplacements replacements" -ForegroundColor Green
            $totalReplacements += $fileReplacements
        } else {
            Write-Host "  No changes needed in $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "Total replacements made: $totalReplacements" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test your application to ensure all images load correctly"
Write-Host "2. Run remove-lfs-files.ps1 to clean up LFS files"
Write-Host "3. Commit and push changes"
