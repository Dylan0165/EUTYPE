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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      padding: '48px',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '440px',
      margin: '20px'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      color: '#667eea',
      margin: '0 0 8px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px',
      margin: 0
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
      color: '#374151'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'border-color 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#667eea'
    },
    button: {
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginTop: '8px'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    error: {
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    info: {
      background: '#dbeafe',
      border: '1px solid #bfdbfe',
      color: '#1e40af',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#6b7280',
      fontSize: '14px'
    },
    link: {
      color: '#667eea',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    eucloudBranding: {
      textAlign: 'center',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    eucloudText: {
      fontSize: '12px',
      color: '#9ca3af',
      margin: '0 0 8px 0'
    },
    appGrid: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    appIcon: {
      padding: '8px 16px',
      background: '#f3f4f6',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <h1 style={styles.title}>EU CLOUD</h1>
          <p style={styles.subtitle}>
            {mode === 'login' ? 'Log in op je account' : 'Maak een nieuw account'}
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>⚠️</strong> {error}
          </div>
        )}

        {mode === 'login' && !error && (
          <div style={styles.info}>
            <strong>💡</strong> Eerste keer? <span style={styles.link} onClick={() => setMode('register')}>Registreer hier</span>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gebruikersnaam</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {mode === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mailadres</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Wachtwoord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {mode === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bevestig wachtwoord</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            {loading ? 'Bezig...' : (mode === 'login' ? 'Inloggen' : 'Registreren')}
          </button>
        </form>

        <div style={styles.footer}>
          {mode === 'login' ? (
            <p>
              Nog geen account?{' '}
              <span style={styles.link} onClick={() => {
                setMode('register')
                setError('')
                setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              }}>
                Registreer hier
              </span>
            </p>
          ) : (
            <p>
              Al een account?{' '}
              <span style={styles.link} onClick={() => {
                setMode('login')
                setError('')
                setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              }}>
                Log in
              </span>
            </p>
          )}
        </div>

        <div style={styles.eucloudBranding}>
          <p style={styles.eucloudText}>Eén account voor alle EU Cloud apps</p>
          <div style={styles.appGrid}>
            <div style={styles.appIcon}>📝 EuType</div>
            <div style={styles.appIcon}>📁 EuCloud Files</div>
            <div style={styles.appIcon}>💬 EuChat</div>
            <div style={styles.appIcon}>📧 EuMail</div>
          </div>
        </div>
      </div>
    </div>
  )
}
