# PowerShell script to start Highway Express Backend
Write-Host "Starting Highway Express Backend..." -ForegroundColor Green

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Yellow

# Check if Java is accessible
try {
    $javaVersion = & java -version 2>&1
    Write-Host "Java version found:" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Cyan
} catch {
    Write-Host "Error: Java not found!" -ForegroundColor Red
    exit 1
}

# Start the backend
Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
try {
    & .\mvnw.cmd spring-boot:run
} catch {
    Write-Host "Error starting backend: $_" -ForegroundColor Red
    exit 1
}
