Write-Host "Restarting Backend and Initializing Database..." -ForegroundColor Green
Write-Host ""

# Kill any existing Java processes (backend)
Write-Host "Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*highway-express*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 3

# Start the backend
Write-Host "Starting backend..." -ForegroundColor Yellow
Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -WindowStyle Hidden

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test if backend is running
Write-Host "Testing backend connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/init/status" -Method GET -TimeoutSec 10
    Write-Host "Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "Backend is not responding yet. Please wait a bit more and try manually." -ForegroundColor Red
    Write-Host "You can test with: Invoke-WebRequest -Uri 'http://localhost:8081/api/init/status' -Method GET" -ForegroundColor Yellow
    exit 1
}

# Initialize database
Write-Host "Initializing database..." -ForegroundColor Yellow
try {
    $initResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/init/database" -Method POST -TimeoutSec 10
    $result = $initResponse.Content | ConvertFrom-Json
    Write-Host "Database initialized successfully!" -ForegroundColor Green
    Write-Host "Users: $($result.users), Buses: $($result.buses), Routes: $($result.routes)" -ForegroundColor Cyan
} catch {
    Write-Host "Database initialization failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can try manually: Invoke-WebRequest -Uri 'http://localhost:8081/api/init/database' -Method POST" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete! You can now test the booking system." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8081" -ForegroundColor Cyan
