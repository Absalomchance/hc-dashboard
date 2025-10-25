# PMS Dashboard Setup Instructions

## Azure AD App Registration Setup

Before running the application, you need to create an Azure AD App Registration:

### 1. Create App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: `PMS Dashboard`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: 
     - Platform: `Single-page application (SPA)`
     - URI: `http://localhost:5173` (for development) and your production URL

### 2. Configure API Permissions
1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add these permissions:
   - `User.Read`
   - `Sites.Read.All`
   - `Directory.Read.All`
   - `User.ReadBasic.All`
6. Click **Grant admin consent**

### 3. Get Configuration Values
1. Go to **Overview** tab in your app registration
2. Copy the **Application (client) ID**
3. Copy the **Directory (tenant) ID**

### 4. Update Configuration
1. Open `src/config.js`
2. Replace `YOUR_CLIENT_ID` with your Application (client) ID
3. Replace `YOUR_TENANT_ID` with your Directory (tenant) ID

## SharePoint List Setup

### 1. Get SharePoint Site and List Information
The dashboard connects to: `https://nsaorgna.sharepoint.com/sites/BISTeam/Lists/Absalom%20Fanuel%20Performance/`

### 2. Required List Columns
Ensure your SharePoint list has these columns:
- **ApprovalStatus** (Choice): Status values like "Approved", "In Progress", "Pending Review"
- **Created By** (Person): Automatically tracks who created each record
- **Created** (Date): Automatically tracks creation date

## Installation and Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to cPanel
1. Run `npm run build`
2. Upload the contents of the `dist` folder to your cPanel public_html directory
3. Update the redirect URI in Azure to point to your production domain

## Features

- **Real-time Dashboard**: Visualizes performance agreement progress
- **Azure AD Integration**: Secure authentication with organizational accounts
- **SharePoint Integration**: Connects to your performance management list
- **Interactive Charts**: Pie charts and bar charts for data visualization
- **Employee Tracking**: Shows individual employee progress and status
- **Responsive Design**: Works on desktop and mobile devices
- **Department Analytics**: Compares completed vs. incomplete agreements

## Troubleshooting

### Common Issues
1. **Authentication fails**: Check your client ID and tenant ID in config.js
2. **No data showing**: Verify SharePoint permissions and list structure
3. **CORS errors**: Ensure redirect URIs are correctly configured in Azure

### Support
For technical support, check the browser console for error messages and verify:
- Azure AD app registration configuration
- SharePoint list permissions
- Network connectivity to Microsoft Graph API