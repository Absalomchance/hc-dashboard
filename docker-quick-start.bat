@echo off
echo PMS Dashboard - Docker Quick Setup
echo ===================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo Or run docker-setup.ps1 as Administrator for automatic installation
    pause
    exit /b 1
)

echo Docker found, building image...

REM Build the Docker image
docker build -t pms-dashboard .
if %errorlevel% neq 0 (
    echo Failed to build Docker image
    pause
    exit /b 1
)

echo Image built successfully!

REM Stop any existing container
docker stop pms-dashboard >nul 2>&1
docker rm pms-dashboard >nul 2>&1

echo Starting container...

REM Run the container
docker run -d --name pms-dashboard -p 3000:3000 --restart unless-stopped pms-dashboard
if %errorlevel% neq 0 (
    echo Failed to start container
    pause
    exit /b 1
)

echo.
echo ✅ PMS Dashboard is now running!
echo 🌐 Open your browser and go to: http://localhost:3000
echo.
echo Useful commands:
echo   docker logs pms-dashboard          - View logs
echo   docker stop pms-dashboard          - Stop container
echo   docker start pms-dashboard         - Start container
echo   docker-compose up -d --build       - Alternative using compose
echo.
pause