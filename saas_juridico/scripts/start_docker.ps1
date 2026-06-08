$ErrorActionPreference = "Stop"

docker compose up --build -d

Write-Host "LexFlow iniciado em http://127.0.0.1:8765"
Write-Host "Use .\scripts\smoke_test.ps1 para validar."
