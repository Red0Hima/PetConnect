# Copy PetConnect project from current drive to target PC directory
# Usage:
#   Run in PowerShell:  ./copy_to_local.ps1
# Optional params:
#   ./copy_to_local.ps1 -Source "D:\PetConnect" -Destination "C:\Users\love4\Documents\Hanzel-y-Ana"

param(
  [string]$Source = (Resolve-Path -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path,
  [string]$Destination = "C:\Users\love4\Documents\HanzelYAna"
)

Write-Host "Source: $Source" -ForegroundColor Cyan
Write-Host "Destination: $Destination" -ForegroundColor Cyan

# Validate source exists
if (-not (Test-Path -LiteralPath $Source)) {
    Write-Error "Source path does not exist: $Source"
    exit 1
}

# Create destination directory if missing
if (-not (Test-Path -LiteralPath $Destination)) {
    Write-Host "Creating destination directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Copy options
$copyParams = @{
    Path = $Source
    Destination = $Destination
    Recurse = $true
    Container = $true
}

# Exclusions (uncomment if you want to skip heavy folders)
# $exclude = @('node_modules', 'dist', 'build', '.git')
# Write-Host "Excluding: $($exclude -join ', ')" -ForegroundColor Yellow
# $copyParams.Add('Exclude', $exclude)

# Perform copy
Write-Host "Copying files... This may take a moment." -ForegroundColor Green
try {
    Copy-Item @copyParams -Force
    Write-Host "Copy completed successfully." -ForegroundColor Green
} catch {
    Write-Error "Copy failed: $($_.Exception.Message)"
    exit 1
}

# Summary
Write-Host "Project copied to: $Destination" -ForegroundColor Green
