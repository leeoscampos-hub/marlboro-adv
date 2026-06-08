param(
    [string]$HealthUrl = $env:HEALTH_URL,
    [int]$TimeoutSeconds = 15
)

if ([string]::IsNullOrWhiteSpace($HealthUrl)) {
    $HealthUrl = "http://127.0.0.1:8765/api/health"
}

$response = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec $TimeoutSeconds

if ($response.status -ne "ok") {
    Write-Error "Healthcheck respondeu, mas sem status ok: $($response | ConvertTo-Json -Compress)"
    exit 2
}

Write-Output "OK $HealthUrl $($response | ConvertTo-Json -Compress)"
