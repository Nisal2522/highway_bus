# Universal Backend Startup Script
# This script can be run from any directory

Write-Host "========================================" -ForegroundColor Green
Write-Host "Highway Express Backend Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"

# Check if backend directory exists
if (-not (Test-Path $backendDir)) {
    Write-Host "ERROR: Backend directory not found!" -ForegroundColor Red
    Write-Host "Expected path: $backendDir" -ForegroundColor Red
    exit 1
}

# Change to backend directory
Set-Location $backendDir
Write-Host "Changed to directory: $backendDir" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME - try different Java versions
$javaVersions = @("jdk-24", "jdk-21", "jdk-17")
$javaHome = $null

foreach ($version in $javaVersions) {
    $javaPath = "C:\Program Files\Java\$version"
    if (Test-Path $javaPath) {
        $javaHome = $javaPath
        break
    }
}

if ($javaHome) {
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
    Write-Host "Java version:" -ForegroundColor Yellow
    & "$javaHome\bin\java" -version 2>&1 | Write-Host -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "ERROR: No Java installation found!" -ForegroundColor Red
    Write-Host "Please install Java JDK 17 or higher." -ForegroundColor Red
    exit 1
}

# Check if mvnw.cmd exists
if (-not (Test-Path "mvnw.cmd")) {
    Write-Host "ERROR: mvnw.cmd not found!" -ForegroundColor Red
    Write-Host "Please ensure you're in the correct backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "This may take a few moments..." -ForegroundColor Cyan
Write-Host ""

# Start the backend
& .\mvnw.cmd spring-boot:run
