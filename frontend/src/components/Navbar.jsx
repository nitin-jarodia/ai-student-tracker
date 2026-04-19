// components/Navbar.jsx - Top Navigation Bar

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
      <h2 className="text-lg font-semibold text-gray-700">
        🎓 AI Student Performance Tracker
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          👋 Welcome, {user?.full_name || 'Teacher'}
        </span>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
          {user?.role || 'teacher'}
        </span>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
