@echo off
where py >nul 2>&1
if errorlevel 1 (
    python "%~dp0Zazeni.py"
) else (
    py -3 "%~dp0Zazeni.py"
)
