@echo off
cd /d D:\Data\AtlantisITS\projects\icebreakrz
start cmd /k "npm start"
timeout /t 6 >nul
start "" http://localhost:3010