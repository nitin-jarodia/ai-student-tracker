// pages/Reports.jsx - AI Reports Generation Page

import { useState, useEffect } from 'react'
import { studentAPI, performanceAPI } from '../services/api'

export default function Reports() {
  const [students,    setStudents]    = useState([])
  const [selectedId,  setSelectedId]  = useState('')
  const [report,      setReport]      = useState('')
  const [prediction,  setPrediction]  = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [studLoading, setStudLoading] = useState(true)

  useEffect(() => {
    studentAPI.getAll()
      .then(res => setStudents(res.data.students || []))
      .catch(console.error)
      .finally(() => setStudLoading(false))
  }, [])

  const handleGenerate = async () => {
    if (!selectedId) return alert('Please select a student!')
    try {
      setLoading(true)
      setReport('')
      setPrediction(null)
      const [repRes, predRes] = await Promise.all([
        performanceAPI.getReport(selectedId),
        performanceAPI.predict(selectedId)
      ])
      setReport(repRes.data.report)
      setPrediction(predRes.data)
    } catch (err) {
      setReport('Failed to generate report. Make sure backend is running!')
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent = students.find(s => s.id === parseInt(selectedId))

  const riskColors = {
    HIGH:   'border-red-500 bg-red-50',
    MEDIUM: 'border-yellow-500 bg-yellow-50',
    LOW:    'border-green-500 bg-green-50'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📋 AI Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Generate personalized AI performance reports</p>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🤖 Generate AI Report</h2>
        <div className="flex gap-4">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.roll_number}) - Class {s.class_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedId}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? '⏳ Generating...' : '🚀 Generate'}
          </button>
        </div>
      </div>

      {/* Prediction Card */}
      {prediction && prediction.prediction && (
        <div className={`rounded-xl border-l-4 p-6 mb-6 ${riskColors[prediction.prediction.risk_level]}`}>
          <h3 className="font-bold text-lg mb-2">🤖 Risk Assessment</h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="font-bold text-xl">{prediction.prediction.risk_level} RISK</span>
            <span className="text-gray-600">Score: {prediction.prediction.risk_score}/100</span>
            <span className="text-gray-600">Avg: {prediction.avg_score}%</span>
          </div>
          <p className="text-gray-700">{prediction.prediction.recommendation}</p>
        </div>
      )}

      {/* Report Card */}
      {report && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              📄 Report for {selectedStudent?.name}
            </h2>
            <button
              onClick={() => window.print()}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
            >
              🖨️ Print
            </button>
          </div>
          <pre className="bg-gray-50 rounded-xl p-6 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {report}
          </pre>
        </div>
      )}

      {!report && !loading && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Report Generated Yet</h3>
          <p className="text-gray-400">Select a student and click Generate to create an AI-powered report</p>
        </div>
      )}
    </div>
  )
}
