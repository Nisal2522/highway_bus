@echo off
echo Starting Highway Express Backend...
echo.

REM Set JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-17
echo JAVA_HOME set to: %JAVA_HOME%

REM Start the backend
echo Starting Spring Boot application...
mvnw.cmd spring-boot:run

pause
