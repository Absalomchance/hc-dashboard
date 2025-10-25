import { useMsal } from '@azure/msal-react'
import nsaLogo from '../assets/nsa.png'
import './Login.css'

function Login() {
  const { instance } = useMsal()

  const handleLogin = async () => {
    try {
      await instance.loginRedirect({
        scopes: ['User.Read', 'Sites.Read.All', 'Directory.Read.All']
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={nsaLogo} alt="NSA Logo" className="login-logo" />
          <h2>Performance Management System</h2>
          <p>Organizational Performance Dashboard</p>
        </div>
        <div className="login-description">
          <h3>Welcome to the PMS Dashboard</h3>
          <p>This dashboard provides real-time insights into:</p>
          <ul>
            <li>Performance agreement completion status</li>
            <li>Employee progress tracking</li>
            <li>Department-wide analytics</li>
            <li>Active Directory integration</li>
          </ul>
        </div>
        <button onClick={handleLogin} className="login-btn">
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}

export default Login