import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const API_BASE_URL = 'http://192.168.124.50:30500/api'
const SSO_LOGIN_URL = 'http://192.168.124.50:30090/login'

/**
 * SSO Session Validator
 * Controleert of gebruiker is ingelogd VOORDAT de React app mount
 */
async function validateSSOSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      credentials: 'include', // Stuurt eusuite_token cookie mee
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // Sessie niet geldig - redirect naar centrale login
      const currentUrl = window.location.href
      window.location.href = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`
      return null
    }

    // Sessie geldig - return user data
    return await response.json()
  } catch (error) {
    console.error('SSO validation failed:', error)
    // Bij netwerk errors ook naar login
    const currentUrl = window.location.href
    window.location.href = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`
    return null
  }
}

/**
 * Initialize app met SSO check
 */
async function initApp() {
  // Validate SSO session FIRST - geen UI tonen
  const user = await validateSSOSession()

  // Als validation succesvol, mount React app
  if (user) {
    const rootElement = document.getElementById('root')
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
  // Anders redirect gebeurt al in validateSSOSession
}

// Start app
initApp()
