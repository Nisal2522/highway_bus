@echo off
echo Setting JAVA_HOME environment variable...
echo.

REM Set JAVA_HOME for current user
setx JAVA_HOME "C:\Program Files\Java\jdk-24" /M

echo.
echo JAVA_HOME has been set to: C:\Program Files\Java\jdk-24
echo.
echo Please restart your terminal/command prompt for changes to take effect.
echo.
pause
