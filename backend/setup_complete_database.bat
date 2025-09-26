@echo off
echo Setting up complete database with all tables and sample data...

REM Run the complete database setup script
mysql -u root -p highway_express_db < complete_database_setup.sql

if %errorlevel% equ 0 (
    echo.
    echo Database setup completed successfully!
    echo You can now test the booking functionality.
) else (
    echo.
    echo Failed to set up database. Please check your MySQL connection.
)

echo.
pause
