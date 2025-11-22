import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FilePicker from './components/FilePicker'
import EditorPage from './components/EditorPage'
import { useAuth } from './hooks/useAuth'
import './App.css'

/**
 * EUTYPE App - Pure SSO Client
 * 
 * Geen eigen login UI of auth logic
 * SSO validatie gebeurt via useAuth hook
 * Bij geen geldige sessie -> automatische redirect naar centraal loginportaal
 */
function App() {
  const { user, loading, error } = useAuth()

  // Loading state tijdens SSO validatie
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.2rem' }}>EUTYPE wordt geladen...</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>SSO sessie wordt gevalideerd</div>
      </div>
    )
  }

  // Geen user en geen loading -> redirect gebeurt in useAuth hook
  if (!user) {
    return null
  }

  // User is authenticated -> toon de app
  return (
    <Router>
      <Routes>
        {/* Alle routes zijn protected via useAuth SSO check */}
        <Route path="/" element={<FilePicker />} />
        <Route path="/editor" element={<EditorPage />} />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
