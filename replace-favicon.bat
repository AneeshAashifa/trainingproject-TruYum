@echo off
echo 🍽️ TruYum Favicon Replacement Script
echo =====================================
echo.
echo This script will help you replace the Angular favicon with your TruYum logo.
echo.
echo Step 1: Download the favicon from the browser window that just opened
echo Step 2: Save it as "favicon.ico" in this folder
echo Step 3: Press any key to continue...
pause
echo.
echo Checking for favicon.ico in current directory...
if exist "favicon.ico" (
    echo ✅ Found favicon.ico!
    echo Copying to src/favicon.ico...
    copy "favicon.ico" "src\favicon.ico" /Y
    echo ✅ Favicon replaced successfully!
    echo.
    echo Now:
    echo 1. Go to your browser
    echo 2. Press Ctrl + Shift + R to hard refresh
    echo 3. Or open incognito window: localhost:4200
    echo.
    echo Your TruYum favicon should now appear instead of the Angular symbol!
) else (
    echo ❌ favicon.ico not found in current directory
    echo Please download the favicon first from the browser window
)
echo.
pause
