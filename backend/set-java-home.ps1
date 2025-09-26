# PowerShell script to set JAVA_HOME permanently
Write-Host "Setting JAVA_HOME environment variable..." -ForegroundColor Green

# Set JAVA_HOME for current user
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-24", "User")

# Also set it for current session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"

Write-Host "JAVA_HOME has been set to: C:\Program Files\Java\jdk-24" -ForegroundColor Green
Write-Host "This change will take effect in new terminal windows." -ForegroundColor Yellow
Write-Host "Current session JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan

# Test if Java is accessible
try {
    $javaVersion = & "C:\Program Files\Java\jdk-24\bin\java" -version 2>&1
    Write-Host "Java version test successful!" -ForegroundColor Green
} catch {
    Write-Host "Error testing Java: $_" -ForegroundColor Red
}

Write-Host "`nTo start the backend, run: .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
