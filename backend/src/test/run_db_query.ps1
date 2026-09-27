$env:PGPASSWORD = 'Srinivasnani123'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d 'Tripura-Spiritual' -f 'src\test\check_users.sql'
