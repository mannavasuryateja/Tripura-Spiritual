$body = @{
    name     = "srini"
    email    = "Mani@test.com"
    password = "Password123!"
} | ConvertTo-Json

Write-Host "Sending POST /api/auth/signup with payload:"
Write-Host $body

try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
    Write-Host "SUCCESS (Status 200/201):" -ForegroundColor Green
    Write-Host ($res | ConvertTo-Json)
}
catch {
    $resp = $_.Exception.Response
    $statusCode = [int]$resp.StatusCode
    Write-Host "FAILED with HTTP Status: $statusCode" -ForegroundColor Red
    $stream = $resp.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Yellow
    }
}
