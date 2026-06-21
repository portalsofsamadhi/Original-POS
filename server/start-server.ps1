# Build and start script for the POS Website server

Write-Host "Building server..." -ForegroundColor Green
cd server
npm run build

Write-Host "Starting server..." -ForegroundColor Green
npm start
