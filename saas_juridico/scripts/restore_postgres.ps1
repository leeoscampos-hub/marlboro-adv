param(
    [Parameter(Mandatory = $true)]
    [string]$BackupFile
)

$ErrorActionPreference = "Stop"

if (!(Test-Path -LiteralPath $BackupFile)) {
    throw "Arquivo de backup não encontrado: $BackupFile"
}

Get-Content -LiteralPath $BackupFile -Encoding utf8 | docker compose exec -T db psql -U lexflow -d lexflow

Write-Host "Backup restaurado a partir de $BackupFile"
