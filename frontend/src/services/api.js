// services/api.js - All API calls to FastAPI Backend

import axios from 'axios'

const API_BASE = 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

// Auto-attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ── Student APIs ──
export const studentAPI = {
  getAll:  ()         => api.get('/students/'),
  getById: (id)       => api.get(`/students/${id}`),
  create:  (data)     => api.post('/students/', data),
  update:  (id, data) => api.put(`/students/${id}`, data),
  delete:  (id)       => api.delete(`/students/${id}`),
}

// ── Performance APIs ──
export const performanceAPI = {
  getByStudent: (id)   => api.get(`/performance/${id}`),
  add:          (data) => api.post('/performance/', data),
  predict:      (id)   => api.get(`/performance/${id}/predict`),
  getReport:    (id)   => api.get(`/performance/${id}/report`),
  getAllSummary: ()     => api.get('/performance/summary/all'),
  addAttendance:(data) => api.post('/performance/attendance', data),
}

// ── Auth APIs ──
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getUsers: ()     => api.get('/auth/users'),
}

export default api
