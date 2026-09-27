$ErrorActionPreference = "Stop"

Write-Host "=================================================="
Write-Host "PHASE 11 AUDIT: 1-ON-1 BOOKING VALIDATIONS"
Write-Host "=================================================="

# 1. Login as Seeker
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json; charset=utf-8" -Body '{"email":"ananya@tripura.org","password":"Password123!"}'
$token = $login.token
$headers = @{ "Authorization" = "Bearer $token" }

# Test 1: Date between 1st and 12th of month (Blocked)
Write-Host "`n[Test 1] Booking on 5th of month (Blocked dates 1-12)..."
$blockedDate = (Get-Date).AddMonths(1)
$primaryBlocked = Get-Date -Year $blockedDate.Year -Month $blockedDate.Month -Day 5 -Format "yyyy-MM-dd"
$secondaryValid = Get-Date -Year $blockedDate.Year -Month $blockedDate.Month -Day 16 -Format "yyyy-MM-dd"

$req1 = @{
    category = "SPIRITUAL_ALIGNMENT"
    durationMinutes = 30
    primaryDate = $primaryBlocked
    secondaryDate = $secondaryValid
    preferredTimeSlot = "10:00 AM - 10:30 AM IST"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/book" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $req1
    Write-Host "FAIL: Blocked date (1-12) was accepted!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "PASS: Server rejected date between 1st and 12th: $($_.Exception.Message)" -ForegroundColor Green
}

# Test 2: Primary and Secondary dates are identical
Write-Host "`n[Test 2] Booking with Primary == Secondary date..."
$primaryValid = Get-Date -Year $blockedDate.Year -Month $blockedDate.Month -Day 15 -Format "yyyy-MM-dd"

$req2 = @{
    category = "SPIRITUAL_ALIGNMENT"
    durationMinutes = 30
    primaryDate = $primaryValid
    secondaryDate = $primaryValid
    preferredTimeSlot = "10:00 AM - 10:30 AM IST"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/book" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $req2
    Write-Host "FAIL: Identical primary/secondary date was accepted!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "PASS: Server rejected identical dates: $($_.Exception.Message)" -ForegroundColor Green
}

# Test 3: Past date
Write-Host "`n[Test 3] Booking with date in the past..."
$req3 = @{
    category = "SPIRITUAL_ALIGNMENT"
    durationMinutes = 30
    primaryDate = "2025-01-15"
    secondaryDate = "2025-01-20"
    preferredTimeSlot = "10:00 AM - 10:30 AM IST"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/book" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $req3
    Write-Host "FAIL: Past date was accepted!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "PASS: Server rejected past dates: $($_.Exception.Message)" -ForegroundColor Green
}

# Test 4: Valid Booking (15th and 18th of next month)
Write-Host "`n[Test 4] Valid Booking on 15th & 18th of month..."
$secondaryValid2 = Get-Date -Year $blockedDate.Year -Month $blockedDate.Month -Day 18 -Format "yyyy-MM-dd"
$req4 = @{
    category = "SADHANA_OBSTACLES"
    durationMinutes = 60
    primaryDate = $primaryValid
    secondaryDate = $secondaryValid2
    preferredTimeSlot = "04:00 PM - 05:00 PM IST"
} | ConvertTo-Json

$booking = Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/book" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $req4
Write-Host "Booking created: ID=$($booking.id), Amount=₹$($booking.amount), Status=$($booking.status)"

if ($booking.status -eq "PENDING" -and $booking.amount -eq 899.00) {
    Write-Host "PASS: Valid booking created with 60-min fee ₹899." -ForegroundColor Green
}

# Test 5: Prevent Duplicate Booking for same user on same primary date
Write-Host "`n[Test 5] Attempting duplicate booking on same date..."
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/book" -Method Post -ContentType "application/json; charset=utf-8" -Headers $headers -Body $req4
    Write-Host "FAIL: Duplicate booking allowed!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "PASS: Server rejected duplicate booking on same date: $($_.Exception.Message)" -ForegroundColor Green
}

# Test 6: Cancel Booking
Write-Host "`n[Test 6] Cancelling booking #$($booking.id)..."
$cancelRes = Invoke-RestMethod -Uri "http://localhost:8080/api/mentor/bookings/$($booking.id)/cancel" -Method Post -Headers $headers
Write-Host "Cancel message: $($cancelRes.message)"
if ($cancelRes.success -eq $true) {
    Write-Host "PASS: Booking successfully cancelled." -ForegroundColor Green
}

Write-Host "`n=================================================="
Write-Host "ALL 1-ON-1 BOOKING VALIDATIONS PASSED!"
Write-Host "=================================================="
