@echo off
cd /d E:\Data\AtlantisITS
start "" cmd /k mkdocs serve
timeout /t 3 >nul
start "" http://localhost:8000
