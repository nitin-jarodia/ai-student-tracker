// components/Sidebar.jsx - Left Navigation Sidebar

import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/',         icon: '📊', label: 'Dashboard',  desc: 'Overview & stats'   },
  { path: '/students', icon: '🎓', label: 'Students',   desc: 'Manage students'    },
  { path: '/reports',  icon: '📋', label: 'AI Reports', desc: 'Generate reports'   },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col shadow-xl">

      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">
            🎓
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">AI Student</h1>
            <p className="text-blue-300 text-xs">Performance Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'text-blue-200 hover:bg-blue-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${isActive ? 'text-blue-800' : ''}`}>
                  {item.label}
                </p>
                <p className={`text-xs ${isActive ? 'text-blue-500' : 'text-blue-400'}`}>
                  {item.desc}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Tech Stack Footer */}
      <div className="p-4 border-t border-blue-700">
        <p className="text-blue-400 text-xs text-center mb-2">Tech Stack</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {['React', 'FastAPI', 'PostgreSQL', 'AI/ML'].map(tech => (
            <span key={tech} className="bg-blue-700 text-blue-200 px-2 py-0.5 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-blue-500 text-xs text-center mt-3">
          github.com/nitin-jarodia
        </p>
      </div>
    </aside>
  )
}
