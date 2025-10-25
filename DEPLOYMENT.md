# Deployment Guide: Performance Management System Dashboard

## 🎯 Deploying to cPanel with Subdomain `pms.nsa.org.na`

### Prerequisites
- cPanel hosting account with Node.js support
- Domain `nsa.org.na` pointed to your hosting account
- SSH access (optional but recommended)

---

## 📋 Step 1: Prepare Application for Production

### 1.1 Update Configuration for Production
Edit `src/config.js` to ensure production settings:

```javascript
const msalConfig = {
  auth: {
    clientId: '672b5001-d928-45d2-a215-eed927ec6643',
    authority: 'https://login.microsoftonline.com/8d5664e4-f94a-4f3b-a9eb-da674717443b',
    redirectUri: 'https://pms.nsa.org.na/hc-dashboard', // Update this to production URL
    postLogoutRedirectUri: 'https://pms.nsa.org.na/hc-dashboard'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  }
}
```

### 1.2 Update Azure AD App Registration
1. Go to Azure Portal → Azure Active Directory → App Registrations
2. Find your app: "PMS Dashboard"
3. Update **Redirect URIs**:
   - Add: `https://pms.nsa.org.na`
   - Remove: `http://localhost:5173` (for security)
4. Update **Logout URL**: `https://pms.nsa.org.na/hc-dashboard`

---

## 🏗️ Step 2: Build Application for Production

### 2.1 Install Dependencies and Build
```bash
# Install dependencies
npm install

# Create production build
npm run build
```

This creates a `dist/` folder with optimized production files.

### 2.2 Update Index.html Title and Meta
Edit `index.html` before building:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/nsa.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Performance Management System - NSA Organizational Dashboard" />
    <title>Performance Management System - NSA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🌐 Step 3: cPanel Subdomain Setup

### 3.1 Create Subdomain in cPanel
1. Login to your cPanel
2. Go to **Subdomains** section
3. Create new subdomain:
   - **Subdomain**: `pms`
   - **Domain**: `nsa.org.na`
   - **Document Root**: `/hc-dashboard` (or custom path)
4. Click **Create**

### 3.2 Node.js Application Setup (if supported)
If your cPanel supports Node.js:
1. Go to **Node.js Selector** in cPanel
2. **Create Application**:
   - **Node.js Version**: 18.x or latest
   - **Application Root**: `/hc-dashboard`
   - **Application URL**: `pms.nsa.org.na/hc-dashboard`
   - **Application Startup File**: `server.js`

---

## 📁 Step 4: Upload Files to cPanel

### 4.1 Option A: File Manager Upload
1. In cPanel → **File Manager**
2. Navigate to `/hc-dashboard`
3. Upload entire `dist/` folder contents
4. Extract/unzip if uploaded as archive

### 4.2 Option B: FTP Upload
```bash
# Using FileZilla or similar FTP client
# Upload dist/ folder contents to:
# /public_html/pms/
```

### 4.3 File Structure on Server
```
/hc-dashboard/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── nsa.png
└── vite.svg
```

---

## ⚙️ Step 5: Server Configuration

### 5.1 Create .htaccess for SPA Routing
Create `/hc-dashboard/.htaccess`:
```apache
# React Router SPA Support
RewriteEngine On
RewriteBase /

# Handle Angular/React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# HTTPS Redirect (recommended)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### 5.2 MIME Type Configuration
Add to `.htaccess` if needed:
```apache
# Ensure proper MIME types
AddType application/javascript .js
AddType text/css .css
AddType image/png .png
```

---

## 🔒 Step 6: Security and Performance

### 6.1 SSL Certificate
1. In cPanel → **SSL/TLS**
2. Enable **Let's Encrypt** for `pms.nsa.org.na/hc-dashboard`
3. Force HTTPS redirect

### 6.2 Environment Variables
Since this is a client-side app, ensure no sensitive data is exposed:
- Azure credentials are already configured in build
- SharePoint permissions are handled via Microsoft Graph

---

## 🧪 Step 7: Testing Deployment

### 7.1 Basic Functionality Test
1. Visit `https://pms.nsa.org.na/hc-dashboard`
2. Check console for errors (F12)
3. Test Microsoft login flow
4. Verify SharePoint data connection
5. Test on mobile devices

### 7.2 Performance Testing
- Check loading speed
- Verify assets are compressed
- Test on different browsers

---

## 📱 Step 8: Alternative Deployment Methods

### 8.1 Static Site Hosting
If Node.js isn't available, treat as static site:
1. Upload `dist/` contents to subdomain folder
2. Configure `.htaccess` for SPA routing
3. Ensure HTTPS is enabled

### 8.2 CDN Integration (Optional)
Consider using Cloudflare for:
- Better performance
- Additional security
- Analytics

---

## 🔧 Troubleshooting

### Common Issues:
1. **Blank Page**: Check console errors, verify paths in index.html
2. **Login Issues**: Verify Azure AD redirect URIs
3. **Routing Problems**: Ensure `.htaccess` is properly configured
4. **CORS Errors**: Check Azure and SharePoint permissions

### Debug Steps:
1. Check browser console (F12)
2. Verify network requests
3. Test Azure login separately
4. Check cPanel error logs

---

## 📋 Deployment Checklist

- [ ] Update production URLs in config
- [ ] Update Azure AD app registration
- [ ] Build production version (`npm run build`)
- [ ] Create subdomain in cPanel
- [ ] Upload dist/ files to server
- [ ] Configure .htaccess
- [ ] Enable SSL certificate
- [ ] Test login functionality
- [ ] Test SharePoint connectivity
- [ ] Verify mobile responsiveness
- [ ] Check performance metrics

---

## 🔄 Future Updates

To update the application:
1. Make changes locally
2. Run `npm run build`
3. Upload new `dist/` contents
4. Clear browser cache if needed

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Azure AD configuration
3. Test SharePoint permissions
4. Contact hosting provider for server-specific issues