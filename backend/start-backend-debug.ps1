Write-Host "Starting Backend with Debug Information..." -ForegroundColor Green
Write-Host ""

Write-Host "Checking Java version..." -ForegroundColor Yellow
java -version
Write-Host ""

Write-Host "Checking Maven version..." -ForegroundColor Yellow
mvn -version
Write-Host ""

Write-Host "Starting Spring Boot application with debug logging..." -ForegroundColor Yellow
Write-Host "Backend will start on http://localhost:8081" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.highwayexpress.backend=DEBUG -Dlogging.level.org.springframework.web=DEBUG"
