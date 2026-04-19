// pages/Login.jsx - Login Page

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Login() {
  const [email,    setEmail]    = useState('admin@school.com')
  const [password, setPassword] = useState('admin123')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    try {
      setLoading(true)
      setError('')
      const res = await authAPI.login({ email, password })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials!')
    } finally {
      setLoading(false)
    }
  }

  // Demo login — bypass auth for testing
  const handleDemoLogin = () => {
    login({ id: 1, email: 'demo@school.com', full_name: 'Demo Teacher', role: 'teacher' }, 'demo-token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-gray-800">AI Student Tracker</h1>
          <p className="text-gray-500 mt-1 text-sm">Smart performance tracking powered by AI</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>

          <div className="text-center text-gray-400 text-sm">or</div>

          <button
            onClick={handleDemoLogin}
            className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
          >
            🚀 Demo Login (Skip Auth)
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Firebase Auth coming in Phase 5 • Built with React + FastAPI
        </p>
      </div>
    </div>
  )
}
