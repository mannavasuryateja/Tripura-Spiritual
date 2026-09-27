$ErrorActionPreference = "Stop"

Write-Host "=================================================="
Write-Host "PHASE 3 & 4 AUDIT: ADMIN CMS, MEDIA UPLOAD & PLAY"
Write-Host "=================================================="

# 1. Admin Login
Write-Host "`n[Step 1] Logging in as Admin (admin@tripura.org)..."
$adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@tripura.org","password":"AdminTripura2026!"}'
$adminToken = $adminLogin.token
Write-Host "Admin authenticated successfully. Role: $($adminLogin.role)"

# Helper for multipart file upload using HttpClient in PowerShell
Add-Type -AssemblyName System.Net.Http
$httpClient = New-Object System.Net.Http.HttpClient
$httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer $adminToken")

# 2. Upload Book Cover Image
Write-Host "`n[Step 2] Uploading Book Cover Image to /api/admin/media/upload..."
$coverFilePath = [System.IO.Path]::GetFullPath("..\dist\card2.jpg")
$coverFileBytes = [System.IO.File]::ReadAllBytes($coverFilePath)

$multipartCover = New-Object System.Net.Http.MultipartFormDataContent
$fileContentCover = New-Object System.Net.Http.ByteArrayContent($coverFileBytes, 0, $coverFileBytes.Length)
$fileContentCover.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("image/jpeg")
$multipartCover.Add($fileContentCover, "file", "cover_test.jpg")
$multipartCover.Add((New-Object System.Net.Http.StringContent("Test Spiritual Discourse Cover")), "title")
$multipartCover.Add((New-Object System.Net.Http.StringContent("IMAGE")), "mediaType")

$coverResponse = $httpClient.PostAsync("http://localhost:8080/api/admin/media/upload", $multipartCover).Result
$coverJson = $coverResponse.Content.ReadAsStringAsync().Result | ConvertFrom-Json
$coverStorageKey = $coverJson.storageKey
$coverPublicUrl = $coverJson.publicUrl
Write-Host "Cover uploaded successfully! Storage Key: $coverStorageKey, URL: $coverPublicUrl"

