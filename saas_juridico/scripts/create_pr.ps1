#!/usr/bin/env pwsh
Set-StrictMode -Version Latest

Param(
    [string]$Branch = 'feat/encryption-automation',
    [string]$Base = 'main',
    [string]$Remote = 'origin'
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition | Split-Path -Parent
Set-Location $repoRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git not found in PATH. Install git to use this script."; exit 1
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI 'gh' not found in PATH. Install and authenticate (gh auth login)."; exit 1
}

Write-Output "Creating branch $Branch"
git checkout -b $Branch

Write-Output "Staging changes"
git add .

Write-Output "Committing"
git commit -m "Add DB encryption (file+field) and automation" -q
if ($LASTEXITCODE -ne 0) {
    Write-Output "No changes to commit or commit failed." 
}

Write-Output "Pushing to $Remote/$Branch"
git push -u $Remote $Branch
if ($LASTEXITCODE -ne 0) { Write-Error "git push failed"; exit 1 }

Write-Output "Creating PR"
$prBody = Get-Content -Raw -ErrorAction SilentlyContinue "$repoRoot/saas_juridico/PR_BODY.md"
if (-not $prBody) { $prBody = "Adds DB encryption, runner scripts, CI validation and docs." }

gh pr create --title "Add DB encryption (file+field) and automation" --body "$prBody" --base $Base --head $Branch
