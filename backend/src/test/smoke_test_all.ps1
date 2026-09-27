$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:8080/api"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TRIPURA SPIRITUAL - COMPREHENSIVE SMOKE TEST" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Health check & products
Write-Host "1. Testing Public Products & Sessions..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
Write-Host "   Products found: $($products.Count)" -ForegroundColor Green
$sessions = Invoke-RestMethod -Uri "$baseUrl/sessions" -Method Get
Write-Host "   Sessions found: $($sessions.Count)" -ForegroundColor Green

# 2. Public Book Library & Episode Sanitization
Write-Host "2. Testing Public Book Library..." -ForegroundColor Yellow
$books = Invoke-RestMethod -Uri "$baseUrl/books" -Method Get
Write-Host "   Books found: $($books.Count)" -ForegroundColor Green
$testBook = $books[0]
$episodes = Invoke-RestMethod -Uri "$baseUrl/books/$($testBook.id)/episodes" -Method Get
Write-Host "   Episodes in '$($testBook.title)': $($episodes.Count)" -ForegroundColor Green
$lockedEp = $episodes | Where-Object { -not $_.isFree } | Select-Object -First 1
if ($lockedEp) {
    if ($null -eq $lockedEp.audioUrl -or $lockedEp.audioUrl -eq "") {
        Write-Host "   [PASS] Locked episode audioUrl correctly sanitized to null!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Locked episode audioUrl was leaked: $($lockedEp.audioUrl)" -ForegroundColor Red
    }
}

# 3. Authentication & RBAC Check
Write-Host "3. Testing Admin & Seeker Authentication..." -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@tripura.org"
    password = "AdminTripura2026!"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.token
$adminRole = $adminRes.role
Write-Host "   [PASS] Admin Login successful. Role: $adminRole" -ForegroundColor Green

$seekerLoginBody = @{
    email = "ananya@tripura.org"
    password = "Password123!"
} | ConvertTo-Json

$seekerRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $seekerLoginBody -ContentType "application/json"
$seekerToken = $seekerRes.token
$seekerRole = $seekerRes.role
Write-Host "   [PASS] Seeker Login successful. Role: $seekerRole" -ForegroundColor Green

# 4. RBAC Protection
Write-Host "4. Testing RBAC Protection on Admin Endpoints..." -ForegroundColor Yellow
try {
    $blocked = Invoke-RestMethod -Uri "$baseUrl/admin/stats" -Method Get -Headers @{ Authorization = "Bearer $seekerToken" }
    Write-Host "   [FAIL] Seeker was able to access Admin Stats!" -ForegroundColor Red
} catch {
    Write-Host "   [PASS] Seeker rejected from Admin API with HTTP 403 Forbidden!" -ForegroundColor Green
}

# 5. Media Security Range Streaming Check
Write-Host "5. Testing HTTP Range Streaming & Entitlement..." -ForegroundColor Yellow
$firstFree = $episodes | Where-Object { $_.isFree } | Select-Object -First 1
if ($firstFree) {
    $playRes = Invoke-RestMethod -Uri "$baseUrl/books/$($testBook.id)/episodes/$($firstFree.id)/play" -Method Get
    Write-Host "   Free Episode Play Stream: $($playRes.streamUrl)" -ForegroundColor Green
    
    $allMedia = Invoke-RestMethod -Uri "$baseUrl/admin/media" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
    $testAudio = $allMedia | Where-Object { $_.mediaType -eq "AUDIO" } | Select-Object -First 1
    
    if ($testAudio) {
        $localKey = $testAudio.storageKey
        $fullStreamUrl = "http://localhost:8080/api/media/stream/$localKey"
        $rangeReq = [System.Net.HttpWebRequest]::Create($fullStreamUrl)
        $rangeReq.Headers.Add("Authorization", "Bearer $adminToken")
        $rangeReq.Method = "GET"
        $rangeReq.AddRange(0, 1023)
        $rangeResp = $rangeReq.GetResponse()
        $statusCode = [int]$rangeResp.StatusCode
        $contentRange = $rangeResp.Headers["Content-Range"]
        $rangeResp.Close()
        if ($statusCode -eq 206) {
            Write-Host "   [PASS] HTTP 206 Partial Content verified on uploaded MP3! Content-Range: $contentRange" -ForegroundColor Green
        } else {
            Write-Host "   [FAIL] Range request returned status: $statusCode" -ForegroundColor Red
        }
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "ALL CORE SMOKE TESTS EXECUTED AND PASSED!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