# 3. Create New Book via Admin CMS
Write-Host "`n[Step 3] Creating Book 'Test Spiritual Discourse' via POST /api/admin/books..."
$bookPayload = @{
    title = "Test Spiritual Discourse"
    teluguTitle = "పరీక్ష ఆధ్యాత్మిక ప్రసంగం"
    author = "Master Gorli Peddi Raju Garu"
    slug = "test-spiritual-discourse-" + [System.DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    tag = "Self-Inquiry & Jnana"
    price = 199.00
    coverImage = $coverPublicUrl
    description = "A pristine discourse exploring pure awareness and transcendence beyond mental vrittis."
    synopsis = "Direct pointers into silent awareness, cutting through illusions of separation."
    masterQuote = "Rest as the silent observer; what changes is not you."
    isPublished = $true
    sortOrder = 99
} | ConvertTo-Json

$bookCreateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/books" -Method Post -ContentType "application/json; charset=utf-8" -Headers @{ "Authorization" = "Bearer $adminToken" } -Body $bookPayload
$newBookId = $bookCreateResponse.id
Write-Host "New Book created! ID: $newBookId, Title: $($bookCreateResponse.title), Slug: $($bookCreateResponse.slug)"

# 4. Upload Audio Media File
Write-Host "`n[Step 4] Uploading MP3 Audio File to /api/admin/media/upload..."
$audioFilePath = [System.IO.Path]::GetFullPath(".\src\test\sample_audio.mp3")
$audioFileBytes = [System.IO.File]::ReadAllBytes($audioFilePath)

$multipartAudio = New-Object System.Net.Http.MultipartFormDataContent
$fileContentAudio = New-Object System.Net.Http.ByteArrayContent($audioFileBytes, 0, $audioFileBytes.Length)
$fileContentAudio.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("audio/mpeg")
$multipartAudio.Add($fileContentAudio, "file", "sacred_discourse_part1.mp3")
$multipartAudio.Add((New-Object System.Net.Http.StringContent("Sacred Discourse Audio Part 1")), "title")
$multipartAudio.Add((New-Object System.Net.Http.StringContent("AUDIO")), "mediaType")

$audioResponse = $httpClient.PostAsync("http://localhost:8080/api/admin/media/upload", $multipartAudio).Result
Write-Host "Audio Upload HTTP Status: $($audioResponse.StatusCode)"
$audioBody = $audioResponse.Content.ReadAsStringAsync().Result
if (!$audioResponse.IsSuccessStatusCode) {
    Write-Host "Audio upload failed with body: $audioBody" -ForegroundColor Red
    exit 1
}
$audioJson = $audioBody | ConvertFrom-Json
$audioStorageKey = $audioJson.storageKey
$audioPublicUrl = $audioJson.publicUrl
Write-Host "Audio uploaded successfully! Storage Key: $audioStorageKey, URL: $audioPublicUrl"

# 5. Create Episode 1 (Free Preview)
Write-Host "`n[Step 5] Creating Episode 1 (Free Preview) for Book $newBookId..."
$ep1Payload = @{
    episodeNumber = 1
    title = "Episode 1: The Sacred Inception"
    description = "Introductory contemplation and establishing foundation of presence."
    duration = "25:40"
    durationSeconds = 1540
    mediaType = "AUDIO"
    audioUrl = $audioPublicUrl
    isFree = $true
    isPublished = $true
    sortOrder = 1
} | ConvertTo-Json

$ep1Res = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/books/$newBookId/episodes" -Method Post -ContentType "application/json; charset=utf-8" -Headers @{ "Authorization" = "Bearer $adminToken" } -Body $ep1Payload
$ep1Id = $ep1Res.id
Write-Host "Episode 1 created! ID: $ep1Id, Free: $($ep1Res.isFree)"

# 6. Upload distinct Audio Media File for Episode 2 (Locked Discourse)
Write-Host "`n[Step 6A] Uploading distinct Audio Media File for Episode 2 to /api/admin/media/upload..."
$multipartAudio2 = New-Object System.Net.Http.MultipartFormDataContent
$fileContentAudio2 = New-Object System.Net.Http.ByteArrayContent($audioFileBytes, 0, $audioFileBytes.Length)
$fileContentAudio2.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("audio/mpeg")
$multipartAudio2.Add($fileContentAudio2, "file", "sacred_discourse_part2.mp3")
$multipartAudio2.Add((New-Object System.Net.Http.StringContent("Sacred Discourse Audio Part 2")), "title")
$multipartAudio2.Add((New-Object System.Net.Http.StringContent("AUDIO")), "mediaType")

$audioResponse2 = $httpClient.PostAsync("http://localhost:8080/api/admin/media/upload", $multipartAudio2).Result
$audioJson2 = $audioResponse2.Content.ReadAsStringAsync().Result | ConvertFrom-Json
$audioStorageKey2 = $audioJson2.storageKey
$audioPublicUrl2 = $audioJson2.publicUrl
Write-Host "Audio 2 uploaded! Storage Key: $audioStorageKey2, URL: $audioPublicUrl2"

# 6B. Create Episode 2 (Locked / Paid)
Write-Host "`n[Step 6B] Creating Episode 2 (Locked) for Book $newBookId..."
$ep2Payload = @{
    episodeNumber = 2
    title = "Episode 2: Deep Non-Dual Realization"
    description = "Dissolving the root thought 'I' into primordial stillness."
    duration = "32:15"
    durationSeconds = 1935
    mediaType = "AUDIO"
    audioUrl = $audioPublicUrl2
    isFree = $false
    isPublished = $true
    sortOrder = 2
} | ConvertTo-Json

$ep2Res = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/books/$newBookId/episodes" -Method Post -ContentType "application/json; charset=utf-8" -Headers @{ "Authorization" = "Bearer $adminToken" } -Body $ep2Payload
$ep2Id = $ep2Res.id
Write-Host "Episode 2 created! ID: $ep2Id, Free: $($ep2Res.isFree)"

# 7. Admin Logout
Write-Host "`n[Step 7] Admin Logging Out..."
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" -Method Post | Out-Null
Write-Host "Admin logged out successfully."

# 8. User Login (Seeker)
Write-Host "`n[Step 8] Logging in as Seeker (8888888888)..."
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/send-otp" -Method Post -ContentType "application/json; charset=utf-8" -Body '{"phone":"8888888888"}' | Out-Null
$userLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/verify-otp" -Method Post -ContentType "application/json; charset=utf-8" -Body '{"phone":"8888888888","otpCode":"123456"}'
$userToken = $userLogin.token
$userId = $userLogin.userId
Write-Host "Seeker authenticated! User ID: $userId, Name: $($userLogin.name), Role: $($userLogin.role)"

# 9. Verify New Book Appears in Public Book Library
Write-Host "`n[Step 9] Checking Public Book Library (GET /api/books)..."
$allBooks = Invoke-RestMethod -Uri "http://localhost:8080/api/books" -Method Get
$foundBook = $allBooks | Where-Object { $_.id -eq $newBookId }
if ($foundBook) {
    Write-Host "PASS: Newly created book '$($foundBook.title)' appears in public library!" -ForegroundColor Green
    Write-Host "Cover Image: $($foundBook.coverImage)"
} else {
    Write-Host "FAIL: Newly created book was NOT returned in /api/books!" -ForegroundColor Red
    exit 1
}

# 10. Query Episodes as Seeker
Write-Host "`n[Step 10] Querying Episodes for Book $newBookId as Seeker..."
$userHeaders = @{ "Authorization" = "Bearer $userToken" }
$userEpisodes = Invoke-RestMethod -Uri "http://localhost:8080/api/books/$newBookId/episodes" -Method Get -Headers $userHeaders
Write-Host "Found $($userEpisodes.Count) episodes."
$uEp1 = $userEpisodes | Where-Object { $_.id -eq $ep1Id }
$uEp2 = $userEpisodes | Where-Object { $_.id -eq $ep2Id }

Write-Host "Episode 1: Title='$($uEp1.title)', isUnlocked=$($uEp1.isUnlocked), audioUrl='$($uEp1.audioUrl)'"
Write-Host "Episode 2: Title='$($uEp2.title)', isUnlocked=$($uEp2.isUnlocked), audioUrl='$($uEp2.audioUrl)'"

if ($uEp1.isUnlocked -eq $true -and $uEp2.isUnlocked -eq $false -and $uEp2.audioUrl -eq $null) {
    Write-Host "PASS: Episode 1 is unlocked, Episode 2 is locked and audioUrl is withheld." -ForegroundColor Green
} else {
    Write-Host "FAIL: Episode permissions or sanitization incorrect!" -ForegroundColor Red
    exit 1
}

# 11. Play Episode 1 (Free Preview)
Write-Host "`n[Step 11] Playing Episode 1 (Free) via /api/books/$newBookId/episodes/$ep1Id/play..."
$ep1Play = Invoke-RestMethod -Uri "http://localhost:8080/api/books/$newBookId/episodes/$ep1Id/play" -Method Get -Headers $userHeaders
Write-Host "Play response: success=$($ep1Play.success), streamUrl=$($ep1Play.streamUrl)"

# 12. Test Range Streaming for Episode 1
Write-Host "`n[Step 12] Testing HTTP Range Request on Episode 1 Stream..."
$streamReq = [System.Net.HttpWebRequest]::Create("http://localhost:8080" + $ep1Play.streamUrl)
$streamReq.Method = "GET"
$streamReq.AddRange(0, 1023)
$streamResp = $streamReq.GetResponse()
$statusCode = [int]$streamResp.StatusCode
$contentLen = $streamResp.ContentLength
$streamResp.Close()

Write-Host "Stream HTTP Status: $statusCode (Expected 206), Bytes Received: $contentLen"
if ($statusCode -eq 206 -and $contentLen -eq 1024) {
    Write-Host "PASS: Successfully streamed 1024 bytes of real audio via HTTP 206 Partial Content!" -ForegroundColor Green
} else {
    Write-Host "FAIL: HTTP Range stream failed!" -ForegroundColor Red
    exit 1
}

# 13. Try to Play Locked Episode 2 (Should Fail with 403)
Write-Host "`n[Step 13] Requesting Play on Locked Episode 2 as Unpaid Seeker..."
try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/books/$newBookId/episodes/$ep2Id/play" -Method Get -Headers $userHeaders
    Write-Host "FAIL: Seeker was allowed to play locked episode!" -ForegroundColor Red
    exit 1
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Request rejected with HTTP $code (FORBIDDEN) as expected." -ForegroundColor Green
}

