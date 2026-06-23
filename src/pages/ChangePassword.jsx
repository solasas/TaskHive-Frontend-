import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setSuccess('Password changed successfully')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">Change Password</h1>
            <p className="text-slate-400 text-sm mt-0.5">Update your account password</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-lg mb-4">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}