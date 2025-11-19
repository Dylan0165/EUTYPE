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
  // Show loading state
  const rootElement = document.getElementById('root')
  rootElement.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">☁️</div>
        <h2 style="font-size: 24px; font-weight: 600; margin: 0;">EUTYPE</h2>
        <p style="font-size: 14px; opacity: 0.9; margin-top: 8px;">Validating session...</p>
      </div>
    </div>
  `

  // Validate SSO session
  const user = await validateSSOSession()

  // Als validation succesvol, mount React app
  if (user) {
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
