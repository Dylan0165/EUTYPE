import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { checkAuth } from './api/auth'
import FilePicker from './components/FilePicker'
import EditorPage from './components/EditorPage'
import './App.css'

// SSO Auth Provider Component
function SSOAuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null
  })

  useEffect(() => {
    // Check authentication status on mount
    const verifyAuth = async () => {
      try {
        const user = await checkAuth()
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user
        })
      } catch (error) {
        // 401 response triggers redirect in apiClient interceptor
        // Dit wordt alleen bereikt als redirect faalt of andere error
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null
        })
      }
    }

    verifyAuth()
  }, [])

  // Show loading state
  if (authState.isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>☁️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>EUTYPE</h2>
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render app
  return children
}

function App() {
  return (
    <Router>
      <SSOAuthProvider>
        <Routes>
          {/* All routes zijn nu protected via SSO */}
          <Route path="/" element={<FilePicker />} />
          <Route path="/editor" element={<EditorPage />} />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SSOAuthProvider>
    </Router>
  )
}

export default App
