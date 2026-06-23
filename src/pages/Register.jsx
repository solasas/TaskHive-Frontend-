import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      const { token, ...userData } = res.data
      login(token, userData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Register error:', err.response?.status, err.response?.data)
      const data = err.response?.data
      const msg = typeof data === 'string' ? data : data?.message || data?.error || data?.errors?.[0] || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize:'48px 48px'}} />
        <div className="relative text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐝</span>
            <span className="text-xl font-bold tracking-tight">TaskHive</span>
          </div>
        </div>
        <div className="relative">
          <p className="text-white text-3xl font-bold leading-tight mb-4">
            Create your hive.<br />Assign tasks.<br />Track progress.
          </p>
          <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xs">
            Join your team on TaskHive — the collaborative workspace built for teams that move fast.
          </p>
        </div>
        <p className="relative text-indigo-300/40 text-xs">© 2025 TaskHive</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex flex-col items-center">
            <span className="text-4xl mb-1">🐝</span>
            <span className="text-xl font-bold text-white">TaskHive</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
          <p className="text-slate-400 text-sm mb-8">Start collaborating with your team</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition"
                placeholder="johndoe"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
