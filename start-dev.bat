@echo off
set "NODE_PATH=C:\tools\node-v24.18.0-win-x64"
set "PATH=%NODE_PATH%;%PATH%"
set "ROOT=%~dp0"

echo Starting ITZone...
echo.

echo 1. Building frontend...
cd /d "%ROOT%client"
"%NODE_PATH%\npm.cmd" run build
if %errorlevel% neq 0 (
  echo Build failed!
  pause
  exit /b 1
)

echo 2. Starting server...
cd /d "%ROOT%server"
start "ITZone-Server" "%NODE_PATH%\npm.cmd" run dev

echo.
echo App: http://localhost:3002
echo.
ping -n 5 127.0.0.1 >nul
start http://localhost:3002
echo.
pause
