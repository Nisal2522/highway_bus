Write-Host "Testing API Endpoints" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get All Bookings
Write-Host "2. Testing Get All Bookings..." -ForegroundColor Yellow
try {
    $allBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings" -Method GET
    Write-Host "✅ All Bookings: Found $($allBookings.Count) bookings" -ForegroundColor Green
} catch {
    Write-Host "❌ Get All Bookings Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get User Bookings (ID 1)
Write-Host "3. Testing Get User Bookings (ID 1)..." -ForegroundColor Yellow
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/user/1" -Method GET
    Write-Host "✅ User Bookings: Found $($userBookings.Count) bookings for user 1" -ForegroundColor Green
    if ($userBookings.Count -gt 0) {
        Write-Host "   First booking: $($userBookings[0].passengerName)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Get User Bookings Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Response: $($_.Exception.Response)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get User Bookings (ID 999 - non-existent)
Write-Host "4. Testing Get User Bookings (ID 999 - non-existent)..." -ForegroundColor Yellow
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/user/999" -Method GET
    Write-Host "✅ User Bookings (999): Found $($userBookings.Count) bookings" -ForegroundColor Green
} catch {
    Write-Host "❌ Get User Bookings (999) Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host "Check the backend console for detailed logs." -ForegroundColor Cyan
