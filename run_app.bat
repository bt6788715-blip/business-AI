@echo off
title Bizflow AI Server
cd /d "%~dp0"
echo Starting Bizflow AI Business Workflow Agent Server...
python ai_business_agent.py
if %errorlevel% neq 0 (
    echo.
    echo Server crashed or failed to start.
    pause
)
