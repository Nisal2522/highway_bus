@echo off
echo Removing occupied seats from database...
echo.

REM Try to run the SQL script
mysql -u root -p highway_express_db < remove_occupied_seats.sql

if %errorlevel% neq 0 (
    echo.
    echo Error: Could not connect to MySQL or run the script.
    echo Please make sure:
    echo 1. MySQL is running
    echo 2. You have the correct password
    echo 3. The database 'highway_express_db' exists
    echo.
    echo You can also run this script manually in MySQL Workbench:
    echo 1. Open MySQL Workbench
    echo 2. Connect to your database
    echo 3. Open the file: remove_occupied_seats.sql
    echo 4. Execute the script
    echo.
    pause
) else (
    echo.
    echo Occupied seats removed successfully!
    echo All seats are now available.
    echo.
    pause
)
