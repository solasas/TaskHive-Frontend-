const PRIORITY = {
  HIGH:   { border: 'border-l-red-500',    badge: 'bg-red-50 text-red-600 ring-1 ring-red-200',       label: 'High' },
  MEDIUM: { border: 'border-l-amber-400',  badge: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',  label: 'Medium' },
  LOW:    { border: 'border-l-emerald-400',badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', label: 'Low' },
}

export default function TaskCard({ task, onEdit, onDelete, provided }) {
  const pc = PRIORITY[task.priority] || { border: 'border-l-slate-300', badge: 'bg-slate-100 text-slate-500', label: task.priority }

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`bg-white border border-slate-200 border-l-4 ${pc.border} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow mb-2 cursor-grab active:cursor-grabbing group`}
    >
      <div className="flex items-start justify-between gap-1">
        <h4 className="font-medium text-slate-800 text-sm flex-1 leading-snug">{task.title}</h4>
        <div className="flex gap-0.5 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition text-sm"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition text-lg leading-none"
            title="Delete"
          >
            &times;
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2.5 items-center">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pc.badge}`}>
          {pc.label}
        </span>
        {task.assignee && (
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ring-1 ring-indigo-200">
            {task.assignee.username || task.assignee.email}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-slate-400 ml-auto font-mono tabular-nums">
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}
