# Simple Backend Startup - No Fancy Stuff
Write-Host "Starting Backend..." -ForegroundColor Green

# Set JAVA_HOME directly
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Yellow

# Start the backend
.\mvnw.cmd spring-boot:run