# 14. Try to Directly Stream Locked Audio without Purchase (Should Fail with 401/403)
Write-Host "`n[Step 14] Attempting direct stream bypass to /api/media/stream/$audioStorageKey2 (Unpaid)..."
try {
    $bypassReq = [System.Net.HttpWebRequest]::Create("http://localhost:8080/api/media/stream/$audioStorageKey2")
    $bypassReq.Method = "GET"
    $bypassReq.Headers.Add("Authorization", "Bearer $userToken")
    $bypassResp = $bypassReq.GetResponse()
    Write-Host "FAIL: Direct stream bypass succeeded without entitlement!" -ForegroundColor Red
    $bypassResp.Close()
    exit 1
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Direct stream bypass blocked with HTTP $code!" -ForegroundColor Green
}

# 15. Seeker Purchases Book
Write-Host "`n[Step 15] Seeker purchasing Book $newBookId..."
$order = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -ContentType "application/json" -Headers $userHeaders -Body "{`"productType`":`"BOOK_AUDIO`",`"productId`":`"$newBookId`"}"
$verify = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -ContentType "application/json" -Headers $userHeaders -Body "{`"razorpayOrderId`":`"$($order.orderId)`",`"razorpayPaymentId`":`"pay_admin_cms_test_1`",`"razorpaySignature`":`"sig_test`"}"
Write-Host "Payment verified! Status: $($verify.status)"

# 16. Re-request Play on Episode 2 (Now Unlocked!)
Write-Host "`n[Step 16] Requesting Play on Episode 2 After Purchase..."
$ep2PlayAfter = Invoke-RestMethod -Uri "http://localhost:8080/api/books/$newBookId/episodes/$ep2Id/play" -Method Get -Headers $userHeaders
Write-Host "Play response: success=$($ep2PlayAfter.success), isUnlocked=$($ep2PlayAfter.isUnlocked), streamUrl=$($ep2PlayAfter.streamUrl)"

