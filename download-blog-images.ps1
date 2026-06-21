# Download blog images from Unsplash
# Run this script from the project root directory

# Create images directory if it doesn't exist
if (-not (Test-Path "public/images")) {
    New-Item -ItemType Directory -Path "public/images" -Force
    Write-Host "Created public/images directory"
}

# Download Digital Transformation image
Write-Host "Downloading Digital Transformation image..."
try {
    $digitalUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3`&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`&auto=format`&fit=crop`&w=2340`&q=80"
    Invoke-WebRequest -Uri $digitalUrl -OutFile "public/images/digital-transformation.jpg"
    Write-Host "✓ Digital Transformation image downloaded successfully"
} catch {
    Write-Host "✗ Failed to download Digital Transformation image: $_"
}

# Download Mindful Leadership image
Write-Host "Downloading Mindful Leadership image..."
try {
    $mindfulUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3`&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`&auto=format`&fit=crop`&w=2340`&q=80"
    Invoke-WebRequest -Uri $mindfulUrl -OutFile "public/images/mindful-leadership.jpg"
    Write-Host "✓ Mindful Leadership image downloaded successfully"
} catch {
    Write-Host "✗ Failed to download Mindful Leadership image: $_"
}

Write-Host "`nAll done! Check the public/images/ folder for your downloaded images."
