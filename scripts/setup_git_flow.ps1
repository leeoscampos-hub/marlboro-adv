param(
    [string]$RemoteUrl = "https://github.com/leeoscampos-hub/marlboro-adv.git"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git não está instalado ou não está no PATH. Instale o Git for Windows e execute novamente."
}

if (-not (Test-Path ".git")) {
    git init
}

$existingRemote = git remote 2>$null
if ($existingRemote -notcontains "origin") {
    git remote add origin $RemoteUrl
} else {
    git remote set-url origin $RemoteUrl
}

git checkout -B main
git add .
git commit -m "chore: configurar fluxo dev main e cicd" --allow-empty
git push -u origin main

git checkout -B dev
git push -u origin dev

Write-Output "Branches main e dev criadas/publicadas. Use dev para desenvolvimento e PR para main."
