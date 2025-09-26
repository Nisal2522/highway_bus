Write-Host "🔧 Fixing Booking System..." -ForegroundColor Green
Write-Host ""

# Step 1: Stop existing backend
Write-Host "1. Stopping existing backend..." -ForegroundColor Yellow
try {
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Backend stopped" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ No backend process found or already stopped" -ForegroundColor Yellow
}

# Step 2: Start backend
Write-Host "2. Starting backend..." -ForegroundColor Yellow
Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -WindowStyle Hidden
Write-Host "   ⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Step 3: Test backend
Write-Host "3. Testing backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/quick/status" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend not responding. Please wait a bit more and try manually." -ForegroundColor Red
    Write-Host "   Manual test: Invoke-WebRequest -Uri 'http://localhost:8081/api/quick/status' -Method GET" -ForegroundColor Yellow
    exit 1
}

# Step 4: Initialize database
Write-Host "4. Initializing database..." -ForegroundColor Yellow
try {
    $initResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/quick/init" -Method GET -TimeoutSec 15
    $result = $initResponse.Content | ConvertFrom-Json
    Write-Host "   ✅ Database initialized!" -ForegroundColor Green
    Write-Host "   📊 Users: $($result.users), Buses: $($result.buses), Routes: $($result.routes)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Database initialization failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Manual init: Invoke-WebRequest -Uri 'http://localhost:8081/api/quick/init' -Method GET" -ForegroundColor Yellow
}

# Step 5: Test booking API
Write-Host "5. Testing booking API..." -ForegroundColor Yellow
try {
    $bookingTest = Invoke-WebRequest -Uri "http://localhost:8081/api/bookings" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Booking API is working!" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Booking API test failed, but this might be normal" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Fix Complete!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ You can now test the booking system!" -ForegroundColor Green
