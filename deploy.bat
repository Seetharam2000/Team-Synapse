@echo off
echo 🚀 Alumverse Deployment Script
echo ================================

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy Alumverse to cloud - %date% %time%"

echo.
echo ✅ Ready for deployment!
echo.
echo 🌐 Choose your deployment method:
echo.
echo 1. GitHub Pages (FREE):
echo    - Create repository at github.com
echo    - Run: git remote add origin https://github.com/USERNAME/REPO.git
echo    - Run: git push -u origin main
echo    - Enable Pages in repository settings
echo.
echo 2. Netlify (FREE):
echo    - Go to netlify.com
echo    - Drag this folder to deploy
echo.
echo 3. Vercel (FREE):
echo    - Go to vercel.com
echo    - Import from GitHub
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo.
echo 🎉 Your Alumverse platform is ready for the world!
pause
