# Azure AD Configuration Guide for PMS Dashboard

## Step 1: Create Azure AD App Registration

### 1.1 Access Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your organizational account (the same one that has access to SharePoint)
3. Search for "Azure Active Directory" in the top search bar

### 1.2 Create New App Registration
1. In Azure AD, click **App registrations** in the left menu
2. Click **+ New registration**
3. Fill in the registration form:
   - **Name**: `PMS Dashboard`
   - **Supported account types**: Select `Accounts in this organizational directory only (Single tenant)`
   - **Redirect URI**: 
     - Platform: `Single-page application (SPA)`
     - URI: `http://localhost:5174`

4. Click **Register**

### 1.3 Note Down Important IDs
After registration, you'll see the **Overview** page. Copy these values:
- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Step 2: Configure API Permissions

### 2.1 Add Microsoft Graph Permissions
1. In your app registration, click **API permissions** in the left menu
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Search and add these permissions:
   - `User.Read` (should already be added)
   - `Sites.Read.All`
   - `Directory.Read.All`
   - `User.ReadBasic.All`

### 2.2 Grant Admin Consent
1. After adding permissions, click **Grant admin consent for [Your Organization]**
2. Click **Yes** to confirm
3. Verify all permissions show "Granted for [Your Organization]"

## Step 3: Configure Authentication Settings

### 3.1 Add Production Redirect URI
1. Click **Authentication** in the left menu
2. Under **Single-page application**, click **+ Add URI**
3. Add your production URL (e.g., `https://yourdomain.com`)
4. Check these boxes under **Implicit grant and hybrid flows**:
   - ✅ Access tokens (used for implicit flows)
   - ✅ ID tokens (used for implicit and hybrid flows)

### 3.2 Configure Advanced Settings
1. Under **Advanced settings**:
   - **Allow public client flows**: No
   - **Enable the following mobile and desktop flows**: No

## Step 4: Update Your Application Configuration

Copy the values from Step 1.3 and proceed to update your configuration file.

## Step 5: Test SharePoint Access

Your SharePoint list should have these columns:
- **Title** (default)
- **ApprovalStatus** (Choice): Values like "Approved", "In Progress", "Pending Review", "Not Started"
- **Created By** (Person/Group): Auto-populated
- **Created** (Date Time): Auto-populated

## Troubleshooting

### Common Issues:
1. **"AADSTS50011: No reply address is registered"**
   - Solution: Add the correct redirect URI in Authentication settings

2. **"Insufficient privileges to complete the operation"**
   - Solution: Ensure admin consent is granted for all permissions

3. **"Access denied"**
   - Solution: Check that your account has access to the SharePoint site

### SharePoint List Permissions:
- Ensure your account has at least **Read** permissions to the SharePoint list
- The app will access the list using your logged-in user's permissions

## Ready to Configure?

Once you have your Client ID and Tenant ID from the Azure portal, I'll update your configuration file automatically.