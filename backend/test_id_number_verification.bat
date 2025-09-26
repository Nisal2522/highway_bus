@echo off
echo Testing ID Number (NIC) mapping verification...
echo.

REM Run the SQL script to create test user and verify mapping
mysql -u root -p < test_id_number_verification.sql

echo.
echo ID Number mapping test completed!
echo.
echo Expected Results:
echo - Database field: id_number = "123456789V"
echo - Frontend field: NIC Number = "123456789V"
echo - Full name: "John Doe"
echo.
pause
