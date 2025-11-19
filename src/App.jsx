import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FilePicker from './components/FilePicker'
import EditorPage from './components/EditorPage'
import './App.css'

/**
 * EUTYPE App - Pure SSO Client
 * 
 * Geen eigen login UI of auth logic
 * SSO validatie gebeurt in main.jsx VOOR deze app mount
 * Als deze code draait, is de gebruiker altijd authenticated
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Alle routes zijn protected via SSO check in main.jsx */}
        <Route path="/" element={<FilePicker />} />
        <Route path="/editor" element={<EditorPage />} />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
