Write-Host "Testing Highway Express Backend..." -ForegroundColor Green
Write-Host ""

$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts - Testing connection..." -ForegroundColor Yellow
    
    $connectionTest = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet
    
    if ($connectionTest.TcpTestSucceeded) {
        Write-Host "✓ Backend is running on http://localhost:8080" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now test the API endpoints:" -ForegroundColor Cyan
        Write-Host "  - POST http://localhost:8080/api/users/register" -ForegroundColor White
        Write-Host "  - POST http://localhost:8080/api/auth/login" -ForegroundColor White
        Write-Host ""
        Write-Host "Your frontend should now work with the backend!" -ForegroundColor Green
        break
    }
    
    Start-Sleep 2
    
} while ($attempt -lt $maxAttempts)

if (-not $connectionTest.TcpTestSucceeded) {
    Write-Host "✗ Backend failed to start within expected time" -ForegroundColor Red
    Write-Host "Please check the backend logs for any errors." -ForegroundColor Red
}
