Write-Host "Fixing Booking Database Schema..." -ForegroundColor Green
Write-Host ""

# Check if MySQL is available
try {
    $mysqlVersion = mysql --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL not found"
    }
    Write-Host "MySQL found: $mysqlVersion" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: MySQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install MySQL and add it to your PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Running database fix script..." -ForegroundColor Yellow

# Run the SQL script
try {
    Get-Content fix_booking_database.sql | mysql -u root -p
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database fix completed successfully!" -ForegroundColor Green
        Write-Host "The booking system should now work properly." -ForegroundColor Green
    } else {
        throw "MySQL command failed"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Database fix failed!" -ForegroundColor Red
    Write-Host "Please check your MySQL connection and try again." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to continue"
