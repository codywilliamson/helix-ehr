#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    Starts the full helix-ehr dev stack: Postgres, Hasura, seeds, table tracking, and Next.js.

.DESCRIPTION
    1. Detects container runtime (podman or docker)
    2. Tears down existing containers and volumes (clean slate)
    3. Starts Postgres + Hasura via Compose
    4. Waits for Hasura to be healthy
    5. Tracks all tables and relationships in Hasura via the metadata API
    6. Launches Next.js dev server

.PARAMETER Runtime
    Force a specific container runtime: 'podman' or 'docker'.
    Overrides auto-detection.

.EXAMPLE
    ./scripts/start-dev.ps1
.EXAMPLE
    ./scripts/start-dev.ps1 -Runtime podman
#>

param(
    [ValidateSet('podman', 'docker')]
    [string]$Runtime
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')

$HasuraUrl = 'http://localhost:8080'
$AdminSecret = 'your-hasura-admin-secret'

# ── Detect container runtime ─────────────────────────────────────────────────

function Get-ComposeCommand {
    if (Get-Command 'podman' -ErrorAction SilentlyContinue) {
        return 'podman'
    }
    if (Get-Command 'docker' -ErrorAction SilentlyContinue) {
        return 'docker'
    }
    return $null
}

if (-not $Runtime) {
    $Runtime = Get-ComposeCommand
}

function Write-Step([string]$msg) {
    Write-Host "`n>> $msg" -ForegroundColor Cyan
}

function Wait-ForHasura {
    $maxAttempts = 30
    for ($i = 1; $i -le $maxAttempts; $i++) {
        try {
            $response = Invoke-RestMethod -Uri "$HasuraUrl/healthz" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response -eq 'OK' -or $LASTEXITCODE -eq 0) {
                Write-Host '   Hasura is healthy.' -ForegroundColor Green
                return
            }
        } catch {
            # not ready yet
        }
        Write-Host "   Waiting for Hasura... ($i/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    throw 'Hasura did not become healthy in time.'
}

# ── Main ─────────────────────────────────────────────────────────────────────

Push-Location $Root
try {
    if (-not $Runtime) {
        Write-Host "`n   No container runtime found (podman or docker)." -ForegroundColor Yellow
        Write-Host "   Skipping backend — starting Next.js with mock data only.`n" -ForegroundColor Yellow
    } else {
        Write-Host "   Using runtime: $Runtime" -ForegroundColor Gray

        Write-Step 'Tearing down existing containers and volumes'
        & $Runtime compose down -v 2>&1 | Out-Null

        Write-Step 'Starting Postgres + Hasura'
        & $Runtime compose up -d

        Write-Step 'Waiting for Hasura to be healthy'
        Wait-ForHasura

        Write-Step 'Configuring Hasura metadata'
        $env:HASURA_URL = $HasuraUrl
        $env:HASURA_GRAPHQL_ADMIN_SECRET = $AdminSecret
        $env:HASURA_GRAPHQL_DATABASE_URL = 'postgres://postgres:postgres@postgres:5432/helix_ehr'
        node ./scripts/configure-hasura.mjs
    }

    Write-Host "`n`n=== Stack is ready ===" -ForegroundColor Green
    if ($Runtime) {
        Write-Host "  Hasura Console:  $HasuraUrl/console" -ForegroundColor White
        Write-Host "  Admin Secret:    $AdminSecret" -ForegroundColor White
        Write-Host "  GraphQL:         $HasuraUrl/v1/graphql" -ForegroundColor White
    }
    Write-Host "  Next.js:         http://localhost:3000" -ForegroundColor White
    Write-Host "  Login:           admin@helix.dev / password`n" -ForegroundColor White

    Write-Step 'Starting Next.js dev server'
    pnpm dev
}
finally {
    Pop-Location
}
