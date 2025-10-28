# Docker Installation and Setup Script for Windows

Write-Host "PMS Dashboard - Docker Setup Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host "❌ This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green

# Check if Docker Desktop is already installed
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker is already installed" -ForegroundColor Green
    docker --version
} else {
    Write-Host "📦 Docker Desktop not found. Installing..." -ForegroundColor Yellow
    
    # Enable Hyper-V and Containers features (required for Docker Desktop)
    Write-Host "🔧 Enabling Windows features for Docker..." -ForegroundColor Yellow
    
    try {
        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName Containers -All -NoRestart
        Write-Host "✅ Windows features enabled" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not enable Windows features. You may need to enable them manually." -ForegroundColor Yellow
    }
    
    # Download Docker Desktop installer
    $dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    
    Write-Host "⬇️  Downloading Docker Desktop..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath
        Write-Host "✅ Docker Desktop downloaded" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download Docker Desktop" -ForegroundColor Red
        Write-Host "Please download manually from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
        exit 1
    }
    
    # Install Docker Desktop
    Write-Host "🚀 Installing Docker Desktop..." -ForegroundColor Yellow
    try {
        Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet" -Wait
        Write-Host "✅ Docker Desktop installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Docker Desktop" -ForegroundColor Red
        Write-Host "Please run the installer manually: $installerPath" -ForegroundColor Yellow
        exit 1
    }
    
    # Clean up installer
    Remove-Item $installerPath -ErrorAction SilentlyContinue
    
    Write-Host "🔄 Docker Desktop installed. Please restart your computer and start Docker Desktop." -ForegroundColor Yellow
    Write-Host "After restart, run this script again to continue with the setup." -ForegroundColor Yellow
    
    $restart = Read-Host "Would you like to restart now? (y/N)"
    if ($restart -eq "y" -or $restart -eq "Y") {
        Restart-Computer -Force
    }
    exit 0
}

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📁 Working directory: $projectPath" -ForegroundColor Cyan

# Build the Docker image
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
try {
    docker build -t pms-dashboard .
    Write-Host "✅ Docker image built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Ask user if they want to run the container
$runContainer = Read-Host "Would you like to start the container now? (Y/n)"
if ($runContainer -ne "n" -and $runContainer -ne "N") {
    Write-Host "🚀 Starting PMS Dashboard container..." -ForegroundColor Yellow
    
    # Stop any existing container
    docker stop pms-dashboard 2>$null
    docker rm pms-dashboard 2>$null
    
    try {
        docker run -d --name pms-dashboard -p 3000:3000 --restart unless-stopped pms-dashboard
        Write-Host "✅ Container started successfully" -ForegroundColor Green
        Write-Host "🌐 Application available at: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "💡 Use 'docker logs pms-dashboard' to view logs" -ForegroundColor Yellow
        Write-Host "💡 Use 'docker stop pms-dashboard' to stop the container" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Failed to start container" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Docker setup complete!" -ForegroundColor Green
Write-Host "📖 See DOCKER.md for detailed usage instructions" -ForegroundColor Cyan