#!/usr/bin/env pwsh
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptRoot\..

Write-Output "=== Run full local: DB up -> migrate -> smoke -> UI verify ==="

Write-Output "Step 1: ensure Postgres (docker compose up -d db)"
docker compose up -d db

Write-Output "Step 2: run migration and app startup"
if ($env:USE_DB_ENCRYPTION -and $env:USE_DB_ENCRYPTION -ne "") {
    Write-Output "USE_DB_ENCRYPTION set — running server with encrypted DB workflow"
    if (-not $env:ENCRYPTION_PASSPHRASE) { Write-Output "Set ENCRYPTION_PASSPHRASE env var with your passphrase before running."; Pop-Location; exit 1 }
    python .\scripts\run_encrypted_server.py --passphrase $env:ENCRYPTION_PASSPHRASE
    if ($LASTEXITCODE -ne 0) { Write-Error "run_encrypted_server failed"; Pop-Location; exit 1 }
} else {
    pwsh .\scripts\migrate_and_up.ps1
    if ($LASTEXITCODE -ne 0) { Write-Error "migrate_and_up failed"; Pop-Location; exit 1 }
}

Write-Output "Step 3: smoke test"
pwsh .\scripts\smoke_test.ps1 -BaseUrl "http://127.0.0.1:8765" || Write-Output "Smoke test failed or returned non-zero"

Write-Output "Step 4: UI verification with Playwright (if Node.js installed)"
$node = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $node) {
    Write-Output "Node.js not found in PATH; skipping Playwright UI verification. Install Node to enable this step." ; Pop-Location; exit 0
}

if (!(Test-Path package.json)) {
    npm init -y | Out-Null
}

Write-Output "Installing Playwright (may take a few moments)..."
npm install playwright@1 --no-audit --no-fund | Out-Null

Write-Output "Running UI verifier..."
node verify_astrea_ui.cjs

Pop-Location
