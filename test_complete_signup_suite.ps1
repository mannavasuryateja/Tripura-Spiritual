$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$testEmail = "test-user-$timestamp@example.com"
$baseUrl = "http://localhost:8080/api/auth"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "RUNNING TRIPURA SIGNUP VERIFICATION SUITE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# TEST 1: Brand-new email
Write-Host "`n[TEST 1] Brand-new email signup ($testEmail)..." -ForegroundColor Yellow
$body1 = @{
    name = "New Seeker $timestamp"
    email = $testEmail
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $res1 = Invoke-RestMethod -Uri "$baseUrl/signup" -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "PASS: HTTP 201 Created. User ID: $($res1.userId), Name: $($res1.name), Email: $($res1.email), Role: $($res1.role)" -ForegroundColor Green
    $token1 = $res1.token
    $createdUserId = $res1.userId
    if ($res1.role -ne "ROLE_SEEKER") {
        Write-Host "FAIL: Default role is not ROLE_SEEKER ($($res1.role))" -ForegroundColor Red
    } else {
        Write-Host "PASS: Verified default role is ROLE_SEEKER" -ForegroundColor Green
    }
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# TEST 2: Same email again -> Expected HTTP 409 CONFLICT
Write-Host "`n[TEST 2] Duplicate email signup with exact same email ($testEmail)..." -ForegroundColor Yellow
try {
    $res2 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 409 but received HTTP $($res2.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $rawResponse = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    Write-Host "Received HTTP Status: $status" -ForegroundColor Cyan
    Write-Host "Response Body: $rawResponse" -ForegroundColor Gray
    if ($status -eq 409) {
        Write-Host "PASS: Successfully returned HTTP 409 CONFLICT for duplicate email" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 409 but got $status" -ForegroundColor Red
    }
}

# TEST 3: Same email with different capitalization -> Expected HTTP 409 CONFLICT
$upperEmail = $testEmail.ToUpper()
Write-Host "`n[TEST 3] Duplicate email with UPPERCASE capitalization ($upperEmail)..." -ForegroundColor Yellow
$body3 = @{
    name = "Duplicate Caps User"
    email = $upperEmail
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $res3 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body3 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 409 but received HTTP $($res3.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $rawResponse = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    Write-Host "Received HTTP Status: $status" -ForegroundColor Cyan
    Write-Host "Response Body: $rawResponse" -ForegroundColor Gray
    if ($status -eq 409) {
        Write-Host "PASS: Case-insensitive duplicate email correctly rejected with HTTP 409 CONFLICT" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 409 but got $status" -ForegroundColor Red
    }
}

# TEST 4: Invalid email format -> Expected HTTP 400 BAD REQUEST
Write-Host "`n[TEST 4] Invalid email format (not-an-email)..." -ForegroundColor Yellow
$body4 = @{
    name = "Invalid Email User"
    email = "not-an-email"
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $res4 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body4 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 400 but got $($res4.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $rawResponse = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    Write-Host "Received HTTP Status: $status" -ForegroundColor Cyan
    Write-Host "Response Body: $rawResponse" -ForegroundColor Gray
    if ($status -eq 400) {
        Write-Host "PASS: Invalid email rejected with HTTP 400 BAD REQUEST" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400 but got $status" -ForegroundColor Red
    }
}

# TEST 5: Short password (<6 chars) -> Expected HTTP 400 BAD REQUEST
Write-Host "`n[TEST 5] Short password (<6 chars)..." -ForegroundColor Yellow
$body5 = @{
    name = "Short Password User"
    email = "short-pass-$timestamp@example.com"
    password = "123"
} | ConvertTo-Json

try {
    $res5 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body5 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 400 but got $($res5.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $rawResponse = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    Write-Host "Received HTTP Status: $status" -ForegroundColor Cyan
    Write-Host "Response Body: $rawResponse" -ForegroundColor Gray
    if ($status -eq 400) {
        Write-Host "PASS: Weak/short password rejected with HTTP 400 BAD REQUEST" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400 but got $status" -ForegroundColor Red
    }
}

# TEST 6: Missing full name -> Expected HTTP 400 BAD REQUEST
Write-Host "`n[TEST 6] Missing full name..." -ForegroundColor Yellow
$body6 = @{
    name = ""
    email = "noname-$timestamp@example.com"
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $res6 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body6 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 400 but got $($res6.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 400) {
        Write-Host "PASS: Missing name rejected with HTTP 400 BAD REQUEST" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400 but got $status" -ForegroundColor Red
    }
}

# TEST 7: Missing email -> Expected HTTP 400 BAD REQUEST
Write-Host "`n[TEST 7] Missing email..." -ForegroundColor Yellow
$body7 = @{
    name = "Valid Name"
    email = ""
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $res7 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body7 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 400 but got $($res7.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 400) {
        Write-Host "PASS: Missing email rejected with HTTP 400 BAD REQUEST" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400 but got $status" -ForegroundColor Red
    }
}

# TEST 8: Missing password -> Expected HTTP 400 BAD REQUEST
Write-Host "`n[TEST 8] Missing password..." -ForegroundColor Yellow
$body8 = @{
    name = "Valid Name"
    email = "nopass-$timestamp@example.com"
    password = ""
} | ConvertTo-Json

try {
    $res8 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method Post -Body $body8 -ContentType "application/json"
    Write-Host "FAIL: Expected HTTP 400 but got $($res8.StatusCode)" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 400) {
        Write-Host "PASS: Missing password rejected with HTTP 400 BAD REQUEST" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400 but got $status" -ForegroundColor Red
    }
}

# TEST 9: Authenticated /api/auth/me session with the newly created user token
Write-Host "`n[TEST 9] Verify session via /api/auth/me with Bearer token..." -ForegroundColor Yellow
$authHeaders = @{
    Authorization = "Bearer $token1"
}
try {
    $meRes = Invoke-RestMethod -Uri "$baseUrl/me" -Method Get -Headers $authHeaders
    Write-Host "PASS: Authenticated /api/auth/me returned user:" -ForegroundColor Green
    Write-Host "      ID: $($meRes.id), Name: $($meRes.name), Email: $($meRes.email), Role: $($meRes.role)" -ForegroundColor Gray
} catch {
    Write-Host "FAIL /api/auth/me: $($_.Exception.Message)" -ForegroundColor Red
}

# TEST 10: Login with the newly created account
Write-Host "`n[TEST 10] Login again with the newly created user credentials ($testEmail)..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = "SecurePassword2026!"
} | ConvertTo-Json

try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "PASS: Login succeeded! New Token: $($loginRes.token.Substring(0, 20))..., Role: $($loginRes.role)" -ForegroundColor Green
} catch {
    Write-Host "FAIL login: $($_.Exception.Message)" -ForegroundColor Red
}

# TEST 11: Direct PostgreSQL password hash verification (check bcrypt prefix $2a$ or $2b$)
Write-Host "`n[TEST 11] PostgreSQL verification of user record and BCrypt password hash..." -ForegroundColor Yellow
if ([string]::IsNullOrWhiteSpace($env:DB_PASSWORD)) {
    Write-Host "FAIL: DB_PASSWORD environment variable is required." -ForegroundColor Red
} else {
    $env:PGPASSWORD = $env:DB_PASSWORD
    $sqlQuery = "SELECT id, name, email, phone, role, substring(password from 1 for 7) as hash_prefix FROM users WHERE email = '$testEmail';"
    & 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d 'tripuradb' -c $sqlQuery
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "ALL TESTS EXECUTED" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
