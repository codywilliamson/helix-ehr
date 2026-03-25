#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    PowerShell wrapper for the cross-platform Node.js dev stack launcher.
#>

param(
    [ValidateSet('podman', 'docker')]
    [string]$Runtime
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$args = @('./scripts/start-dev.mjs')
if ($Runtime) {
    $args += "--runtime=$Runtime"
}

node @args
