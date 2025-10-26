import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ConfigurationGuide from './components/ConfigurationGuide'
import LoadingSpinner from './components/LoadingSpinner'
import { isConfigured } from './config.js'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Only use MSAL hooks if configured
  let accounts = []
  let inProgress = 'none'
  
  try {
    if (isConfigured) {
      const { instance, accounts: msalAccounts, inProgress: msalInProgress } = useMsal()
      accounts = msalAccounts
      inProgress = msalInProgress

      // Handle the redirect promise on component mount
      useEffect(() => {
        instance
          .handleRedirectPromise()
          .then((response) => {
            if (response) {
              console.log("Successfully authenticated");
              setIsAuthenticated(true);
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            setIsAuthenticated(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, [instance]);

      // Check if user is already logged in
      useEffect(() => {
        const currentAccounts = instance.getAllAccounts();
        if (currentAccounts.length > 0) {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }, [instance]);
    }
  } catch (error) {
    console.log('MSAL not available, running in demo mode')
    setIsLoading(false);
  }

  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [accounts])

  // Show configuration guide if not configured
  if (!isConfigured) {
    return <ConfigurationGuide />
  }

  if (inProgress === 'startup' || isLoading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  if (inProgress === 'login') {
    return <LoadingSpinner message="Signing you in securely..." />;
  }

  if (inProgress !== 'none') {
    return <LoadingSpinner message="Please wait..." />;
  }

  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
