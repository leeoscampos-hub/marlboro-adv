param(
    [int]$Port = 8765
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $root ("server.{0}.pid" -f $Port)
$stopped = $false
$permissionError = $false

function Get-ListeningPids {
    param([int]$CheckPort)

    $pattern = "^\s*TCP\s+\S+:$CheckPort\s+\S+\s+LISTENING\s+(\d+)\s*$"
    $pids = @()
    netstat -ano -p TCP | ForEach-Object {
        if ($_ -match $pattern) {
            $pids += [int]$matches[1]
        }
    }

    return $pids | Select-Object -Unique
}

if (Test-Path $pidFile) {
    $pidText = Get-Content -Path $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pidText -match "^\d+$") {
        try {
            Stop-Process -Id ([int]$pidText) -ErrorAction Stop
            Write-Output ("Servidor parado. PID {0}" -f $pidText)
            $stopped = $true
        }
        catch {
            $permissionError = $true
        }
    }

    Remove-Item -Path $pidFile -ErrorAction SilentlyContinue
}

$listeners = Get-ListeningPids -CheckPort $Port
foreach ($listenerPid in $listeners) {
    try {
        Stop-Process -Id $listenerPid -ErrorAction Stop
        Write-Output ("Servidor parado pela porta {0}. PID {1}" -f $Port, $listenerPid)
        $stopped = $true
    }
    catch {
        $permissionError = $true
    }
}

if (-not $stopped) {
    if ($permissionError) {
        Write-Output ("Servidor encontrado na porta {0}, mas sem permissao para encerrar. Execute o terminal como administrador." -f $Port)
    }
    else {
        Write-Output ("Nenhum servidor em execucao na porta {0}." -f $Port)
    }
}
