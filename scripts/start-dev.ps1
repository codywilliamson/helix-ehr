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

.EXAMPLE
    ./scripts/start-dev.ps1
#>

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

$Runtime = Get-ComposeCommand

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

function Invoke-HasuraMetadata([hashtable]$body) {
    $json = $body | ConvertTo-Json -Depth 10 -Compress
    $params = @{
        Uri         = "$HasuraUrl/v1/metadata"
        Method      = 'Post'
        ContentType = 'application/json'
        Headers     = @{ 'X-Hasura-Admin-Secret' = $AdminSecret }
        Body        = $json
    }
    Invoke-RestMethod @params
}

function Add-HasuraSource {
    Write-Host '   Adding Postgres source to Hasura...' -ForegroundColor Gray
    try {
        Invoke-HasuraMetadata @{
            type = 'pg_add_source'
            args = @{
                name          = 'default'
                configuration = @{
                    connection_info = @{
                        database_url = 'postgres://postgres:postgres@postgres:5432/helix_ehr'
                    }
                }
                replace_configuration = $true
            }
        } | Out-Null
    } catch {
        Write-Host '   Source already exists or added.' -ForegroundColor Gray
    }
}

function Track-Table([string]$table) {
    Write-Host "   Tracking table: $table" -ForegroundColor Gray
    try {
        Invoke-HasuraMetadata @{
            type = 'pg_track_table'
            args = @{
                source = 'default'
                table  = @{ schema = 'public'; name = $table }
            }
        } | Out-Null
    } catch {
        Write-Host "   Table $table already tracked." -ForegroundColor Gray
    }
}

function Track-Relationship([string]$table, [string]$name, [string]$type, [hashtable]$definition) {
    Write-Host "   Tracking relationship: $table.$name ($type)" -ForegroundColor Gray
    $apiType = if ($type -eq 'object') { 'pg_create_object_relationship' } else { 'pg_create_array_relationship' }
    try {
        Invoke-HasuraMetadata @{
            type = $apiType
            args = @{
                source     = 'default'
                table      = @{ schema = 'public'; name = $table }
                name       = $name
                definition = $definition
            }
        } | Out-Null
    } catch {
        Write-Host "   Relationship $table.$name already exists." -ForegroundColor Gray
    }
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
        Add-HasuraSource

        Track-Table 'users'
        Track-Table 'patients'
        Track-Table 'visits'

        Track-Relationship 'patients' 'visits' 'array' @{
            foreign_key_constraint_on = @{
                table  = @{ schema = 'public'; name = 'visits' }
                column = 'patient_id'
            }
        }

        Track-Relationship 'visits' 'patient' 'object' @{
            foreign_key_constraint_on = 'patient_id'
        }

        Write-Step 'Enabling aggregation queries'
        foreach ($table in @('users', 'patients', 'visits')) {
            try {
                Invoke-HasuraMetadata @{
                    type = 'pg_set_table_customization'
                    args = @{
                        source = 'default'
                        table  = @{ schema = 'public'; name = $table }
                        configuration = @{
                            custom_root_fields = @{
                                select_aggregate = "${table}_aggregate"
                            }
                        }
                    }
                } | Out-Null
            } catch {
                # already set
            }
        }
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
