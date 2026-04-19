// pages/Dashboard.jsx - Main Dashboard with Real Data

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { performanceAPI, studentAPI } from '../services/api'
import { ScoreTrendChart, RiskChart } from '../components/Charts'

function StatCard({ title, value, color, icon, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}

function RiskBadge({ level }) {
  const colors = {
    HIGH:   'bg-red-100 text-red-700 border border-red-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    LOW:    'bg-green-100 text-green-700 border border-green-200'
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[level]}`}>
      {level}
    </span>
  )
}

export default function Dashboard() {
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const navigate                = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await performanceAPI.getAllSummary()
      setSummary(res.data)
    } catch (err) {
      setError("Could not connect to backend. Make sure FastAPI is running!")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">⏳</div>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <h3 className="text-red-700 font-semibold text-lg mb-2">⚠️ Connection Error</h3>
      <p className="text-red-600">{error}</p>
      <p className="text-sm text-red-400 mt-2">Make sure: cd backend → venv\Scripts\activate → uvicorn app.main:app --reload</p>
      <button onClick={fetchData} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
        Try Again
      </button>
    </div>
  )

  const students   = summary?.students || []
  const total      = summary?.total || 0
  const highRisk   = summary?.high_risk || 0
  const mediumRisk = summary?.medium_risk || 0
  const lowRisk    = summary?.low_risk || 0
  const avgScore   = students.length > 0
    ? (students.reduce((a, s) => a + s.avg_score, 0) / students.length).toFixed(1)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered student performance overview</p>
        </div>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students"   value={total}      color="#3B82F6" icon="🎓" subtitle="Enrolled students" />
        <StatCard title="At Risk"          value={highRisk}   color="#EF4444" icon="⚠️" subtitle="Need immediate help" />
        <StatCard title="Avg Performance"  value={`${avgScore}%`} color="#10B981" icon="📈" subtitle="Class average" />
        <StatCard title="Performing Well"  value={lowRisk}    color="#8B5CF6" icon="⭐" subtitle="Low risk students" />
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-500 font-medium">🔴 HIGH RISK</p>
          <p className="text-4xl font-bold text-red-600 my-2">{highRisk}</p>
          <p className="text-sm text-red-400">Immediate intervention needed</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-500 font-medium">🟡 MEDIUM RISK</p>
          <p className="text-4xl font-bold text-yellow-600 my-2">{mediumRisk}</p>
          <p className="text-sm text-yellow-400">Extra support needed</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-500 font-medium">🟢 LOW RISK</p>
          <p className="text-4xl font-bold text-green-600 my-2">{lowRisk}</p>
          <p className="text-sm text-green-400">Performing well</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">🎓 All Students Overview</h2>
          <button
            onClick={() => navigate('/students')}
            className="text-blue-600 text-sm hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Student</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Roll No</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Class</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Avg Score</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Grade</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Attendance</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Risk Level</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-500">{student.roll}</td>
                  <td className="p-4">{student.class} - {student.section}</td>
                  <td className="p-4 font-semibold">{student.avg_score}%</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {student.grade}
                    </span>
                  </td>
                  <td className="p-4">{student.attendance}%</td>
                  <td className="p-4"><RiskBadge level={student.risk_level} /></td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    No students found. Add students to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
