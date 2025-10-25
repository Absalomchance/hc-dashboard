// Configuration file for PMS Dashboard
// Update these values with your actual Azure and SharePoint details

// 🔧 CONFIGURATION REQUIRED:
// 1. Replace YOUR_CLIENT_ID with your Azure App Registration client ID
// 2. Replace YOUR_TENANT_ID with your Azure AD tenant ID
// 3. See AZURE_SETUP_GUIDE.md for detailed setup instructions

export const config = {
  // Azure AD Configuration
  azure: {
    clientId: '672b5001-d928-45d2-a215-eed927ec6643',
    tenantId: '8d5664e4-f94a-4f3b-a9eb-da674717443b',
    authority: 'https://login.microsoftonline.com/8d5664e4-f94a-4f3b-a9eb-da674717443b',
    redirectUri: window.location.origin,
  },

  // SharePoint Configuration
  sharepoint: {
    siteUrl: 'https://nsaorgna.sharepoint.com/sites/BISTeam',
    listName: 'Absalom Fanuel Performance',
    // These will be determined programmatically, but you can set them if known
    siteId: null,
    listId: null,
  },

  // Microsoft Graph API Scopes
  scopes: [
    'User.Read',
    'Sites.Read.All',
    'Directory.Read.All',
    'User.ReadBasic.All'
  ],

  // Application Settings
  app: {
    name: 'Performance Management Dashboard',
    department: 'Human Capital',
    refreshInterval: 300000, // 5 minutes in milliseconds
    isDevelopment: import.meta.env.DEV,
    useMockData: false, // Set to true for testing without Azure AD
  }
}

// Auto-update authority URL when tenant ID is configured
if (config.azure.tenantId && config.azure.tenantId !== 'YOUR_TENANT_ID') {
  config.azure.authority = `https://login.microsoftonline.com/${config.azure.tenantId}`
}

// Development mode helpers
export const isDevelopment = config.app.isDevelopment
export const isConfigured = config.azure.clientId !== 'YOUR_CLIENT_ID' && config.azure.tenantId !== 'YOUR_TENANT_ID'

// Validate configuration on import
if (isDevelopment) {
  import('./utils/configValidator.js').then(({ getConfigurationStatus }) => {
    getConfigurationStatus(config)
  }).catch(() => {
    console.log('⚠️ Configuration validator not available')
  })
}

export default config