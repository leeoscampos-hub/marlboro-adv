#!/usr/bin/env pwsh
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptRoot\..  # move para pasta saas_juridico

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
if (Test-Path (Join-Path (Get-Location) 'migrate_sqlite_to_postgres_sqlalchemy.py')) {
    python migrate_sqlite_to_postgres_sqlalchemy.py --sqlite lexflow.db --database-url "$databaseUrl"
} elseif (Test-Path (Join-Path (Get-Location) 'migrate_sqlite_to_postgres.py')) {
    python migrate_sqlite_to_postgres.py --sqlite lexflow.db --database-url "$databaseUrl"
} else {
    Write-Error "Nenhum script de migração encontrado (migrate_sqlite_to_postgres_sqlalchemy.py ou migrate_sqlite_to_postgres.py)"
    Pop-Location; exit 1
}
if ($LASTEXITCODE -ne 0) { Write-Error "Migração falhou."; Pop-Location; exit 1 }

Write-Output "Migração concluída. Subindo a aplicação (se houver serviço 'app')..."
docker compose up -d app || Write-Output "Serviço 'app' não encontrado no compose; inicie a aplicação localmente apontando .env para o novo DATABASE_URL"

# If ENCRYPTION_PASSPHRASE is set, create lexflow.db.enc from lexflow.db
if ($env:ENCRYPTION_PASSPHRASE -and $env:ENCRYPTION_PASSPHRASE -ne "") {
    Write-Output "ENCRYPTION_PASSPHRASE provided — preparing to create lexflow.db.enc from lexflow.db"
    $pass = $env:ENCRYPTION_PASSPHRASE
    $encPath = Join-Path (Get-Location) 'lexflow.db.enc'
    if (-not (Test-Path (Join-Path (Get-Location) 'lexflow.db'))) {
        Write-Error "lexflow.db not found in repository root; cannot create encrypted file."; Pop-Location; exit 1
    }
    if (Test-Path $encPath -and -not ($env:FORCE_ENCRYPTION -and $env:FORCE_ENCRYPTION -ne "")) {
        Write-Output "lexflow.db.enc already exists and FORCE_ENCRYPTION is not set — skipping creation to avoid overwrite. Set FORCE_ENCRYPTION=1 to force overwrite."
    } else {
        # run a short Python snippet that imports the helper and encrypts
        $py = @"
from saas_juridico.db_crypto import encrypt_file
import os
pwd = os.getcwd()
encrypt_file(os.path.join(pwd,'lexflow.db'), os.path.join(pwd,'lexflow.db.enc'), os.environ.get('ENCRYPTION_PASSPHRASE'))
print('encrypted')
"@
        python - <<PYCODE
$py
PYCODE
        if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create lexflow.db.enc"; Pop-Location; exit 1 }
        Write-Output "Created lexflow.db.enc"
    }
}

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
