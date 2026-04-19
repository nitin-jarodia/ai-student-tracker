// components/Charts.jsx - Recharts Visualization Components

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

// ── Subject Performance Bar Chart ──
export function SubjectBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Score']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Bar dataKey="score" fill="#3B82F6" radius={[6, 6, 0, 0]}
          label={{ position: 'top', fontSize: 11, fill: '#6B7280' }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Score Trend Line Chart ──
export function ScoreTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Line type="monotone" dataKey="math"    stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="science" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="english" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Risk Distribution Pie Chart ──
export function RiskChart({ high, medium, low }) {
  const data = [
    { name: 'High Risk',   value: high,   color: '#EF4444' },
    { name: 'Medium Risk', value: medium, color: '#F59E0B' },
    { name: 'Low Risk',    value: low,    color: '#10B981' },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
