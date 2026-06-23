import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ projects = [], onNewProject }) {
  const location = useLocation()

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="px-4 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Projects
          </span>
          {onNewProject && (
            <button
              onClick={onNewProject}
              className="w-5 h-5 flex items-center justify-center rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-sm leading-none transition"
              title="New project"
            >
              +
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 ? (
          <p className="text-slate-400 text-xs px-3 py-3 italic">No projects yet</p>
        ) : (
          projects.map((project) => {
            const active = location.pathname === `/projects/${project.id}`
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm truncate transition mb-0.5 ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    active ? 'bg-indigo-500' : 'bg-slate-300'
                  }`}
                />
                <span className="truncate">{project.name}</span>
              </Link>
            )
          })
        )}
      </nav>
    </aside>
  )
}
