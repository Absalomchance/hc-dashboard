# 🚀 Render.com Deployment Guide for PMS Dashboard

## Overview
This guide will help you deploy the Performance Management System Dashboard to Render.com with a custom domain `pms.nsa.org.na`.

---

## 📋 Prerequisites

### 1. Render.com Account
- [ ] Create account at [render.com](https://render.com)
- [ ] Connect your GitHub account

### 2. GitHub Repository
- [ ] Push your project to GitHub
- [ ] Ensure all files are committed including `server.js`

### 3. Azure AD Configuration
- [ ] Note your Azure App Registration details
- [ ] Prepare to update redirect URIs

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Ensure Required Files
Make sure your repository has:
- [ ] `server.js` (Express server)
- [ ] `package.json` with "start" script
- [ ] `dist/` folder (or it will be built on Render)

### 1.2 Environment Variables
Your app uses:
- Azure configuration is in `src/config.js`
- No additional environment variables needed

---

## 🌐 Step 2: Deploy to Render

### 2.1 Create New Web Service
1. Login to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `pms-dashboard`
- **Runtime**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build & Deploy:**
- **Root Directory**: `.` (leave empty)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Node Version**: `18` (or latest LTS)
- **Health Check Path**: `/health`

### 2.2 Deploy
- [ ] Click **"Create Web Service"**
- [ ] Wait for initial deployment (5-10 minutes)
- [ ] Check deployment logs for any errors

---

## 🔗 Step 3: Custom Domain Setup

### 3.1 Add Custom Domain in Render
1. Go to your service dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter: `pms.nsa.org.na`
5. Render will provide DNS instructions

### 3.2 Update DNS Records
In your domain registrar (where `nsa.org.na` is managed):

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: pms
Value: [provided by Render]
TTL: 3600 (or default)
```

**Option B: A Record**
```
Type: A
Name: pms
Value: [IP provided by Render]
TTL: 3600 (or default)
```

### 3.3 SSL Certificate
- [ ] Render automatically provides SSL
- [ ] Wait for certificate provisioning (5-30 minutes)
- [ ] Verify HTTPS works at `https://pms.nsa.org.na`

---

## ⚙️ Step 4: Update Azure AD Configuration

### 4.1 Update Redirect URIs
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App Registrations**
3. Find your "PMS Dashboard" app
4. Go to **Authentication**
5. Update **Redirect URIs**:
   - [ ] Add: `https://pms.nsa.org.na`
   - [ ] Remove: `http://localhost:5173` (for security)
6. Update **Logout URL**: `https://pms.nsa.org.na`
7. **Save** changes

---

## 🧪 Step 5: Testing

### 5.1 Basic Functionality
- [ ] Visit `https://pms.nsa.org.na`
- [ ] Page loads without errors
- [ ] Check browser console (F12) for errors
- [ ] Verify NSA logo displays

### 5.2 Authentication Flow
- [ ] Click "Sign in with Microsoft"
- [ ] Redirects to Microsoft login
- [ ] Login with NSA credentials
- [ ] Successfully redirects back to dashboard

### 5.3 Data Connectivity
- [ ] Dashboard loads SharePoint data
- [ ] Charts and employee list populate
- [ ] Department filtering works

---

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Render Monitoring
- Monitor deployment logs
- Set up alerts for downtime
- Check performance metrics

### 6.2 Health Check
- Render will ping `/health` endpoint
- Monitor response times
- Set up notifications

---

## 🔧 Troubleshooting

### Common Issues:

**Build Failures:**
```bash
# Check build logs in Render dashboard
# Common fix: ensure all dependencies in package.json
npm install
npm run build
```

**Deployment Issues:**
- Check start command is `npm start`
- Verify `server.js` exists and is correct
- Check Node.js version compatibility

**Domain Issues:**
- Verify DNS propagation (can take 24-48 hours)
- Use DNS checker tools
- Ensure CNAME points to correct Render URL

**Authentication Issues:**
- Verify Azure redirect URI is updated
- Check console for MSAL errors
- Ensure HTTPS is working

**Performance Issues:**
- Monitor Render metrics
- Consider upgrading plan if needed
- Check for memory/CPU usage

---

## 💰 Render.com Pricing

### Free Tier:
- ✅ 750 hours/month
- ✅ Custom domains
- ✅ SSL certificates
- ⚠️ Spins down after 15 minutes of inactivity

### Starter ($7/month):
- ✅ Always on
- ✅ Custom domains & SSL
- ✅ Better performance

### Pro ($25/month):
- ✅ Higher performance
- ✅ More resources
- ✅ Priority support

---

## 🔄 CI/CD Pipeline

Render automatically:
- ✅ Builds on every git push
- ✅ Runs `npm install && npm run build`
- ✅ Starts with `npm start`
- ✅ Provides deployment previews

---

## 📋 Post-Deployment Checklist

- [ ] Application accessible at `https://pms.nsa.org.na`
- [ ] SSL certificate working
- [ ] Authentication flow working
- [ ] SharePoint data loading
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Error logging set up
- [ ] Team notified of new URL

---

## 📞 Support Resources

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **Azure Support**: [portal.azure.com](https://portal.azure.com)

---

## 🎉 Deployment Complete!

Your PMS Dashboard is now live at:
**https://pms.nsa.org.na**

The application will automatically rebuild and redeploy whenever you push changes to your GitHub repository.