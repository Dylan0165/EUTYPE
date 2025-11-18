import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import { formatApiError } from '../utils/errorHandling'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      navigate('/')
    } catch (err) {
      const errorMsg = formatApiError(err)
      if (err.response?.status === 401) {
        setError('Gebruikersnaam of wachtwoord is onjuist.')
      } else {
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten')
      return
    }

    setLoading(true)

    try {
      await register(formData.username, formData.email, formData.password)
      await login(formData.username, formData.password)
      navigate('/')
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    card: {
      background: '#ffffff',
      padding: '48px 40px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '420px',
      margin: '20px'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    cloudIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#667eea',
      margin: '0 0 8px 0',
      letterSpacing: '0.5px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '14px',
      margin: 0,
      fontWeight: '400'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    input: {
      padding: '12px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      backgroundColor: '#ffffff'
    },
    button: {
      padding: '14px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      marginTop: '8px'
    },
    buttonHover: {
      backgroundColor: '#2563eb'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    error: {
      background: '#FEE2E2',
      border: '1px solid #FCA5A5',
      color: '#991B1B',
      padding: '12px 14px',
      borderRadius: '6px',
      fontSize: '13px',
      marginBottom: '16px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#6b7280',
      fontSize: '14px'
    },
    link: {
      color: '#3b82f6',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.cloudIcon}>☁️</div>
          <h1 style={styles.title}>EUCLOUD</h1>
          <p style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account and get 5GB free storage'}
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={styles.form}>
          {mode === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>✉️</span> Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>{mode === 'login' ? '👤' : '👤'}</span> {mode === 'login' ? 'Username' : 'Username'}
            </label>
            <input
              type="text"
              name="username"
              placeholder={mode === 'login' ? 'Enter your username' : 'Choose a username'}
              value={formData.username}
              onChange={handleInputChange}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {mode === 'login' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>🔒</span> Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          )}

          {mode === 'register' && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔒</span> Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔒</span> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={styles.footer}>
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span style={styles.link} onClick={() => {
                setMode('register')
                setError('')
                setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              }}>
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span style={styles.link} onClick={() => {
                setMode('login')
                setError('')
                setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              }}>
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
