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
  console.log('[EUTYPE] Starting SSO validation...')
  console.log('[EUTYPE] API Base URL:', API_BASE_URL)
  console.log('[EUTYPE] SSO Login URL:', SSO_LOGIN_URL)
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      credentials: 'include', // Stuurt eusuite_token cookie mee
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('[EUTYPE] SSO validation response status:', response.status)

    if (!response.ok) {
      // Sessie niet geldig - redirect naar centrale login
      console.log('[EUTYPE] No valid session - redirecting to SSO login')
      const currentUrl = window.location.href
      const redirectUrl = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`
      console.log('[EUTYPE] Redirecting to:', redirectUrl)
      window.location.href = redirectUrl
      return null
    }

    // Sessie geldig - return user data
    const userData = await response.json()
    console.log('[EUTYPE] SSO validation successful, user:', userData)
    return userData
  } catch (error) {
    console.error('[EUTYPE] SSO validation failed:', error)
    // Bij netwerk errors ook naar login
    const currentUrl = window.location.href
    const redirectUrl = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`
    console.log('[EUTYPE] Redirecting to:', redirectUrl)
    window.location.href = redirectUrl
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
