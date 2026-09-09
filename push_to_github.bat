@echo off
setlocal
echo ========================================================
echo   AI-SlopeGuard - Pushing to GitHub (shivanaddicter/landgaurd)
echo ========================================================
echo.

set PATH=%PATH%;C:\Users\User\git\cmd
cd /d "C:\Users\User\Desktop\p1"

set REPO_URL=https://github.com/shivanaddicter/landgaurd.git

echo Remote: %REPO_URL%
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing commits to GitHub main branch...
echo (If a browser window appears, click "Sign in with your browser" to authorize)
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! PUSHED TO GITHUB!
    echo ========================================================
    echo Repository: https://github.com/shivanaddicter/landgaurd
    echo.
    echo Next step to host on Vercel:
    echo  1. Go to https://vercel.com/new
    echo  2. Click "Import" on "shivanaddicter/landgaurd"
    echo  3. Click "Deploy" (Vite settings auto-configured)
    echo ========================================================
) else (
    echo.
    echo [ERROR] Push failed. 
    echo If GitHub asks for credentials, you can also use your GitHub Personal Access Token (PAT).
)

echo.
pause
