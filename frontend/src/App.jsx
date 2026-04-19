// App.jsx - Main React Application with Routing

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentDetail from './pages/StudentDetail'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <AppLayout><Dashboard /></AppLayout>
          } />
          <Route path="/students" element={
            <AppLayout><Students /></AppLayout>
          } />
          <Route path="/students/:id" element={
            <AppLayout><StudentDetail /></AppLayout>
          } />
          <Route path="/reports" element={
            <AppLayout><Reports /></AppLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
