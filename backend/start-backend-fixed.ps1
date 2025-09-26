Write-Host "========================================" -ForegroundColor Green
Write-Host "Highway Express Backend Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
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

# Check if we're in the right directory
if (-not (Test-Path "mvnw.cmd")) {
    Write-Host "ERROR: mvnw.cmd not found!" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "This may take a few moments..." -ForegroundColor Cyan
Write-Host ""

# Start the backend with the correct command
& .\mvnw.cmd spring-boot:run
