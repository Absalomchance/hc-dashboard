import { useState } from 'react'
import './ConfigurationGuide.css'

function ConfigurationGuide() {
  const [step, setStep] = useState(1)
  const [clientId, setClientId] = useState('')
  const [tenantId, setTenantId] = useState('')

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy. Please copy manually.'))
  }

  const generateConfigCode = () => {
    return `// Azure AD Configuration
azure: {
  clientId: '${clientId}',
  tenantId: '${tenantId}',
  authority: 'https://login.microsoftonline.com/${tenantId}',
  redirectUri: window.location.origin,
},`
  }

  return (
    <div className="config-guide">
      <div className="config-container">
        <div className="config-header">
          <h1>🔧 PMS Dashboard Setup</h1>
          <p>Configure Azure AD to connect your dashboard</p>
          <div className="step-indicator">
            Step {step} of 4
          </div>
        </div>

        <div className="config-content">
          {step === 1 && (
            <div className="step-content">
              <h2>Step 1: Create Azure AD App Registration</h2>
              <div className="instruction-box">
                <h3>📋 Follow these steps:</h3>
                <ol>
                  <li>Go to <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer">Azure Portal</a></li>
                  <li>Search for "Azure Active Directory"</li>
                  <li>Click <strong>App registrations</strong> → <strong>+ New registration</strong></li>
                  <li>Fill in the form:
                    <ul>
                      <li><strong>Name:</strong> PMS Dashboard</li>
                      <li><strong>Account types:</strong> Single tenant</li>
                      <li><strong>Redirect URI:</strong> Single-page application (SPA)</li>
                      <li><strong>URI:</strong> <code>http://localhost:5174</code></li>
                    </ul>
                  </li>
                  <li>Click <strong>Register</strong></li>
                </ol>
              </div>
              <div className="step-actions">
                <button onClick={handleNext} className="next-btn">
                  I've created the app registration →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Step 2: Configure API Permissions</h2>
              <div className="instruction-box">
                <h3>🔑 Add these permissions:</h3>
                <ol>
                  <li>In your app registration, click <strong>API permissions</strong></li>
                  <li>Click <strong>+ Add a permission</strong> → <strong>Microsoft Graph</strong></li>
                  <li>Select <strong>Delegated permissions</strong> and add:
                    <ul>
                      <li>✅ User.Read</li>
                      <li>✅ Sites.Read.All</li>
                      <li>✅ Directory.Read.All</li>
                      <li>✅ User.ReadBasic.All</li>
                    </ul>
                  </li>
                  <li>Click <strong>Grant admin consent</strong> and confirm</li>
                </ol>
              </div>
              <div className="step-actions">
                <button onClick={handlePrevious} className="prev-btn">
                  ← Previous
                </button>
                <button onClick={handleNext} className="next-btn">
                  Permissions configured →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Step 3: Get Configuration Values</h2>
              <div className="instruction-box">
                <h3>📝 Copy these values from Azure Portal:</h3>
                <p>Go to your app registration's <strong>Overview</strong> page and copy:</p>
                
                <div className="input-group">
                  <label>Application (client) ID:</label>
                  <input
                    type="text"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="config-input"
                  />
                </div>
                
                <div className="input-group">
                  <label>Directory (tenant) ID:</label>
                  <input
                    type="text"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="config-input"
                  />
                </div>
              </div>
              <div className="step-actions">
                <button onClick={handlePrevious} className="prev-btn">
                  ← Previous
                </button>
                <button 
                  onClick={handleNext} 
                  className="next-btn"
                  disabled={!clientId || !tenantId}
                >
                  Generate configuration →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2>Step 4: Update Configuration</h2>
              <div className="instruction-box">
                <h3>🔧 Update your configuration file:</h3>
                <p>Replace the Azure configuration in <code>src/config.js</code> with:</p>
                
                <div className="code-block">
                  <pre>{generateConfigCode()}</pre>
                  <button 
                    onClick={() => copyToClipboard(generateConfigCode())}
                    className="copy-btn"
                  >
                    📋 Copy
                  </button>
                </div>
                
                <div className="final-steps">
                  <h4>Final steps:</h4>
                  <ol>
                    <li>Open <code>src/config.js</code> in your editor</li>
                    <li>Replace the Azure configuration section</li>
                    <li>Save the file</li>
                    <li>The page will automatically reload with authentication enabled</li>
                  </ol>
                </div>
              </div>
              <div className="step-actions">
                <button onClick={handlePrevious} className="prev-btn">
                  ← Previous
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="finish-btn"
                >
                  🔄 Reload Application
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="config-footer">
          <p>Need help? Check the <strong>AZURE_SETUP_GUIDE.md</strong> file for detailed instructions.</p>
        </div>
      </div>
    </div>
  )
}

export default ConfigurationGuide