import apiClient from './client'

/**
 * POST /auth/register
 * Register a new user
 */
export const register = async (username, email, password) => {
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    password
  })
  return response.data
}

/**
 * POST /auth/login
 * Login and receive JWT token
 * FastAPI OAuth2 expects form data, not JSON
 */
export const login = async (username, password) => {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  
  const response = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  
  const { access_token, token_type, expires_in } = response.data
  
  // Store token in localStorage
  localStorage.setItem('jwt_token', access_token)
  localStorage.setItem('token_expiry', Date.now() + (expires_in * 1000))
  
  return response.data
}

/**
 * GET /auth/me
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me')
  
  // Cache user data
  localStorage.setItem('user_data', JSON.stringify(response.data))
  
  return response.data
}

/**
 * Logout - clear local storage
 */
export const logout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('token_expiry')
  localStorage.removeItem('user_data')
  window.location.href = '/login'
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('jwt_token')
  const expiry = localStorage.getItem('token_expiry')
  
  if (!token || !expiry) {
    return false
  }
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    logout()
    return false
  }
  
  return true
}

/**
 * Get cached user data
 */
export const getCachedUser = () => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}
