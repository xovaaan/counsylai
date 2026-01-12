$envContent = Get-Content .env
foreach ($line in $envContent) {
    if ($line -match '^\s*#') { continue }
    if ($line -match '^\s*$') { continue }
    
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        $name = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

Write-Host "Environment variables loaded."
Write-Host "DATABASE_URL: $env:DATABASE_URL"
Write-Host "DIRECT_URL: $env:DIRECT_URL"

npx prisma db push
