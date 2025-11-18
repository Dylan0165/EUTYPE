import apiClient from './client'

/**
 * GET /auth/me
 * Check if user is authenticated via SSO cookie
 * Returns user data if authenticated, throws 401 if not
 */
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/auth/me')
    return response.data
  } catch (error) {
    // 401 wordt afgehandeld door apiClient interceptor
    throw error
  }
}

/**
 * Get current authenticated user
 * Alias for checkAuth for backward compatibility
 */
export const getCurrentUser = checkAuth
