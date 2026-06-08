@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start_server.ps1" -Port 8765 -BindHost 127.0.0.1
