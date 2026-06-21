#!/usr/bin/env pwsh
# Production Deployment Verification Script
# Comprehensive testing of production deployment

param(
    [string]$FrontendUrl = "https://www.portalsofsamadhi.com",
    [string]$ApiUrl = "https://pos-api.onrender.com",
    [string]$TestEmail = "test@example.com",
    [switch]$SkipDestructive
)

$ErrorActionPreference = "Stop"

Write-Host "=== Production Deployment Verification ===" -ForegroundColor Cyan
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor White
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host "Test Email: $TestEmail" -ForegroundColor White
Write-Host "Skip Destructive Tests: $SkipDestructive" -ForegroundColor White
Write-Host ""

$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name,
        [string]$ExpectedStatus = "200",
        [string]$Method = "GET",
        [string]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        Write-Host "Testing: $Name..." -ForegroundColor Yellow -NoNewline
        
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 30
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host " ✅" -ForegroundColor Green
            $script:passed++
            return $response
        } else {
            Write-Host " ❌ (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:failed++
            return $null
        }
    } catch {
        Write-Host " ❌ (Error: $($_.Exception.Message))" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

function Test-Frontend {
    Write-Host "🌐 Frontend Tests" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    
    # Test main page
    $response = Test-Endpoint -Url $FrontendUrl -Name "Homepage accessibility"
    
    if ($response) {
        $content = $response.Content
        
        # Check for critical elements
        $checks = @{
            "React root element" = $content -match '<div[^>]*id="root"'
            "Meta viewport" = $content -match '<meta[^>]*name="viewport"'
            "Title tag" = $content -match '<title>'
            "Google integration" = $content -match 'google'
            "PayPal integration" = $content -match 'paypal'
            "Stripe integration" = $content -match 'stripe'
            "No exposed secrets" = -not ($content -match 'pk_live_51QzB52K61YEYHkwd1FCWGRFEt')
        }
        
        foreach ($check in $checks.GetEnumerator()) {
            Write-Host "Checking: $($check.Key)..." -ForegroundColor Yellow -NoNewline
            if ($check.Value) {
                Write-Host " ✅" -ForegroundColor Green
                $script:passed++
            } else {
                Write-Host " ❌" -ForegroundColor Red
                $script:failed++
            }
        }
    }
    
    # Test common static assets
    $staticAssets = @(
        "/favicon.ico",
        "/manifest.json"
    )
    
    foreach ($asset in $staticAssets) {
        Test-Endpoint -Url "$FrontendUrl$asset" -Name "Static asset: $asset" | Out-Null
    }
    
    Write-Host ""
}

function Test-API {
    Write-Host "🔌 API Tests" -ForegroundColor Cyan
    Write-Host "=============" -ForegroundColor Cyan
    
    # Common API endpoints
    $endpoints = @(
        @{ Path = "/api/health"; Name = "Health check" },
        @{ Path = "/api/status"; Name = "Status endpoint" },
        @{ Path = "/health"; Name = "Simple health check" },
        @{ Path = "/ping"; Name = "Ping endpoint" }
    )
    
    foreach ($endpoint in $endpoints) {
        $response = Test-Endpoint -Url "$ApiUrl$($endpoint.Path)" -Name $endpoint.Name
        
        # Parse JSON health responses
        if ($response -and $endpoint.Path -match "health|status") {
            try {
                $healthData = $response.Content | ConvertFrom-Json
                Write-Host "  Health data: $($healthData | ConvertTo-Json -Compress)" -ForegroundColor Gray
            } catch {
                # Not JSON, that's okay
            }
        }
    }
    
    Write-Host ""
}

function Test-Newsletter {
    Write-Host "📧 Newsletter Tests" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    
    if ($SkipDestructive) {
        Write-Host "Newsletter test skipped (destructive test disabled)" -ForegroundColor Yellow
        return
    }
    
    # Test newsletter subscription with test data
    $testPayload = @{
        email = $TestEmail
        test = $true
    } | ConvertTo-Json
    
    Test-Endpoint -Url "$ApiUrl/api/newsletter/subscribe" -Name "Newsletter subscription" -Method "POST" -Body $testPayload -ExpectedStatus "200" | Out-Null
    
    Write-Host ""
}

function Test-Security {
    Write-Host "🔒 Security Tests" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    
    # Test for exposed secrets in frontend
    $response = Test-Endpoint -Url $FrontendUrl -Name "Frontend secret exposure check"
    
    if ($response) {
        $content = $response.Content
        $exposedSecrets = @()
        
        # Check for known exposed patterns
        if ($content -match 'pk_live_51QzB52K61YEYHkwd1FCWGRFEt') { $exposedSecrets += "Stripe public key" }
        if ($content -match 'AcChyGp-9gAhHh_') { $exposedSecrets += "PayPal client ID" }
        if ($content -match 'xofw jkau') { $exposedSecrets += "SMTP password" }
        
        Write-Host "Checking for exposed secrets..." -ForegroundColor Yellow -NoNewline
        if ($exposedSecrets.Count -eq 0) {
            Write-Host " ✅" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host " ❌ Found: $($exposedSecrets -join ', ')" -ForegroundColor Red
            $script:failed++
        }
    }
    
    # Test HTTPS redirect
    if ($FrontendUrl.StartsWith("https://")) {
        $httpUrl = $FrontendUrl -replace "https://", "http://"
        try {
            Write-Host "Testing HTTP to HTTPS redirect..." -ForegroundColor Yellow -NoNewline
            $response = Invoke-WebRequest -Uri $httpUrl -MaximumRedirection 0 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
                Write-Host " ✅" -ForegroundColor Green
                $script:passed++
            } else {
                Write-Host " ❌ (No redirect)" -ForegroundColor Red
                $script:failed++
            }
        } catch {
            Write-Host " ⚠️ (Could not test redirect)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

function Test-Performance {
    Write-Host "⚡ Performance Tests" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    
    # Test response times
    $startTime = Get-Date
    $response = Test-Endpoint -Url $FrontendUrl -Name "Frontend response time"
    $endTime = Get-Date
    
    if ($response) {
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        Write-Host "  Response time: $([math]::Round($responseTime, 2))ms" -ForegroundColor Gray
        
        Write-Host "Checking response time..." -ForegroundColor Yellow -NoNewline
        if ($responseTime -lt 3000) {
            Write-Host " ✅ (Fast)" -ForegroundColor Green
            $script:passed++
        } elseif ($responseTime -lt 10000) {
            Write-Host " ⚠️ (Slow)" -ForegroundColor Yellow
            $script:passed++
        } else {
            Write-Host " ❌ (Too slow)" -ForegroundColor Red
            $script:failed++
        }
    }
    
    Write-Host ""
}

function Show-Results {
    Write-Host "📊 Final Results" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    Write-Host "✅ Passed: $passed" -ForegroundColor Green
    Write-Host "❌ Failed: $failed" -ForegroundColor Red
    
    $total = $passed + $failed
    if ($total -gt 0) {
        $successRate = [math]::Round(($passed / $total) * 100, 1)
        Write-Host "📈 Success Rate: $successRate%" -ForegroundColor White
    }
    
    Write-Host ""
    
    if ($failed -eq 0) {
        Write-Host "🎉 All tests passed! Production deployment is healthy." -ForegroundColor Green
        exit 0
    } else {
        Write-Host "⚠️ Some tests failed. Review the results above." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Common fixes:" -ForegroundColor Cyan
        Write-Host "- Verify all environment variables are set in production" -ForegroundColor White
        Write-Host "- Check server logs for errors" -ForegroundColor White
        Write-Host "- Ensure SSL certificates are valid" -ForegroundColor White
        Write-Host "- Confirm all services are running" -ForegroundColor White
        exit 1
    }
}

# Run all test suites
Test-Frontend
Test-API
Test-Newsletter
Test-Security
Test-Performance
Show-Results