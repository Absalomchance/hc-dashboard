import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Header from './components/Header'
import ConfigurationGuide from './components/ConfigurationGuide'
import { isConfigured } from './config.js'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Only use MSAL hooks if configured
  let accounts = []
  let inProgress = 'none'
  
  try {
    if (isConfigured) {
      const msalResult = useMsal()
      accounts = msalResult.accounts
      inProgress = msalResult.inProgress
    }
  } catch (error) {
    console.log('MSAL not available, running in demo mode')
  }

  useEffect(() => {
    setIsAuthenticated(accounts.length > 0)
  }, [accounts])

  // Show configuration guide if not configured
  if (!isConfigured) {
    return <ConfigurationGuide />
  }

  if (inProgress === 'startup') {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Login />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Login />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
