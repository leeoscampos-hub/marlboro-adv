param(
    [string]$OutputDir = ".\backups"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $OutputDir "lexflow-$timestamp.sql"

docker compose exec -T db pg_dump -U lexflow -d lexflow | Out-File -FilePath $file -Encoding utf8

Write-Host "Backup criado em $file"
