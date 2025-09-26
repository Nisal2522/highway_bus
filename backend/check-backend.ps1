Write-Host "Checking if Highway Express Backend is ready..." -ForegroundColor Green
Write-Host ""

$connectionTest = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet

if ($connectionTest.TcpTestSucceeded) {
    Write-Host "✓ Backend is running on http://localhost:8080" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Cyan
    Write-Host "1. Start your frontend on http://localhost:3001" -ForegroundColor White
    Write-Host "2. Test registration and login" -ForegroundColor White
    Write-Host "3. Use the logout functionality" -ForegroundColor White
} else {
    Write-Host "✗ Backend is not ready yet" -ForegroundColor Red
    Write-Host "Please wait a few more minutes for the backend to start up." -ForegroundColor Yellow
}
