@echo off
echo Starting Backend with Debug Information...
echo.

echo Checking Java version...
java -version
echo.

echo Checking Maven version...
mvn -version
echo.

echo Starting Spring Boot application with debug logging...
echo Backend will start on http://localhost:8081
echo.

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.highwayexpress.backend=DEBUG -Dlogging.level.org.springframework.web=DEBUG"

pause
