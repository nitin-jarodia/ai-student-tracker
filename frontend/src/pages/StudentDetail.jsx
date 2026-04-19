// pages/StudentDetail.jsx - Individual Student Performance Page

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { performanceAPI } from '../services/api'
import { ScoreTrendChart, SubjectBarChart } from '../components/Charts'

function RiskBadge({ level }) {
  const styles = {
    HIGH:   'bg-red-100 text-red-700 border-red-300',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    LOW:    'bg-green-100 text-green-700 border-green-300'
  }
  const icons = { HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢' }
  return (
    <span className={`px-4 py-2 rounded-full border font-semibold text-sm ${styles[level]}`}>
      {icons[level]} {level} RISK
    </span>
  )
}

export default function StudentDetail() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const [data,       setData]     = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [report,     setReport]   = useState(null)
  const [loading,    setLoading]  = useState(true)
  const [predLoading, setPredLoading] = useState(false)
  const [repLoading,  setRepLoading]  = useState(false)

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await performanceAPI.getByStudent(id)
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePredict = async () => {
    try {
      setPredLoading(true)
      const res = await performanceAPI.predict(id)
      setPrediction(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setPredLoading(false)
    }
  }

  const handleReport = async () => {
    try {
      setRepLoading(true)
      const res = await performanceAPI.getReport(id)
      setReport(res.data.report)
    } catch (err) {
      console.error(err)
    } finally {
      setRepLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading student data...</div>
  if (!data)   return <div className="p-8 text-center text-red-400">Student not found!</div>

  const chartData = data.records?.map(r => ({
    subject: r.subject_name?.substring(0, 4) || 'Sub',
    score:   r.percentage,
    grade:   r.grade
  })) || []

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4 flex items-center gap-1 text-sm"
      >
        ← Back to Students
      </button>

      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.student_name}</h1>
            <p className="text-blue-200 mt-1">Student ID: {id}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                📊 Avg: {data.average}%
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                📝 {data.total_exams} Exams
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                Grade: {data.grade}
              </span>
            </div>
          </div>
          <div className="text-8xl opacity-20">🎓</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePredict}
          disabled={predLoading}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          {predLoading ? '⏳ Analyzing...' : '🤖 AI Risk Prediction'}
        </button>
        <button
          onClick={handleReport}
          disabled={repLoading}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          {repLoading ? '⏳ Generating...' : '📋 Generate AI Report'}
        </button>
      </div>

      {/* AI Prediction Result */}
      {prediction && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-bold mb-4">🤖 AI Risk Assessment</h2>
          <div className="flex items-center gap-4 mb-4">
            <RiskBadge level={prediction.prediction?.risk_level} />
            <span className="text-gray-500">
              Risk Score: <strong>{prediction.prediction?.risk_score}/100</strong>
            </span>
            <span className="text-gray-500">
              Average: <strong>{prediction.avg_score}%</strong>
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{prediction.prediction?.recommendation}</p>
          </div>
        </div>
      )}

      {/* AI Report */}
      {report && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-green-500">
          <h2 className="text-lg font-bold mb-4">📋 AI Generated Report</h2>
          <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-sans">
            {report}
          </pre>
        </div>
      )}

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📊 Subject Performance</h2>
          <SubjectBarChart data={chartData} />
        </div>
      )}

      {/* Performance Records Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">📝 Exam Records</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Subject</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Score</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Percentage</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Grade</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Exam Type</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.records?.map(record => (
              <tr key={record.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{record.subject_name}</td>
                <td className="p-4">{record.score}/{record.max_score}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${record.percentage >= 75 ? 'bg-green-500' : record.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${record.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{record.percentage}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                    {record.grade}
                  </span>
                </td>
                <td className="p-4 capitalize text-gray-600">{record.exam_type.replace('_', ' ')}</td>
                <td className="p-4 text-gray-500">{record.exam_date}</td>
              </tr>
            ))}
            {(!data.records || data.records.length === 0) && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No performance records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
