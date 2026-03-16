@echo off
cd /d D:\Data\AtlantisITS\projects\popoff-app
start "" cmd /k npx expo start
timeout /t 9 >nul
start "" http://localhost:8081
