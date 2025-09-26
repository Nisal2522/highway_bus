@echo off
echo Removing red occupied seats from database...
echo.

REM Try to run the simple SQL script
mysql -u root -p highway_express_db < remove_red_seats_simple.sql

if %errorlevel% neq 0 (
    echo.
    echo Error: Could not connect to MySQL or run the script.
    echo Please make sure:
    echo 1. MySQL is running
    echo 2. You have the correct password
    echo 3. The database 'highway_express_db' exists
    echo.
    echo Alternative: Run the SQL manually in MySQL Workbench
    echo.
    pause
) else (
    echo.
    echo Red seats removed successfully!
    echo Red seats are now available.
    echo.
    pause
)
