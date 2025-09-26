@echo off
echo ========================================
echo Highway Express Backend Startup
echo ========================================
echo.

REM Set JAVA_HOME - try different Java versions
set JAVA_HOME=C:\Program Files\Java\jdk-24
if not exist "%JAVA_HOME%" (
    set JAVA_HOME=C:\Program Files\Java\jdk-21
)
if not exist "%JAVA_HOME%" (
    set JAVA_HOME=C:\Program Files\Java\jdk-17
)
if not exist "%JAVA_HOME%" (
    echo ERROR: No Java installation found!
    echo Please install Java JDK 17 or higher.
    pause
    exit /b 1
)

echo JAVA_HOME set to: %JAVA_HOME%
echo.

REM Add Java to PATH
set PATH=%JAVA_HOME%\bin;%PATH%

REM Check if we're in the right directory
if not exist "mvnw.cmd" (
    echo ERROR: mvnw.cmd not found!
    echo Please run this script from the backend directory.
    pause
    exit /b 1
)

echo Starting Spring Boot application...
echo This may take a few moments...
echo.

REM Start the backend
call mvnw.cmd spring-boot:run

pause
