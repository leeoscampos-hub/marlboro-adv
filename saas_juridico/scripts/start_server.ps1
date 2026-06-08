param(
    [int]$Port = 8765,
    [string]$BindHost = "127.0.0.1",
    [int]$StartupTimeoutSec = 20
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$venvPython = Join-Path $root "venv\Scripts\python.exe"
$python = $venvPython

if (-not (Test-Path $python)) {
    $python = "C:\Users\Leonardo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
}

if (-not (Test-Path $python)) {
    $python = (Get-Command python -ErrorAction Stop).Source
}

$pidFile = Join-Path $root ("server.{0}.pid" -f $Port)

function Test-Health {
    param(
        [string]$CheckHost,
        [int]$CheckPort
    )

    try {
        $null = Invoke-RestMethod -Uri ("http://{0}:{1}/api/health" -f $CheckHost, $CheckPort) -TimeoutSec 2
        return $true
    }
    catch {
        return $false
    }
}

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

if (Test-Health -CheckHost $BindHost -CheckPort $Port) {
    Write-Output ("Servidor ja esta ativo em http://{0}:{1}" -f $BindHost, $Port)
    exit 0
}

if (Test-Path $pidFile) {
    $oldPid = Get-Content -Path $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($oldPid -match "^\d+$") {
        if (-not (Get-Process -Id ([int]$oldPid) -ErrorAction SilentlyContinue)) {
            Remove-Item -Path $pidFile -ErrorAction SilentlyContinue
        }
    }
    else {
        Remove-Item -Path $pidFile -ErrorAction SilentlyContinue
    }
}

$listeners = Get-ListeningPids -CheckPort $Port
if ($listeners.Count -gt 0) {
    $listenerPid = $listeners[0]
    $procName = ""
    try {
        $procName = (Get-Process -Id $listenerPid -ErrorAction Stop).ProcessName
    }
    catch {
        $procName = "desconhecido"
    }

    Write-Error ("Porta {0} esta em uso por PID {1} ({2})." -f $Port, $listenerPid, $procName)
    exit 1
}

$beforePids = @(
    Get-CimInstance Win32_Process -Filter "name = 'python.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -match "server.py" -and $_.CommandLine -match ("--port\s+{0}" -f $Port) } |
    ForEach-Object { $_.ProcessId }
)

$proc = Start-Process `
    -FilePath $python `
    -ArgumentList @("server.py", "--host", $BindHost, "--port", "$Port") `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -PassThru

$startedPid = $proc.Id

$deadline = (Get-Date).AddSeconds($StartupTimeoutSec)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 500
    if (Test-Health -CheckHost $BindHost -CheckPort $Port) {
        $startedPid = (
            Get-CimInstance Win32_Process -Filter "name = 'python.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -match "server.py" -and $_.CommandLine -match ("--port\s+{0}" -f $Port) -and ($beforePids -notcontains $_.ProcessId) } |
            Sort-Object CreationDate -Descending |
            Select-Object -First 1 -ExpandProperty ProcessId
        )

        if (-not $startedPid) {
            $startedPid = (
                Get-CimInstance Win32_Process -Filter "name = 'python.exe'" -ErrorAction SilentlyContinue |
                Where-Object { $_.CommandLine -match "server.py" -and $_.CommandLine -match ("--port\s+{0}" -f $Port) } |
                Sort-Object CreationDate -Descending |
                Select-Object -First 1 -ExpandProperty ProcessId
            )
        }

        if ($startedPid) {
            $startedPid | Set-Content -Path $pidFile -Encoding ascii
            Write-Output ("Servidor iniciado em http://{0}:{1} (PID {2})." -f $BindHost, $Port, $startedPid)
        }
        else {
            Write-Output ("Servidor iniciado em http://{0}:{1}." -f $BindHost, $Port)
        }

        exit 0
    }
}

try {
    Stop-Process -Id $startedPid -Force -ErrorAction SilentlyContinue
}
catch {
}

Remove-Item -Path $pidFile -ErrorAction SilentlyContinue
Write-Error ("Falha ao iniciar servidor em http://{0}:{1}." -f $BindHost, $Port)

exit 1
