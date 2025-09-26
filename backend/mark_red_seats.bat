@echo off
echo Marking red seats as occupied...

REM Run the SQL script to mark red seats as occupied
mysql -u root -p highway_express_db -e "source mark_red_seats_occupied.sql"

if %errorlevel% equ 0 (
    echo.
    echo Red seats marked as occupied successfully!
    echo Seats 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35 are now occupied.
) else (
    echo.
    echo Failed to mark seats as occupied. Please check your MySQL connection.
)

echo.
pause
