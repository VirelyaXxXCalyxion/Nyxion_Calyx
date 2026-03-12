@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "SCRIPT=%SCRIPT_DIR%update-nyxion-invariants.mjs"
set "JSON_FILE="

for /f "delims=" %%F in ('dir /b /a:-d /o:-n "%SCRIPT_DIR%nyxion-virelya-invariants.v*.json" 2^>nul') do (
  set "JSON_FILE=%SCRIPT_DIR%%%F"
  goto :json_selected
)

if exist "%SCRIPT_DIR%nyxion-virelya-invariants.json" (
  set "JSON_FILE=%SCRIPT_DIR%nyxion-virelya-invariants.json"
)

:json_selected

if not exist "%SCRIPT%" (
  echo Missing script: %SCRIPT%
  pause
  exit /b 1
)

if "%JSON_FILE%"=="" (
  echo No invariants JSON file found in %SCRIPT_DIR%
  pause
  exit /b 1
)

if not exist "%JSON_FILE%" (
  echo Missing JSON file: %JSON_FILE%
  pause
  exit /b 1
)

if not "%~1"=="" (
  node "%SCRIPT%" --file "%JSON_FILE%" %*
  pause
  exit /b %errorlevel%
)

echo.
echo === Nyxion Invariants Updater ===
echo Leave blank to use defaults.
echo.

set "LEVEL=patch"
set /p LEVEL=Version level [patch/minor/major] ^(default: patch^): 
if "%LEVEL%"=="" set "LEVEL=patch"

set "TYPE=maintenance-update"
set /p TYPE=Change type ^(default: maintenance-update^): 
if "%TYPE%"=="" set "TYPE=maintenance-update"

set "AUTHOR=Virelya"
set /p AUTHOR=Author ^(default: Virelya^): 
if "%AUTHOR%"=="" set "AUTHOR=Virelya"

set "SUMMARY=Update invariants and append changelog entry."
set /p SUMMARY=Summary: 
if "%SUMMARY%"=="" set "SUMMARY=Update invariants and append changelog entry."

set "CHANGE1=Updated invariants content."
set /p CHANGE1=Change bullet 1: 
if "%CHANGE1%"=="" set "CHANGE1=Updated invariants content."

set "CHANGE2=Appended changelog entry without overwrite."
set /p CHANGE2=Change bullet 2: 
if "%CHANGE2%"=="" set "CHANGE2=Appended changelog entry without overwrite."

echo.
choice /M "Dry run only"
if errorlevel 2 (
  node "%SCRIPT%" --file "%JSON_FILE%" --level "%LEVEL%" --author "%AUTHOR%" --type "%TYPE%" --summary "%SUMMARY%" --change "%CHANGE1%" --change "%CHANGE2%"
) else (
  node "%SCRIPT%" --file "%JSON_FILE%" --level "%LEVEL%" --author "%AUTHOR%" --type "%TYPE%" --summary "%SUMMARY%" --change "%CHANGE1%" --change "%CHANGE2%" --dry-run
)

echo.
pause
exit /b %errorlevel%
