@echo off
setlocal
echo ========================================================
echo   AI-SlopeGuard - Push to GitHub & Deploy to Vercel
echo ========================================================
echo.

set PATH=%PATH%;C:\Users\User\git\cmd

if "%~1"=="" (
    set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/your-username/ai-slopeguard.git): "
) else (
    set REPO_URL=%~1
)

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo [1/3] Setting remote origin to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Ensuring branch is set to main...
git branch -M main

echo [3/3] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESSFULLY PUSHED TO GITHUB!
    echo ========================================================
    echo Next steps to host on Vercel:
    echo  1. Go to https://vercel.com/new
    echo  2. Click "Import" next to your ai-slopeguard repository
    echo  3. Framework Preset: Vite (automatically detected)
    echo  4. Root Directory: ./ (or ./frontend)
    echo  5. Click "Deploy"!
    echo ========================================================
) else (
    echo.
    echo [NOTICE] If GitHub asked for authentication:
    echo  - Use your GitHub Personal Access Token (PAT) as password, or
    echo  - Ensure SSH keys are added if using git@github.com format.
)

echo.
pause
