@echo off
rem Double-click: copies the school folder into C:\xampp\htdocs\school
set SRC=%~dp0school
xcopy "%SRC%" "C:\xampp\htdocs\school\" /E /I /Y
echo Done. Start Apache + MySQL in XAMPP, then open http://localhost/school/
start http://localhost/school/
pause
