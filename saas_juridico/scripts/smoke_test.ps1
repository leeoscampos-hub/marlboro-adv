param(
    [string]$BaseUrl = "http://127.0.0.1:8765"
)

$ErrorActionPreference = "Stop"

$login = Invoke-RestMethod `
    -Uri "$BaseUrl/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"email":"admin@lexflow.local","password":"admin123"}'

$headers = @{ Authorization = "Bearer $($login.token)" }

$health = Invoke-RestMethod -Uri "$BaseUrl/api/health"
$overview = Invoke-RestMethod -Uri "$BaseUrl/api/overview" -Headers $headers
$ai = Invoke-RestMethod -Uri "$BaseUrl/api/ai/status" -Headers $headers

[pscustomobject]@{
    health = $health.status
    database = $health.database
    user = $login.user.email
    clients = $overview.metrics.clientes_ativos
    leads = $overview.metrics.leads_abertos
    ai_enabled = $ai.enabled
    ai_model = $ai.model
} | ConvertTo-Json -Compress
