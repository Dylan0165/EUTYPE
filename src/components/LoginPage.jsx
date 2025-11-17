import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import { formatApiError } from '../utils/errorHandling'

export default function LoginPage() {
  const navigate = useNavigate()
  // Start met REGISTER mode voor nieuwe gebruikers
  const [mode, setMode] = useState('register') // 'login' of 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
      navigate('/') // Redirect naar file picker
    } catch (err) {
      const errorMsg = formatApiError(err)
      
      // Geef specifieke hulp voor veelvoorkomende fouten
      if (err.response?.status === 401 || errorMsg.includes('Incorrect')) {
        setError('Gebruikersnaam of wachtwoord is onjuist. Probeer het opnieuw of registreer een nieuw account.')
      } else if (err.response?.status === 422) {
        setError('Ongeldige invoer. Controleer je gebruikersnaam en wachtwoord.')
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
      // Na registratie direct inloggen
      await login(formData.username, formData.password)
      navigate('/')
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">EUTYPE</h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' ? 'Log in op je account' : 'Maak een nieuw account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            <strong>Fout:</strong> {error}
          </div>
        )}

        {/* Info Message voor nieuwe gebruikers */}
        {mode === 'login' && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
            <strong>💡 Eerste keer?</strong> Klik hieronder op <strong>"Registreer hier"</strong> om een account aan te maken.
          </div>
        )}

        {/* Info voor registratie */}
        {mode === 'register' && !error && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            <strong>🎉 Welkom bij EUTYPE!</strong> Maak een account aan om te beginnen met je documenten in de cloud.
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gebruikersnaam
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email (alleen bij registreren) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mailadres
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password (alleen bij registreren) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bevestig wachtwoord
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig...' : (mode === 'login' ? 'Inloggen' : 'Registreren')}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-gray-600">
              Nog geen account?{' '}
              <button
                onClick={() => {
                  setMode('register')
                  setError('')
                  setFormData({ username: '', email: '', password: '', confirmPassword: '' })
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Registreer hier
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Al een account?{' '}
              <button
                onClick={() => {
                  setMode('login')
                  setError('')
                  setFormData({ username: '', email: '', password: '', confirmPassword: '' })
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
