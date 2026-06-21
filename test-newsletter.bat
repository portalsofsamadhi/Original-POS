@echo off
echo Testing Newsletter Server...
echo.

echo Starting server in background...
start /B node newsletter-server.cjs

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Testing health endpoint...
curl -s http://localhost:3001/api/newsletter/health

echo.
echo Newsletter server test complete!
echo.
echo To manually start: node newsletter-server.cjs
echo To stop any running servers: taskkill /f /im node.exe

pause
