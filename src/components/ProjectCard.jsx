import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ACCENTS = [
  'border-t-indigo-500',
  'border-t-violet-500',
  'border-t-sky-500',
  'border-t-emerald-500',
  'border-t-rose-500',
  'border-t-amber-500',
]

function accentFor(id) {
  return ACCENTS[(Number(id) || 0) % ACCENTS.length]
}

function avatar(name) {
  return name ? name.slice(0, 2).toUpperCase() : '?'
}

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwner =
    user?.id === project.owner?.id || user?.email === project.owner?.email

  return (
    <div
      className={`bg-white border border-slate-200 border-t-4 ${accentFor(project.id)} rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-base leading-snug group-hover:text-indigo-700 transition-colors">
          {project.name}
        </h3>
        {isOwner && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 text-xl leading-none ml-2 transition-all"
            title="Delete project"
          >
            &times;
          </button>
        )}
      </div>

      {project.description && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        {project.owner && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
              {avatar(project.owner.username || project.owner.email)}
            </div>
            <span className="text-xs text-slate-500 truncate max-w-28">
              {project.owner.username || project.owner.email}
            </span>
          </div>
        )}
        {project.members?.length > 0 && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
            {project.members.length} member{project.members.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
