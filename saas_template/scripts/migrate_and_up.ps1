#!/usr/bin/env pwsh
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptRoot\..  # move para pasta saas

Write-Output "Subindo serviço Postgres via Docker Compose..."
docker compose up -d db

Write-Output "Aguardando PostgreSQL ficar pronto (até 120s)..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    docker compose exec -T db pg_isready -U postgres > $null 2>&1
    if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $ready) { Write-Error "Postgres não ficou pronto no tempo esperado."; Pop-Location; exit 1 }
Write-Output "Postgres pronto."

Write-Output "Criando database e usuário (se necessário)..."
docker compose exec -T db psql -U postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lexflow') THEN CREATE DATABASE lexflow; END IF; END$$;"
docker compose exec -T db psql -U postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lexflow') THEN CREATE USER lexflow WITH PASSWORD 'lexflow'; GRANT ALL PRIVILEGES ON DATABASE lexflow TO lexflow; END IF; END$$;"

$databaseUrl = "postgresql://lexflow:lexflow@127.0.0.1:5432/lexflow"

# Backup and update .env
$envFile = Join-Path (Get-Location) ".env"
if (Test-Path $envFile) {
    Copy-Item $envFile "$envFile.bak" -Force
    (Get-Content $envFile) -replace '^DATABASE_URL=.*', "DATABASE_URL=$databaseUrl" | Set-Content $envFile
    if (-not (Select-String -Path $envFile -Pattern '^DATABASE_URL=' -Quiet)) {
        Add-Content -Path $envFile -Value "DATABASE_URL=$databaseUrl"
    }
} else {
    "DATABASE_URL=$databaseUrl" | Out-File -FilePath $envFile -Encoding utf8
}

Write-Output "Executando script de migração SQLite -> Postgres..."
python migrate_sqlite_to_postgres.py --sqlite lexflow.db --database-url "$databaseUrl"
if ($LASTEXITCODE -ne 0) { Write-Error "Migração falhou."; Pop-Location; exit 1 }

Write-Output "Migração concluída. Subindo a aplicação (se houver serviço 'app')..."
docker compose up -d app || Write-Output "Serviço 'app' não encontrado no compose; inicie a aplicação localmente apontando .env para o novo DATABASE_URL"

Write-Output "Verificando /api/health até confirmar 'database: postgres' (até 60s)..."
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-RestMethod -Uri http://127.0.0.1:8765/api/health -UseBasicParsing -TimeoutSec 5
        if ($r.database -and $r.database -match 'postgres') { Write-Output "Health ok: usando Postgres"; Pop-Location; exit 0 }
    } catch { }
    Start-Sleep -Seconds 2
}

Write-Error "A aplicação não reportou Postgres no /api/health dentro do tempo esperado. Verifique logs do container/app."
Pop-Location
