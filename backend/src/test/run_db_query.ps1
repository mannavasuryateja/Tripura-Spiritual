if ([string]::IsNullOrWhiteSpace($env:DB_PASSWORD)) {
    Write-Error "DB_PASSWORD environment variable is required."
    exit 1
}
$env:PGPASSWORD = $env:DB_PASSWORD
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d 'tripuradb' -f 'src\test\check_users.sql'