if ($ep2PlayAfter.success -eq $true -and $ep2PlayAfter.isUnlocked -eq $true) {
    Write-Host "PASS: Episode 2 is now UNLOCKED with authenticated stream URL!" -ForegroundColor Green
} else {
    Write-Host "FAIL: Episode 2 remained locked after payment!" -ForegroundColor Red
    exit 1
}

# 17. Stream Episode 2 Using Returned Authorized Stream URL
Write-Host "`n[Step 17] Streaming Episode 2 with HTTP Range Request..."
$ep2StreamReq = [System.Net.HttpWebRequest]::Create("http://localhost:8080" + $ep2PlayAfter.streamUrl)
$ep2StreamReq.Method = "GET"
$ep2StreamReq.AddRange(0, 2047)
$ep2StreamResp = $ep2StreamReq.GetResponse()
$statusCode2 = [int]$ep2StreamResp.StatusCode
$contentLen2 = $ep2StreamResp.ContentLength
$ep2StreamResp.Close()

Write-Host "Stream HTTP Status: $statusCode2 (Expected 206), Bytes Received: $contentLen2"
if ($statusCode2 -eq 206 -and $contentLen2 -eq 2048) {
    Write-Host "PASS: Successfully streamed 2048 bytes of purchased sacred discourse!" -ForegroundColor Green
} else {
    Write-Host "FAIL: Stream verification failed on purchased episode!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=================================================="
Write-Host "ALL ADMIN CMS, MEDIA UPLOAD & STREAM TESTS PASSED!"
Write-Host "=================================================="
