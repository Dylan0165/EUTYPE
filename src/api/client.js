import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://192.168.124.50:30500/api'
const SSO_LOGIN_URL = 'http://192.168.124.50:30090/login'

// Axios instance voor SSO-based authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // BELANGRIJK: stuurt cookies mee met ALLE requests
})

// Response interceptor - handle 401 errors door redirect naar SSO login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User is not authenticated - redirect to SSO login portal
      const currentUrl = window.location.href
      window.location.href = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`
    }
    return Promise.reject(error)
  }
)

export default apiClient
export { API_BASE_URL, SSO_LOGIN_URL }
