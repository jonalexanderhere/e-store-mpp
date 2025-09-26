@echo off
setlocal ENABLEDELAYEDEXPANSION

set MONGO_URI=mongodb+srv://Vercel-Admin-atlas-lightBlue-book:5scP865PtNLctb4k@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority

set CAND1=C:\Program Files\MongoDB\mongosh\current\bin\mongosh.exe
set CAND2=C:\Program Files\MongoDB Shell\bin\mongosh.exe
set CAND3=%LOCALAPPDATA%\Programs\mongosh\mongosh.exe
set CAND4=%LOCALAPPDATA%\Programs\mongosh\bin\mongosh.exe

set MONGOSH=
if exist "%CAND1%" set MONGOSH=%CAND1%
if "%MONGOSH%"=="" if exist "%CAND2%" set MONGOSH=%CAND2%
if "%MONGOSH%"=="" if exist "%CAND3%" set MONGOSH=%CAND3%
if "%MONGOSH%"=="" if exist "%CAND4%" set MONGOSH=%CAND4%

if "%MONGOSH%"=="" (
  echo mongosh.exe not found. Please reopen PowerShell/Terminal or add mongosh to PATH.
  exit /b 1
)

echo Using mongosh at: %MONGOSH%
"%MONGOSH%" "%MONGO_URI%" --apiVersion 1 --file mongodb-connect.js

endlocal
