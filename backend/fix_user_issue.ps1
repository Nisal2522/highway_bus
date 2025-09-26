Write-Host "🔧 Fixing User Booking Issue" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Step 1: Check if backend is running
Write-Host "1. Checking if backend is running..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is running: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running. Please start the backend first." -ForegroundColor Red
    Write-Host "   Run: mvn spring-boot:run" -ForegroundColor Cyan
    exit 1
}
Write-Host ""

# Step 2: Test the problematic endpoint
Write-Host "2. Testing user bookings endpoint..." -ForegroundColor Yellow
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/user/1" -Method GET -TimeoutSec 10
    Write-Host "✅ User bookings endpoint working: Found $($userBookings.Count) bookings" -ForegroundColor Green
    if ($userBookings.Count -gt 0) {
        Write-Host "   First booking: $($userBookings[0].passengerName)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ User bookings endpoint still failing: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Check backend console logs for detailed error message" -ForegroundColor Cyan
    Write-Host "   2. Restart backend to pick up code changes" -ForegroundColor Cyan
    Write-Host "   3. Ensure user with ID 1 exists in database" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Backend Console Logs to Look For:" -ForegroundColor Yellow
    Write-Host "   === BOOKING API DEBUG START ===" -ForegroundColor Cyan
    Write-Host "   Received request for user bookings: 1" -ForegroundColor Cyan
    Write-Host "   Database connection test - Total users in database: X" -ForegroundColor Cyan
    Write-Host "   Found user: Test User (test@email.com)" -ForegroundColor Cyan
    Write-Host "   Found X bookings for user ID: 1" -ForegroundColor Cyan
    Write-Host "   === BOOKING API DEBUG END ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚨 Error Messages to Look For:" -ForegroundColor Yellow
    Write-Host "   - NULL POINTER EXCEPTION" -ForegroundColor Red
    Write-Host "   - DATABASE ACCESS EXCEPTION" -ForegroundColor Red
    Write-Host "   - RUNTIME EXCEPTION" -ForegroundColor Red
    Write-Host "   - User not found with ID: 1" -ForegroundColor Red
}
Write-Host ""

# Step 3: Test with a different user ID
Write-Host "3. Testing with user ID 999 (non-existent)..." -ForegroundColor Yellow
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/user/999" -Method GET -TimeoutSec 10
    Write-Host "✅ Non-existent user handled correctly: Found $($userBookings.Count) bookings" -ForegroundColor Green
} catch {
    Write-Host "❌ Non-existent user test failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎯 Summary:" -ForegroundColor Green
Write-Host "===========" -ForegroundColor Green
Write-Host "If the endpoint is still failing, the issue is likely:" -ForegroundColor Yellow
Write-Host "1. Backend needs to be restarted to pick up code changes" -ForegroundColor Cyan
    Write-Host "2. User with ID 1 does not exist in database" -ForegroundColor Cyan
Write-Host "3. Database connection issue" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check your backend console for the detailed error message!" -ForegroundColor Yellow
