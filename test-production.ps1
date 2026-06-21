#!/usr/bin/env pwsh
# Comprehensive Production Test Suite

Write-Host "🧪 Running Production Test Suite..." -ForegroundColor Green

$testResults = @()

# Test 1: Environment Configuration
Write-Host "`n📋 Testing Environment Configuration..." -ForegroundColor Blue
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_PAYPAL_CLIENT_ID=.*" -and $envContent -match "VITE_STRIPE_PUBLIC_KEY=.*") {
        Write-Host "✅ Payment credentials configured" -ForegroundColor Green
        $testResults += "Environment: PASS"
    } else {
        Write-Host "❌ Payment credentials missing" -ForegroundColor Red
        $testResults += "Environment: FAIL"
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    $testResults += "Environment: FAIL"
}

# Test 2: TypeScript Compilation
Write-Host "`n🔍 Testing TypeScript Compilation..." -ForegroundColor Blue
$tsResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
    $testResults += "TypeScript: PASS"
} else {
    Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
    $testResults += "TypeScript: FAIL"
}

# Test 3: Production Build
Write-Host "`n🏗️ Testing Production Build..." -ForegroundColor Blue
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0 -and (Test-Path "dist/index.html")) {
    Write-Host "✅ Production build successful" -ForegroundColor Green
    $testResults += "Build: PASS"
} else {
    Write-Host "❌ Production build failed" -ForegroundColor Red
    $testResults += "Build: FAIL"
}

# Test 4: Critical Files Check
Write-Host "`n📁 Testing Critical Files..." -ForegroundColor Blue
$criticalFiles = @(
    "dist/index.html",
    "dist/assets",
    "newsletter-server.ts",
    "package.json"
)

$filesExist = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
        $filesExist = $false
    }
}

if ($filesExist) {
    $testResults += "Files: PASS"
} else {
    $testResults += "Files: FAIL"
}

# Test 5: Newsletter Server
Write-Host "`n📬 Testing Newsletter Server..." -ForegroundColor Blue
try {
    $job = Start-Job -ScriptBlock { 
        Set-Location $using:PWD
        npx ts-node newsletter-server.ts 
    }
    Start-Sleep 3
    
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/newsletter/health" -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Newsletter server responsive" -ForegroundColor Green
        $testResults += "Newsletter: PASS"
    } else {
        Write-Host "❌ Newsletter server not responding" -ForegroundColor Red
        $testResults += "Newsletter: FAIL"
    }
    
    Stop-Job $job -Force
    Remove-Job $job -Force
} catch {
    Write-Host "❌ Newsletter server test failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Newsletter: FAIL"
}

# Test 6: Preview Server
Write-Host "`n🌐 Testing Preview Server..." -ForegroundColor Blue
try {
    $previewJob = Start-Job -ScriptBlock { 
        Set-Location $using:PWD
        npm run preview 
    }
    Start-Sleep 5
    
    $previewResponse = Invoke-WebRequest -Uri "http://localhost:4173" -TimeoutSec 10
    if ($previewResponse.StatusCode -eq 200 -and $previewResponse.Content -match "Portals") {
        Write-Host "✅ Preview server responsive" -ForegroundColor Green
        $testResults += "Preview: PASS"
    } else {
        Write-Host "❌ Preview server not responding correctly" -ForegroundColor Red
        $testResults += "Preview: FAIL"
    }
    
    Stop-Job $previewJob -Force
    Remove-Job $previewJob -Force
} catch {
    Write-Host "❌ Preview server test failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Preview: FAIL"
}

# Test Results Summary
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
foreach ($result in $testResults) {
    if ($result -match "PASS") {
        Write-Host $result -ForegroundColor Green
    } else {
        Write-Host $result -ForegroundColor Red
    }
}

$passCount = ($testResults | Where-Object { $_ -match "PASS" }).Count
$totalTests = $testResults.Count

Write-Host "`n🎯 Overall Score: $passCount/$totalTests tests passed" -ForegroundColor Yellow

if ($passCount -eq $totalTests) {
    Write-Host "`n🎉 All tests passed! Ready for production deployment!" -ForegroundColor Green
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: .\deploy-production.ps1" -ForegroundColor White
    Write-Host "  2. Deploy dist/ folder to hosting provider" -ForegroundColor White
    Write-Host "  3. Configure domain and SSL" -ForegroundColor White
} else {
    Write-Host "`n❌ Some tests failed. Fix issues before deployment." -ForegroundColor Red
    Write-Host "📋 Check the failed tests above and resolve issues." -ForegroundColor Yellow
}
}
