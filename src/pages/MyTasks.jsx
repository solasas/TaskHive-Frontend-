import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'

const STATUS_STYLES = {
  TODO: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  DONE: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
}

const PRIORITY_STYLES = {
  HIGH:   'bg-red-50 text-red-600 ring-1 ring-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  LOW:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
}

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  useEffect(() => {
    Promise.all([api.get('/tasks/my-tasks'), api.get('/projects')])
      .then(([tasksRes, projRes]) => {
        setTasks(tasksRes.data)
        setProjects(projRes.data)
      })
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar projects={projects} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-slate-800">My Tasks</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
            </p>
          </div>

          <div className="flex gap-2 mb-5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            {(statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
              <span className="text-sm text-slate-400 self-center">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-600"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-base font-medium text-slate-500">No tasks found</p>
              <p className="text-sm text-slate-400 mt-1">
                {tasks.length === 0 ? 'No tasks are assigned to you yet' : 'Try adjusting the filters'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Task</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 text-sm">{task.title}</div>
                        {task.description && (
                          <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{task.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {task.projectName || task.project?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status] || 'bg-slate-100 text-slate-600'}`}>
                          {task.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority] || 'bg-slate-100 text-slate-600'}`}>
                          {task.priority?.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400 font-mono tabular-nums">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
