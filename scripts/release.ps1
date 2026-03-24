#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    Bump version, generate changelog, tag, and push — all in one command.

.DESCRIPTION
    Reads conventional commits since the last tag, determines the version
    bump (patch for fixes, minor for features, major if explicitly requested),
    updates package.json and CHANGELOG.md, commits, tags, and pushes.

.PARAMETER Bump
    Force a specific bump: 'patch', 'minor', or 'major'.
    If omitted, standard-version auto-detects from commit messages:
      fix:  → patch
      feat: → minor

.PARAMETER DryRun
    Preview what would happen without making any changes.

.EXAMPLE
    ./scripts/release.ps1              # auto-detect bump from commits
    ./scripts/release.ps1 -Bump minor  # force minor bump
    ./scripts/release.ps1 -DryRun      # preview only
#>

param(
    [ValidateSet('patch', 'minor', 'major')]
    [string]$Bump,

    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))

try {
    # Ensure clean working tree
    $status = git status --porcelain
    if ($status) {
        Write-Host "`n  Uncommitted changes detected. Commit or stash first.`n" -ForegroundColor Red
        git status --short
        exit 1
    }

    # Ensure we're on master
    $branch = git branch --show-current
    if ($branch -ne 'master') {
        Write-Host "`n  Releases should be cut from master (currently on $branch).`n" -ForegroundColor Red
        exit 1
    }

    # Build the standard-version command
    $args = @()
    if ($Bump) { $args += "--release-as", $Bump }
    if ($DryRun) { $args += "--dry-run" }

    Write-Host "`n>> Running standard-version..." -ForegroundColor Cyan
    $env:HUSKY = '0'
    pnpm exec standard-version @args

    if ($DryRun) {
        Write-Host "`n  Dry run complete — no changes made.`n" -ForegroundColor Yellow
        exit 0
    }

    # Show what was created
    $tag = git describe --tags --abbrev=0
    $version = (Get-Content package.json | ConvertFrom-Json).version
    Write-Host "`n>> Tagged: $tag (v$version)" -ForegroundColor Green

    Write-Host ">> Pushing to origin..." -ForegroundColor Cyan
    git push --follow-tags origin master

    Write-Host "`n  Release $tag pushed successfully.`n" -ForegroundColor Green
}
finally {
    Remove-Item Env:\HUSKY -ErrorAction SilentlyContinue
    Pop-Location
}
