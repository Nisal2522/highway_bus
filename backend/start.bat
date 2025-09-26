@echo off
echo Starting Highway Express Backend...
echo.
echo Make sure you have:
echo 1. Java 11+ installed
echo 2. MySQL running with highway_express_db database
echo.
echo Press any key to continue...
pause >nul

cd /d "%~dp0"
mvnw.cmd spring-boot:run

pause
