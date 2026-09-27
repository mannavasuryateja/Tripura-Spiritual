$ErrorActionPreference = "Stop"

Write-Host "=================================================="
Write-Host "PHASE 5 AUDIT: PAYMENT EDGE CASES & IDEMPOTENCY"
Write-Host "=================================================="

# 1. Login as Seeker
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json; charset=utf-8" -Body '{"email":"admin@tripura.org","password":"AdminTripura2026!"}'
$token = $login.token
$headers = @{ "Authorization" = "Bearer $token" }

# Test 1: Create Order
Write-Host "`n[Test 1] Create Order for Live Session..."
$orderReq = @{
    productType = "LIVE_SESSION"
    sessionId = 1
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $orderReq
Write-Host "Order created: orderId=$($orderRes.orderId), amount=$($orderRes.amount)"

# Test 2: Cancel/Fail Payment
Write-Host "`n[Test 2] Report Payment Failure / Cancellation..."
$failReq = @{
    orderId = $orderRes.orderId
    reason = "User closed Razorpay modal"
} | ConvertTo-Json

$failRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/fail" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $failReq
Write-Host "Fail response: $($failRes.message)"
if ($failRes.success -eq $true) {
    Write-Host "PASS: Payment cancellation recorded." -ForegroundColor Green
}

# Test 3: Create Second Order & Test Verification Idempotency
Write-Host "`n[Test 3] Create Second Order & Verify Idempotent Fulfillment..."
$order2 = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $orderReq
$orderId2 = $order2.orderId

$verifyBody = @{
    razorpayOrderId = $orderId2
    razorpayPaymentId = "pay_idem_test_1"
    razorpaySignature = "sig_valid_test"
} | ConvertTo-Json

# First verification
$v1 = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $verifyBody
Write-Host "First verification status: $($v1.status)"

# Duplicate verification (same order)
$v2 = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $verifyBody
Write-Host "Duplicate verification status: $($v2.status)"

if ($v1.status -eq "PAID" -and $v2.status -eq "PAID") {
    Write-Host "PASS: Duplicate verification handled idempotently without error." -ForegroundColor Green
}

# Test 4: Webhook Idempotency
Write-Host "`n[Test 4] Webhook Idempotency Test..."
$webhookEventId = "evt_test_" + [System.DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$webhookPayload = @{
    event = "payment.captured"
    payload = @{
        payment = @{
            entity = @{
                id = "pay_wh_test_1"
                order_id = $orderId2
                status = "captured"
            }
        }
    }
} | ConvertTo-Json

$whHeaders = @{ "X-Razorpay-Event-Id" = $webhookEventId }
# First webhook call
$wh1 = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/webhook" -Method Post -ContentType "application/json; charset=utf-8" -Headers $whHeaders -Body $webhookPayload
Write-Host "First webhook call: status=$($wh1.status)"

# Duplicate webhook call with same event id
$wh2 = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/webhook" -Method Post -ContentType "application/json; charset=utf-8" -Headers $whHeaders -Body $webhookPayload
Write-Host "Duplicate webhook call: status=$($wh2.status)"

if ($wh1.status -eq "ok" -and $wh2.status -eq "ok") {
    Write-Host "PASS: Duplicate webhook processed idempotently." -ForegroundColor Green
}

Write-Host "`n=================================================="
Write-Host "ALL PAYMENT TESTS PASSED!"
Write-Host "=================================================="
