@echo off
echo Starting Backend...

set JAVA_HOME=C:\Program Files\Java\jdk-24
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME: %JAVA_HOME%

mvnw.cmd spring-boot:run
