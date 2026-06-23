import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import KanbanBoard from '../components/KanbanBoard'
import CreateTaskModal from '../components/modals/CreateTaskModal'
import EditTaskModal from '../components/modals/EditTaskModal'
import api from '../api/axios'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [memberLoading, setMemberLoading] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projRes, tasksRes, allProjRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/tasks`),
          api.get('/projects'),
        ])
        setProject(projRes.data)
        setTasks(tasksRes.data)
        setProjects(allProjRes.data)
      } catch {
        setError('Failed to load project data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => String(t.id) === String(taskId))
    if (!task) return
    try {
      const res = await api.put(`/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        assignedToId: task.assignedTo?.id,
        dueDate: task.dueDate,
      })
      setTasks((prev) => prev.map((t) => (String(t.id) === String(taskId) ? res.data : t)))
    } catch {
      setError('Failed to update task status')
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setMemberError('')
    if (!memberEmail) return
    setMemberLoading(true)
    try {
      const res = await api.post(`/projects/${id}/members`, { email: memberEmail })
      setProject(res.data)
      setMemberEmail('')
      setShowAddMember(false)
    } catch (err) {
      const data = err.response?.data
      setMemberError(typeof data === 'string' ? data : data?.message || 'Failed to add member')
    } finally {
      setMemberLoading(false)
    }
  }

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch {
      setError('Failed to delete task')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar projects={projects} />
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex items-start justify-between mb-4 shrink-0">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-indigo-600 text-xs mb-1.5 flex items-center gap-1 transition"
              >
                ← Dashboard
              </button>
              <h1 className="text-xl font-bold text-slate-800">{project?.name}</h1>
              {project?.description && (
                <p className="text-slate-400 text-sm mt-0.5">{project.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setShowAddMember(!showAddMember); setMemberError('') }}
                className="border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                + Member
              </button>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              >
                + Add Task
              </button>
            </div>
          </div>
          {showAddMember && (
            <form onSubmit={handleAddMember} className="flex gap-2 mb-3 shrink-0">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Collaborator's email address"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                autoFocus
              />
              <button
                type="submit"
                disabled={memberLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {memberLoading ? 'Adding…' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddMember(false); setMemberEmail(''); setMemberError('') }}
                className="border border-slate-200 text-slate-500 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </form>
          )}
          {memberError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 shrink-0">{memberError}</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 shrink-0">
              {error}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <KanbanBoard
              tasks={tasks}
              onTaskEdit={setEditingTask}
              onTaskDelete={handleTaskDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        </main>
      </div>
      {showCreateTask && (
        <CreateTaskModal
          projectId={id}
          members={project?.members || []}
          onClose={() => setShowCreateTask(false)}
          onCreated={(task) => setTasks((prev) => [...prev, task])}
        />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          members={project?.members || []}
          onClose={() => setEditingTask(null)}
          onUpdated={(updated) =>
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
          }
        />
      )}
    </div>
  )
}
