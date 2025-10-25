# 🚀 cPanel Deployment Checklist for pms.nsa.org.na

## Pre-Deployment Setup

### 1. Azure AD Configuration ⚙️
- [ ] Login to Azure Portal
- [ ] Navigate to Azure Active Directory → App Registrations  
- [ ] Find "PMS Dashboard" application
- [ ] Update **Authentication** → **Redirect URIs**:
  - [ ] Add: `https://pms.nsa.org.na`
  - [ ] Remove: `http://localhost:5173` (for security)
- [ ] Update **Logout URL**: `https://pms.nsa.org.na`
- [ ] Save changes

### 2. Build Application 🏗️
- [ ] Open terminal in project directory
- [ ] Run: `npm install` (ensure all dependencies)
- [ ] Run: `npm run build` (creates dist/ folder)
- [ ] Verify dist/ folder contains:
  - [ ] index.html
  - [ ] assets/ folder
  - [ ] nsa.png (favicon)
  - [ ] .htaccess file

## cPanel Setup

### 3. Create Subdomain 🌐
- [ ] Login to cPanel
- [ ] Go to **Subdomains** section
- [ ] Create new subdomain:
  - **Subdomain**: `pms`
  - **Domain**: `nsa.org.na`  
  - **Document Root**: `/public_html/pms`
- [ ] Click **Create**
- [ ] Wait for DNS propagation (5-30 minutes)

### 4. Upload Files 📁
Choose one method:

**Option A: File Manager**
- [ ] cPanel → **File Manager**
- [ ] Navigate to `/public_html/pms/`
- [ ] Upload `pms-dashboard-production.zip`
- [ ] Extract ZIP file
- [ ] Verify all files are in `/public_html/pms/` (not in subfolder)

**Option B: FTP Client**
- [ ] Connect via FTP to your hosting
- [ ] Navigate to `/public_html/pms/`
- [ ] Upload all contents from `dist/` folder
- [ ] Ensure `.htaccess` file is uploaded

### 5. SSL Certificate 🔒
- [ ] cPanel → **SSL/TLS**
- [ ] **Let's Encrypt** section
- [ ] Add certificate for `pms.nsa.org.na`
- [ ] Enable **Force HTTPS Redirect**

### 6. File Permissions 🔧
- [ ] Set folder permissions to `755`
- [ ] Set file permissions to `644`
- [ ] Ensure `.htaccess` permissions are `644`

## Testing & Verification

### 7. Basic Functionality ✅
- [ ] Visit `https://pms.nsa.org.na`
- [ ] Page loads without errors
- [ ] NSA logo displays correctly
- [ ] No console errors (F12 → Console)

### 8. Authentication Flow 🔐
- [ ] Click "Sign in with Microsoft"
- [ ] Redirects to Microsoft login
- [ ] Login with NSA credentials
- [ ] Successfully redirects back to dashboard
- [ ] User welcome message displays

### 9. Data Connectivity 📊
- [ ] Dashboard loads SharePoint data
- [ ] Performance charts display
- [ ] Employee list populates
- [ ] Department filtering works
- [ ] No API errors in console

### 10. Cross-Browser Testing 🌐
- [ ] Test in Chrome
- [ ] Test in Firefox  
- [ ] Test in Edge
- [ ] Test in Safari (if available)
- [ ] Test on mobile devices

### 11. Performance Check ⚡
- [ ] Page loads within 3 seconds
- [ ] Images load properly
- [ ] No broken links
- [ ] Responsive design works

## Troubleshooting Guide

### Common Issues & Solutions:

**Blank Page**
- Check browser console for errors
- Verify all files uploaded correctly
- Ensure `.htaccess` file is present

**Login Issues**
- Verify Azure redirect URI: `https://pms.nsa.org.na`
- Check Azure app permissions
- Clear browser cache

**Permission Errors**
- Verify SharePoint site access
- Check Microsoft Graph API permissions
- Ensure user has proper AD roles

**Routing Issues**
- Confirm `.htaccess` file uploaded
- Check mod_rewrite is enabled
- Verify RewriteEngine is On

**SSL Problems**
- Install SSL certificate
- Enable HTTPS redirect
- Update all URLs to use HTTPS

## Post-Deployment

### 12. Documentation 📚
- [ ] Update internal documentation
- [ ] Share access instructions with team
- [ ] Document any custom configurations

### 13. Monitoring 📈
- [ ] Set up uptime monitoring
- [ ] Monitor error logs
- [ ] Track user adoption
- [ ] Monitor performance metrics

### 14. Backup Strategy 💾
- [ ] Backup application files
- [ ] Document deployment process
- [ ] Save Azure configuration details

## Contact Information

**Technical Support:**
- Hosting Provider: [Your cPanel provider]
- Azure Administrator: [Contact details]
- Application Developer: [Your contact]

**URLs:**
- Production: https://pms.nsa.org.na
- Azure Portal: https://portal.azure.com
- SharePoint Site: https://nsaorgna.sharepoint.com/sites/BISTeam

---

✅ **Deployment Complete!** 

Your Performance Management System is now live at `https://pms.nsa.org.na`