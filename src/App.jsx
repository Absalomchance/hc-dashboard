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
  
  const { instance, accounts, inProgress } = useMsal()
  
  try {
    if (isConfigured) {

      // Handle initial authentication check and redirect
      useEffect(() => {
        const handleAuth = async () => {
          if (!instance) return;
          
          try {
            setIsLoading(true);
            const result = await instance.handleRedirectPromise();
            
            if (result) {
              // We have a successful authentication result
              setIsAuthenticated(true);
              return;
            }
            
            // No redirect result, check if user is already signed in
            const currentAccounts = instance.getAllAccounts();
            if (currentAccounts.length > 0) {
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Authentication error:", error);
            setIsAuthenticated(false);
          } finally {
            setIsLoading(false);
          }
        };

        handleAuth();
      }, [instance]);

      // Monitor account changes
      useEffect(() => {
        if (accounts.length > 0) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }, [accounts]);
    }
  } catch (error) {
    console.log('MSAL not available, running in demo mode')
    setIsLoading(false);
  }



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
