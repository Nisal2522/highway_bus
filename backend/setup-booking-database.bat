@echo off
echo Setting up booking database...

REM Database connection parameters
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=highway_express
set DB_USER=root
set DB_PASSWORD=

echo Checking if MySQL is available...
mysql --version
if %errorlevel% neq 0 (
    echo MySQL is not available. Please install MySQL and add it to PATH.
    pause
    exit /b 1
)

echo Creating database if it doesn't exist...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

echo Setting up booking tables...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% %DB_NAME% < simple_booking_setup.sql

if %errorlevel% equ 0 (
    echo.
    echo Booking database setup completed successfully!
    echo You can now use the booking functionality.
) else (
    echo.
    echo Failed to set up booking database. Please check your database connection and credentials.
)

echo.
pause
