import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/modals/CreateProjectModal'
import api from '../api/axios'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('Failed to delete project')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar projects={projects} onNewProject={() => setShowCreateModal(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Projects</h1>
              <p className="text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              + New Project
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-base font-medium text-slate-500">No projects yet</p>
              <p className="text-sm mt-1">Create your first project to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + New Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(project) => setProjects((prev) => [...prev, project])}
        />
      )}
    </div>
  )
}
