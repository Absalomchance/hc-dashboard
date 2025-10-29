@echo off
echo 🔒 Generating SSL certificates for development...

REM Create certs directory if it doesn't exist
if not exist "certs" mkdir certs

REM Check if OpenSSL is available
where openssl >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ OpenSSL not found. Please install OpenSSL or use WSL to run generate-certs.sh
    echo.
    echo Options:
    echo 1. Install OpenSSL for Windows from: https://slproweb.com/products/Win32OpenSSL.html
    echo 2. Use chocolatey: choco install openssl
    echo 3. Use Git Bash or WSL to run: bash generate-certs.sh
    pause
    exit /b 1
)

REM Generate private key
openssl genrsa -out ./certs/server.key 2048

REM Generate certificate with SAN extension
openssl req -new -x509 -key ./certs/server.key -out ./certs/server.crt -days 365 -config openssl.conf

echo ✅ SSL certificates generated successfully!
echo 📁 Certificate: ./certs/server.crt
echo 🔑 Private key: ./certs/server.key
echo.
echo ⚠️  These are self-signed certificates for development only.
echo    Your browser will show a security warning - this is normal.
echo    For production, use proper SSL certificates from a CA or Let's Encrypt.
pause