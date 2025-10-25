#!/bin/bash

# Production Build Script for PMS Dashboard
# This script prepares the application for deployment to cPanel

echo "🚀 Building PMS Dashboard for Production Deployment"
echo "=================================================="

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
if [ -d "dist" ]; then
    rm -rf dist
    echo "   ✅ Removed old dist folder"
fi

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "   ✅ Dependencies installed successfully"
else
    echo "   ❌ Failed to install dependencies"
    exit 1
fi

# Step 3: Build for production
echo "🏗️  Building for production..."
npm run build
if [ $? -eq 0 ]; then
    echo "   ✅ Production build completed"
else
    echo "   ❌ Build failed"
    exit 1
fi

# Step 4: Copy additional files to dist
echo "📁 Copying additional files..."
cp public/.htaccess dist/.htaccess 2>/dev/null || echo "   ⚠️  .htaccess not found in public folder"
cp public/nsa.png dist/nsa.png 2>/dev/null || echo "   ⚠️  nsa.png not found in public folder"

# Step 5: Create deployment package
echo "📦 Creating deployment package..."
cd dist
zip -r ../pms-dashboard-production.zip . 2>/dev/null || tar -czf ../pms-dashboard-production.tar.gz . 2>/dev/null
cd ..

if [ -f "pms-dashboard-production.zip" ]; then
    echo "   ✅ Created pms-dashboard-production.zip"
elif [ -f "pms-dashboard-production.tar.gz" ]; then
    echo "   ✅ Created pms-dashboard-production.tar.gz"
else
    echo "   ⚠️  Could not create deployment package, but files are ready in dist/"
fi

# Step 6: Show deployment instructions
echo ""
echo "🎉 Build Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Create subdomain 'pms' for domain 'nsa.org.na' in cPanel"
echo "2. Upload all files from 'dist/' folder to /public_html/pms/"
echo "3. Update Azure AD App Registration redirect URI to: https://pms.nsa.org.na"
echo "4. Enable SSL certificate for pms.nsa.org.na"
echo "5. Test the application at https://pms.nsa.org.na"
echo ""
echo "📁 Files ready for upload in: ./dist/"
echo "📦 Deployment package: ./pms-dashboard-production.zip"
echo ""
echo "🔧 Troubleshooting:"
echo "- If you see a blank page, check browser console for errors"
echo "- Ensure .htaccess file is uploaded to enable React Router"
echo "- Verify Azure AD redirect URI is updated"
echo ""