import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './App.jsx'
import config, { isConfigured } from './config.js'

// MSAL configuration for Azure AD authentication
const msalConfig = {
  auth: {
    clientId: config.azure.clientId,
    authority: config.azure.authority,
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  },
  system: {
    allowRedirectInIframe: true,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log('[MSAL]', message);
      },
      logLevel: "Verbose",
      piiLoggingEnabled: false
    }
  }
}

// Only initialize MSAL if properly configured
let msalInstance = null

if (isConfigured) {
  msalInstance = new PublicClientApplication(msalConfig)
} else {
  console.warn('🔧 Azure AD not configured. Please update src/config.js with your Client ID and Tenant ID.')
  console.warn('📖 See AZURE_SETUP_GUIDE.md for detailed setup instructions.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {msalInstance ? (
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
