// Configuration Test Helper
// This file helps validate your Azure AD and SharePoint setup

export const validateConfiguration = (config) => {
  const errors = []
  const warnings = []

  // Check Azure AD configuration
  if (!config.azure.clientId || config.azure.clientId === 'YOUR_CLIENT_ID') {
    errors.push('Azure Client ID is not configured. Please update src/config.js')
  }

  if (!config.azure.tenantId || config.azure.tenantId === 'YOUR_TENANT_ID') {
    errors.push('Azure Tenant ID is not configured. Please update src/config.js')
  }

  // Validate GUID format
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (config.azure.clientId !== 'YOUR_CLIENT_ID' && !guidRegex.test(config.azure.clientId)) {
    errors.push('Azure Client ID format is invalid. Should be a GUID format.')
  }

  if (config.azure.tenantId !== 'YOUR_TENANT_ID' && !guidRegex.test(config.azure.tenantId)) {
    errors.push('Azure Tenant ID format is invalid. Should be a GUID format.')
  }

  // Check SharePoint configuration
  if (!config.sharepoint.siteUrl) {
    warnings.push('SharePoint site URL should be configured for production use')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      azureConfigured: config.azure.clientId !== 'YOUR_CLIENT_ID' && config.azure.tenantId !== 'YOUR_TENANT_ID',
      sharepointConfigured: !!config.sharepoint.siteUrl,
      totalIssues: errors.length + warnings.length
    }
  }
}

export const getConfigurationStatus = (config) => {
  const validation = validateConfiguration(config)
  
  console.group('🔧 PMS Dashboard Configuration Status')
  
  if (validation.isValid) {
    console.log('✅ Configuration is valid!')
  } else {
    console.log('❌ Configuration has issues:')
  }
  
  validation.errors.forEach(error => {
    console.error('❌', error)
  })
  
  validation.warnings.forEach(warning => {
    console.warn('⚠️', warning)
  })
  
  console.log('\n📊 Summary:')
  console.log(`Azure AD: ${validation.summary.azureConfigured ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`SharePoint: ${validation.summary.sharepointConfigured ? '✅ Configured' : '⚠️ Using default'}`)
  
  console.groupEnd()
  
  return validation
}

// Test network connectivity to Microsoft services
export const testConnectivity = async () => {
  console.group('🌐 Testing Connectivity')
  
  const endpoints = [
    { name: 'Microsoft Graph', url: 'https://graph.microsoft.com/v1.0/$metadata' },
    { name: 'Azure AD', url: 'https://login.microsoftonline.com/common/discovery/instance?authorization_endpoint=https://login.microsoftonline.com/common/oauth2/authorize&api-version=1.1' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { method: 'HEAD' })
      console.log(`✅ ${endpoint.name}: ${response.status === 200 ? 'Connected' : 'Available'}`)
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Connection failed - ${error.message}`)
    }
  }
  
  console.groupEnd()
}

export default {
  validateConfiguration,
  getConfigurationStatus,
  testConnectivity
}