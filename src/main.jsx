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
    redirectUri: config.azure.redirectUri,
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
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
async function initializeMsal() {
  if (isConfigured) {
    const instance = new PublicClientApplication(msalConfig);
    await instance.initialize();
    return instance;
  }
  console.warn('🔧 Azure AD not configured. Please update src/config.js with your Client ID and Tenant ID.');
  console.warn('📖 See AZURE_SETUP_GUIDE.md for detailed setup instructions.');
  return null;
}

// Initialize MSAL before rendering
initializeMsal().then(msalInstance => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      {msalInstance ? (
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      ) : (
        <App />
      )}
    </StrictMode>
  );
});
