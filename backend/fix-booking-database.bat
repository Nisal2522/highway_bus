@echo off
echo Fixing Booking Database Schema...
echo.

REM Check if MySQL is running
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH
    pause
    exit /b 1
)

echo Running database fix script...
mysql -u root -p < fix_booking_database.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database fix completed successfully!
    echo The booking system should now work properly.
) else (
    echo.
    echo ❌ Database fix failed!
    echo Please check your MySQL connection and try again.
)

echo.
pause
