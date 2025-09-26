Write-Host "🔄 Backend Restart and Test Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANT: Please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to your backend console (where you started mvn spring-boot:run)" -ForegroundColor Cyan
Write-Host "2. Press Ctrl+C to stop the backend" -ForegroundColor Cyan
Write-Host "3. Restart it with: mvn spring-boot:run" -ForegroundColor Cyan
Write-Host "4. Wait for 'Started Application' message" -ForegroundColor Cyan
Write-Host "5. Come back here and press Enter to test" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter when backend is restarted and running"

Write-Host ""
Write-Host "🧪 Testing API endpoints..." -ForegroundColor Yellow

# Test health endpoint
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Health: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Backend is not running. Please restart it first." -ForegroundColor Red
    exit 1
}

# Test user bookings endpoint
Write-Host "2. Testing user bookings endpoint..." -ForegroundColor Yellow
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/user/1" -Method GET -TimeoutSec 10
    Write-Host "✅ SUCCESS! Found $($userBookings.Count) bookings for user 1" -ForegroundColor Green
    
    if ($userBookings.Count -gt 0) {
        Write-Host "   First booking: $($userBookings[0].passengerName)" -ForegroundColor Cyan
        Write-Host "   Total price: $($userBookings[0].totalPrice)" -ForegroundColor Cyan
        Write-Host "   Status: $($userBookings[0].bookingStatus)" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "🎉 The ViewBooking.js should now work!" -ForegroundColor Green
    Write-Host "Go to your frontend and test the ViewBooking page." -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ User bookings still failing: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Check your backend console for error logs:" -ForegroundColor Yellow
    Write-Host "   Look for: === BOOKING API DEBUG START ===" -ForegroundColor Cyan
    Write-Host "   Look for: NULL POINTER EXCEPTION" -ForegroundColor Red
    Write-Host "   Look for: DATABASE ACCESS EXCEPTION" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Green
