import { useMsal } from '@azure/msal-react'
import nsaLogo from '../assets/nsa.png'
import './Header.css'

function Header() {
  const { accounts, instance } = useMsal()
  const account = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    })
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <img src={nsaLogo} alt="NSA Logo" className="logo-image" />
            <div className="header-text">
              <h1>Performance Management Dashboard</h1>
              <p>Real-time organizational performance insights</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          {account && (
            <div className="user-info">
              <span>Welcome, {account.name || account.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header