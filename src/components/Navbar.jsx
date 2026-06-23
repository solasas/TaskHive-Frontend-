import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? (user.username || user.email || '?').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav className="bg-slate-900 text-white px-5 flex items-center justify-between shrink-0 h-14 border-b border-slate-800">
      <div className="flex items-center gap-1">
        <Link to="/dashboard" className="flex items-center gap-2 mr-3 pr-3 border-r border-slate-700">
          <span className="text-lg">🐝</span>
          <span className="font-bold text-white tracking-tight text-sm">TaskHive</span>
        </Link>
        <Link
          to="/dashboard"
          className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
        >
          Dashboard
        </Link>
        <Link
          to="/my-tasks"
          className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
        >
          My Tasks
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              to="/change-password"
              className="text-xs text-slate-500 hover:text-slate-300 transition hidden sm:block"
            >
              Change Password
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{user.username || user.email}</span>
            </div>
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-red-400 transition ml-1 px-2 py-1 rounded hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
