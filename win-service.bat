@echo off
echo uninstalling Windows service
net stop seedapp.exe
sc delete seedapp.exe
if exist daemon del /q daemon\*.*
set SEED_APP=%~dp0
echo installing Windows service with SEED_APP=%SEED_APP%
node win-service.js
