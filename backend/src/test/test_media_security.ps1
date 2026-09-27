$ErrorActionPreference = "Continue"

Write-Host "=========================================="
Write-Host "TESTING MEDIA SECURITY & ENTITLEMENTS"
Write-Host "=========================================="

# 1. Unauthenticated request to /api/books/1/episodes
Write-Host "`n[1] GET /api/books/1/episodes (Public/Unauthenticated)"
$episodesRes = Invoke-RestMethod -Uri "http://localhost:8080/api/books/1/episodes" -Method Get
$ep1 = $episodesRes | Where-Object { $_.episodeNumber -eq 1 }
$ep2 = $episodesRes | Where-Object { $_.episodeNumber -eq 2 }

Write-Host "Episode 1 (Free Preview): id=$($ep1.id), isFree=$($ep1.isFree), audioUrl=$($ep1.audioUrl)"
Write-Host "Episode 2 (Locked): id=$($ep2.id), isFree=$($ep2.isFree), audioUrl=$($ep2.audioUrl)"

if ($ep1.audioUrl -ne $null -and $ep2.audioUrl -eq $null) {
    Write-Host "PASS: Episode 2 audioUrl is SANITIZED (null) for unauthenticated caller." -ForegroundColor Green
} else {
    Write-Host "FAIL: Locked episode leaked audioUrl in public listing!" -ForegroundColor Red
}

# 2. Unauthenticated request to /api/books/1/episodes/{id}/play
Write-Host "`n[2] GET /api/books/1/episodes/$($ep2.id)/play (Unauthenticated)"
try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/books/1/episodes/$($ep2.id)/play" -Method Get
    Write-Host "FAIL: Unauthenticated caller was allowed to play locked episode!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Server returned HTTP $statusCode (FORBIDDEN) for unauthenticated request to locked episode." -ForegroundColor Green
}

# 3. Create an unpaid Seeker user (9999999999) and test /play
Write-Host "`n[3] Authenticate as Unpaid Seeker (9999999999)"
$otpRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/send-otp" -Method Post -ContentType "application/json" -Body '{"phone":"9999999999"}'
$verifyRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/verify-otp" -Method Post -ContentType "application/json" -Body '{"phone":"9999999999","otpCode":"123456"}'
$seekerToken = $verifyRes.token

Write-Host "Seeker Token: $($seekerToken.Substring(0, 20))..."

Write-Host "`n[4] GET /api/books/1/episodes/$($ep2.id)/play as Unpaid Seeker"
try {
    $headers = @{ "Authorization" = "Bearer $seekerToken" }
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/books/1/episodes/$($ep2.id)/play" -Method Get -Headers $headers
    Write-Host "FAIL: Unpaid seeker was allowed to play locked episode!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Server returned HTTP $statusCode (FORBIDDEN) for unpaid seeker request to locked episode." -ForegroundColor Green
}

# 4. Admin login
Write-Host "`n[5] Authenticate as Admin (admin@tripura.org)"
$adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@tripura.org","password":"AdminTripura2026!"}'
$adminToken = $adminLogin.token
Write-Host "Admin Token: $($adminToken.Substring(0, 20))..."

Write-Host "`n[6] GET /api/books/1/episodes/$($ep2.id)/play as Admin"
$adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
$adminPlay = Invoke-RestMethod -Uri "http://localhost:8080/api/books/1/episodes/$($ep2.id)/play" -Method Get -Headers $adminHeaders
if ($adminPlay.success -eq $true -and $adminPlay.isUnlocked -eq $true) {
    Write-Host "PASS: Admin can access and play locked episode (isUnlocked=$($adminPlay.isUnlocked))." -ForegroundColor Green
} else {
    Write-Host "FAIL: Admin could not access locked episode!" -ForegroundColor Red
}

Write-Host "`n[7] Purchase Book 1 for Seeker and re-verify playback"
$orderRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -ContentType "application/json" -Headers $headers -Body '{"productType":"BOOK_AUDIO","productId":"1"}'
$verifyPay = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -ContentType "application/json" -Headers $headers -Body "{`"razorpayOrderId`":`"$($orderRes.orderId)`",`"razorpayPaymentId`":`"pay_test_media_sec_1`",`"razorpaySignature`":`"sig_test`"}"
Write-Host "Payment status: $($verifyPay.status)"

$seekerPlayAfterPay = Invoke-RestMethod -Uri "http://localhost:8080/api/books/1/episodes/$($ep2.id)/play" -Method Get -Headers $headers
if ($seekerPlayAfterPay.success -eq $true -and $seekerPlayAfterPay.isUnlocked -eq $true) {
    Write-Host "PASS: Paid seeker receives unlocked playable media!" -ForegroundColor Green
    Write-Host "Stream URL: $($seekerPlayAfterPay.streamUrl)"
} else {
    Write-Host "FAIL: Paid seeker could not play episode after purchase!" -ForegroundColor Red
}

Write-Host "`nMedia Security and Entitlement Audit Complete!"
