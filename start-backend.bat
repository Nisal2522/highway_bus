@echo off
echo ========================================
echo Highway Express Backend Startup
echo ========================================
echo.

REM Change to backend directory
cd backend

REM Set JAVA_HOME automatically
set "JAVA_HOME=C:\Program Files\Java\jdk-24"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME set to: %JAVA_HOME%
echo.

REM Check if Java exists
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: Java not found at %JAVA_HOME%
    echo Please install Java JDK 24 or update the path in this script.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "mvnw.cmd" (
    echo ERROR: mvnw.cmd not found!
    echo Please ensure you're in the correct backend directory.
    pause
    exit /b 1
)

echo Starting Spring Boot application...
echo This may take a few moments...
echo.

REM Start the backend
call mvnw.cmd spring-boot:run

pause
