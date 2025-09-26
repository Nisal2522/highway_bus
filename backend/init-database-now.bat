@echo off
echo Initializing Database for Booking System...
echo.

REM Check if MySQL is available
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH
    echo.
    echo Alternative: Run the SQL file manually in your MySQL client
    echo File: init-database-now.sql
    pause
    exit /b 1
)

echo Running database initialization...
mysql -u root -p < init-database-now.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database initialized successfully!
    echo The booking system should now work properly.
) else (
    echo.
    echo ❌ Database initialization failed!
    echo Please check your MySQL connection and try again.
    echo.
    echo You can also run the SQL file manually:
    echo File: init-database-now.sql
)

echo.
pause
