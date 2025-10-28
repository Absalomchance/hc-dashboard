import { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import LoadingSpinner from './LoadingSpinner'
import nsaLogo from '../assets/nsa.png'
import './Login.css'
import { config } from '../config'

function Login() {
  const { instance } = useMsal()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      const loginRequest = {
        scopes: config.scopes,
        prompt: 'select_account',
        redirectStartPage: window.location.href
      };

      console.log('Initiating login request with config:', loginRequest);
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggingIn(false);
    }
  }

  if (isLoggingIn) {
    return <LoadingSpinner message="Connecting to Microsoft services..." />;
  }

  return (
    <div className="login-container">
      <div className="login-split">
        <div className="login-left">
          <div className="login-card">
            <div className="login-header">
              <img src={nsaLogo} alt="NSA Logo" className="login-logo" />
            </div>
            <div className="login-content">
              <h1>Performance Management System</h1>
              <p className="welcome-text">Welcome to your Dashboard</p>
              <div className="feature-list">
                <ul>
                  <li>Performance agreement completion status</li>
                  <li>Employee progress tracking</li>
                  <li>Department-wide analytics</li>
                  <li>Active Directory integration</li>
                </ul>
              </div>
            </div>
            <button
          onClick={handleLogin} 
          className="login-btn"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing in...' : 'Sign in with Microsoft'}
        </button>
          </div>
        </div>
        <div className="login-right">
          <img src="/front.jpg" alt="Dashboard Preview" className="login-hero-image" />
        </div>
      </div>
      <footer className="login-footer">
        <p>© 2025 Namibia Statistics Agency - PMS Monitoring Dashboard. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Login