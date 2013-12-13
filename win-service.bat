@echo off
if "%1"=="uninstall" goto UNINSTALL
if "%1"=="install" goto INSTALL
echo Example:
echo   win-service install
echo   win-service uninstall
goto END

:UNINSTALL
echo uninstalling Windows service
if exist daemon net stop SEED_APP
if exist daemon sc delete seed_app.exe
if exist daemon del /q daemon\*.*
rmdir daemon
goto END

:INSTALL
set SEED_APP=%~dp0
echo installing Windows service with SEED_APP=%SEED_APP%
node win-service.js
goto END

:END
