// pages/Students.jsx - Students List & Management

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../services/api'

function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', email: '', roll_number: '', class_name: '',
    section: '', parent_name: '', parent_phone: '', parent_email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async () => {
    if (!form.name || !form.roll_number || !form.class_name || !form.section) {
      setError('Please fill all required fields!')
      return
    }
    try {
      setLoading(true)
      await studentAPI.create(form)
      onAdd()
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name',         label: 'Full Name *',       type: 'text'  },
    { key: 'email',        label: 'Email',             type: 'email' },
    { key: 'roll_number',  label: 'Roll Number *',     type: 'text'  },
    { key: 'class_name',   label: 'Class *',           type: 'text'  },
    { key: 'section',      label: 'Section *',         type: 'text'  },
    { key: 'parent_name',  label: 'Parent Name',       type: 'text'  },
    { key: 'parent_phone', label: 'Parent Phone',      type: 'text'  },
    { key: 'parent_email', label: 'Parent Email',      type: 'email' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">➕ Add New Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={f.label.replace(' *', '')}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Students() {
  const [students,  setStudents]  = useState([])
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter,    setFilter]    = useState('all')
  const navigate = useNavigate()

  useEffect(() => { fetchStudents() }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const res = await studentAPI.getAll()
      setStudents(res.data.students || [])
    } catch (err) {
      console.error('Failed to fetch students', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete student ${name}?`)) return
    try {
      await studentAPI.delete(id)
      fetchStudents()
    } catch (err) {
      alert('Failed to delete student')
    }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎓 Students</h1>
          <p className="text-gray-500 text-sm">{students.length} total students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          ➕ Add Student
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or roll number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading students...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Roll No</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Class</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Parent</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-gray-500">{student.roll_number}</td>
                  <td className="p-4">{student.class_name}-{student.section}</td>
                  <td className="p-4 text-gray-600">{student.parent_name || '-'}</td>
                  <td className="p-4 text-gray-600">{student.parent_phone || '-'}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(student.id, student.name)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    {search ? 'No students match your search' : 'No students yet. Add your first student!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={fetchStudents}
        />
      )}
    </div>
  )
}
