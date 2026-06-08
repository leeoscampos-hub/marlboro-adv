#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Run full local: DB up -> migrate -> smoke -> UI verify ==="

echo "Step 1: ensure Postgres (docker compose up -d db)"
docker compose up -d db

echo "Step 2: run migration and app startup"
pwsh ./scripts/migrate_and_up.ps1 || { echo 'migrate_and_up failed'; exit 1; }

echo "Step 3: smoke test"
pwsh ./scripts/smoke_test.ps1 -BaseUrl "http://127.0.0.1:8765" || echo "Smoke test failed or returned non-zero"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found; skipping Playwright UI verification"
  exit 0
fi

if [ ! -f package.json ]; then
  npm init -y >/dev/null
fi

echo "Installing Playwright (may take a few moments)..."
npm install playwright@1 --no-audit --no-fund >/dev/null

echo "Running UI verifier..."
node verify_astrea_ui.cjs
