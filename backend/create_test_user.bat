@echo off
echo Creating test user for full name functionality...
echo.

REM Run the SQL script to create test user
mysql -u root -p < create_test_user.sql

echo.
echo Test user creation completed!
echo You can now test the full name auto-fill functionality.
echo.
pause
