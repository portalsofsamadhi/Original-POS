# PowerShell script to remove LFS files after migration to Google Drive
# WARNING: This will permanently delete the LFS files!
# Make sure you've uploaded them to Google Drive and updated your code first

param(
    [switch]$Confirm,
    [switch]$DryRun
)

Write-Host "=== LFS File Removal Script ===" -ForegroundColor Red

if (!$Confirm -and !$DryRun) {
    Write-Host "WARNING: This script will permanently delete LFS files!" -ForegroundColor Red
    Write-Host "Use -DryRun to see what would be deleted, or -Confirm to proceed" -ForegroundColor Yellow
    Write-Host "`nUsage examples:" -ForegroundColor Cyan
    Write-Host "  ./remove-lfs-files.ps1 -DryRun    # Show what would be deleted"
    Write-Host "  ./remove-lfs-files.ps1 -Confirm   # Actually delete files"
    exit 1
}

# Get all LFS files
$lfsFiles = git lfs ls-files | ForEach-Object {
    $parts = $_ -split '\* '
    if ($parts.Length -gt 1) {
        $parts[1].Trim()
    }
}

Write-Host "Found $($lfsFiles.Count) LFS files" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "`n=== DRY RUN - Files that would be deleted ===" -ForegroundColor Cyan
    foreach ($file in $lfsFiles) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            Write-Host "  Would delete: $file ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Yellow
        } else {
            Write-Host "  Already missing: $file" -ForegroundColor Gray
        }
    }
    
    Write-Host "`nTo actually delete these files, run with -Confirm" -ForegroundColor Green
    exit 0
}

if ($Confirm) {
    Write-Host "`n=== Removing LFS files ===" -ForegroundColor Red
    $deletedCount = 0
    $totalSize = 0
    
    foreach ($file in $lfsFiles) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            $totalSize += $size
            Remove-Item $file -Force
            Write-Host "  Deleted: $file ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
            $deletedCount++
        } else {
            Write-Host "  Already missing: $file" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n=== Updating .gitattributes ===" -ForegroundColor Yellow
    
    # Read current .gitattributes
    $gitattributesPath = ".gitattributes"
    if (Test-Path $gitattributesPath) {
        $content = Get-Content $gitattributesPath
        
        # Remove LFS tracking for common file types
        $newContent = $content | Where-Object {
            $_ -notmatch "^\*\.(mp4|png|jpg|csv) filter=lfs" -and
            $_ -notmatch "filter=lfs diff=lfs merge=lfs"
        }
        
        # Keep only non-LFS entries
        $newContent | Set-Content $gitattributesPath
        Write-Host "  Updated .gitattributes to remove LFS tracking" -ForegroundColor Green
    }
    
    Write-Host "`n=== Summary ===" -ForegroundColor Green
    Write-Host "Files deleted: $deletedCount" -ForegroundColor Cyan
    Write-Host "Space freed: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor Cyan
    
    Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
    Write-Host "1. Commit the changes:"
    Write-Host "   git add -A"
    Write-Host "   git commit -m 'Remove LFS files, migrate to Google Drive'"
    Write-Host "2. Push to repository:"
    Write-Host "   git push"
    Write-Host "3. Verify deployment works without LFS quota issues"
}
