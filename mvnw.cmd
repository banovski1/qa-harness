@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script — version 3.3.2
@REM
@REM Automatically downloads Maven on first run.
@REM Auto-discovers Java 17 from IntelliJ IDEA, Eclipse Adoptium, Oracle,
@REM Microsoft, or the Windows registry if JAVA_HOME is not set.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0") ELSE (SET "BASE_DIR=%__MVNW_ARG0_NAME__%" & CALL SET "BASE_DIR=%%BASE_DIR:\%__MVNW_ARG0_NAME__%=%%")
@SET WRAPPER_JAR=%BASE_DIR%.mvn\wrapper\maven-wrapper.jar
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar

@SETLOCAL EnableExtensions

@REM ─── Auto-discover Java if JAVA_HOME is not set ──────────────────────────────
IF NOT "%JAVA_HOME%"=="" GOTO javaHomeSet

@REM IntelliJ IDEA (JetBrains Toolbox) — Ultimate
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-U\ch-0" 2^>nul') DO (
    IF EXIST "%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-U\ch-0\%%I\jbr\bin\java.exe" (
        SET "JAVA_HOME=%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-U\ch-0\%%I\jbr"
        GOTO javaHomeSet
    )
)

@REM IntelliJ IDEA (JetBrains Toolbox) — Community
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-C\ch-0" 2^>nul') DO (
    IF EXIST "%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-C\ch-0\%%I\jbr\bin\java.exe" (
        SET "JAVA_HOME=%LOCALAPPDATA%\JetBrains\Toolbox\apps\IDEA-C\ch-0\%%I\jbr"
        GOTO javaHomeSet
    )
)

@REM IntelliJ IDEA standalone — Ultimate (Program Files)
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%ProgramFiles%\JetBrains" 2^>nul') DO (
    IF EXIST "%ProgramFiles%\JetBrains\%%I\jbr\bin\java.exe" (
        SET "JAVA_HOME=%ProgramFiles%\JetBrains\%%I\jbr"
        GOTO javaHomeSet
    )
)

@REM Eclipse Adoptium / Temurin JDK 17
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%ProgramFiles%\Eclipse Adoptium" 2^>nul') DO (
    IF EXIST "%ProgramFiles%\Eclipse Adoptium\%%I\bin\java.exe" (
        SET "JAVA_HOME=%ProgramFiles%\Eclipse Adoptium\%%I"
        GOTO javaHomeSet
    )
)

@REM Microsoft Build of OpenJDK 17
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%ProgramFiles%\Microsoft" 2^>nul') DO (
    ECHO %%I | FINDSTR /I /C:"jdk" >nul && (
        IF EXIST "%ProgramFiles%\Microsoft\%%I\bin\java.exe" (
            SET "JAVA_HOME=%ProgramFiles%\Microsoft\%%I"
            GOTO javaHomeSet
        )
    )
)

@REM Oracle / OpenJDK (traditional %ProgramFiles%\Java)
FOR /F "delims=" %%I IN ('DIR /B /AD /O-N "%ProgramFiles%\Java" 2^>nul') DO (
    IF EXIST "%ProgramFiles%\Java\%%I\bin\java.exe" (
        SET "JAVA_HOME=%ProgramFiles%\Java\%%I"
        GOTO javaHomeSet
    )
)

@REM Windows Registry fallback
FOR /F "tokens=2*" %%A IN ('REG QUERY "HKLM\SOFTWARE\JavaSoft\JDK" /v CurrentVersion 2^>nul') DO SET "JAVA_VER=%%B"
IF NOT "%JAVA_VER%"=="" (
    FOR /F "tokens=2*" %%A IN ('REG QUERY "HKLM\SOFTWARE\JavaSoft\JDK\%JAVA_VER%" /v JavaHome 2^>nul') DO SET "JAVA_HOME=%%B"
    IF NOT "%JAVA_HOME%"=="" GOTO javaHomeSet
)

@REM java.exe on PATH
FOR /F "delims=" %%I IN ('WHERE java 2^>nul') DO (
    SET "JAVACMD=%%I"
    GOTO javaCmdSet
)

@ECHO.
@ECHO Error: Java 17 could not be found automatically.
@ECHO.
@ECHO Please do one of the following:
@ECHO   1. Open this project in IntelliJ IDEA (it includes a bundled JDK).
@ECHO   2. Install Java 17 from https://adoptium.net and set JAVA_HOME.
@ECHO   3. Set JAVA_HOME manually before running this script.
@ECHO.
EXIT /B 1

:javaHomeSet
SET "JAVACMD=%JAVA_HOME%\bin\java.exe"

:javaCmdSet
IF NOT EXIST "%JAVACMD%" (
    @ECHO Error: JAVA_HOME is set but java.exe not found at: %JAVACMD%
    EXIT /B 1
)

@REM ─── Download wrapper jar if missing ─────────────────────────────────────────
IF EXIST "%WRAPPER_JAR%" GOTO wrapperJarReady

@ECHO Downloading Maven Wrapper jar...
IF NOT EXIST "%BASE_DIR%.mvn\wrapper" MKDIR "%BASE_DIR%.mvn\wrapper"

FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%BASE_DIR%.mvn\wrapper\maven-wrapper.properties") DO (
    IF "%%A"=="wrapperUrl" SET "DOWNLOAD_URL=%%B"
)

powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')" || (
    @ECHO Error: Failed to download Maven Wrapper jar.
    EXIT /B 1
)

:wrapperJarReady

@REM ─── Launch Maven ─────────────────────────────────────────────────────────────
SET MAVEN_PROJECTBASEDIR=%BASE_DIR%

"%JAVACMD%" ^
  %MAVEN_OPTS% ^
  %MAVEN_DEBUG_OPTS% ^
  -classpath "%WRAPPER_JAR%" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% %*

@ENDLOCAL
