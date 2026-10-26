@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo.
echo   CHAOWENDAO / 朝闻道
echo   Starting local preview...
echo.

where node >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:4173"
  node serve.mjs
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:4173"
  python -m http.server 4173 --bind 127.0.0.1
  goto :eof
)

echo Node.js or Python was not found.
echo You can still open index.html directly, but a local server is recommended.
pause
