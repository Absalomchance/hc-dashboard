@echo off
echo 🚀 Building PMS Dashboard for Production Deployment
echo ==================================================

REM Step 1: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "dist" (
    rmdir /s /q "dist"
    echo    ✅ Removed old dist folder
)

REM Step 2: Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo    ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo    ✅ Dependencies installed successfully

REM Step 3: Build for production
echo 🏗️  Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo    ❌ Build failed
    pause
    exit /b 1
)
echo    ✅ Production build completed

REM Step 4: Copy additional files to dist
echo 📁 Copying additional files...
if exist "public\.htaccess" (
    copy "public\.htaccess" "dist\.htaccess" >nul
    echo    ✅ Copied .htaccess file
) else (
    echo    ⚠️  .htaccess not found in public folder
)

if exist "public\nsa.png" (
    copy "public\nsa.png" "dist\nsa.png" >nul
    echo    ✅ Copied NSA logo
) else (
    echo    ⚠️  nsa.png not found in public folder
)

REM Step 5: Create deployment package
echo 📦 Creating deployment package...
powershell -command "Compress-Archive -Path 'dist\*' -DestinationPath 'pms-dashboard-production.zip' -Force"
if %errorlevel% equ 0 (
    echo    ✅ Created pms-dashboard-production.zip
) else (
    echo    ⚠️  Could not create ZIP package, but files are ready in dist\
)

REM Step 6: Show deployment instructions
echo.
echo 🎉 Build Complete!
echo ==================
echo.
echo 📋 Next Steps:
echo 1. Create subdomain 'pms' for domain 'nsa.org.na' in cPanel
echo 2. Upload all files from 'dist\' folder to /public_html/pms/
echo 3. Update Azure AD App Registration redirect URI to: https://pms.nsa.org.na
echo 4. Enable SSL certificate for pms.nsa.org.na
echo 5. Test the application at https://pms.nsa.org.na
echo.
echo 📁 Files ready for upload in: .\dist\
echo 📦 Deployment package: .\pms-dashboard-production.zip
echo.
echo 🔧 Troubleshooting:
echo - If you see a blank page, check browser console for errors
echo - Ensure .htaccess file is uploaded to enable React Router
echo - Verify Azure AD redirect URI is updated
echo.
pause