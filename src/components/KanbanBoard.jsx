import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

const COLUMNS = [
  {
    id: 'TODO',
    label: 'To Do',
    dot: 'bg-slate-400',
    header: 'bg-slate-50',
    countClass: 'bg-slate-200 text-slate-600',
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    dot: 'bg-blue-500',
    header: 'bg-blue-50/60',
    countClass: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'DONE',
    label: 'Done',
    dot: 'bg-emerald-500',
    header: 'bg-emerald-50/60',
    countClass: 'bg-emerald-100 text-emerald-700',
  },
]

export default function KanbanBoard({ tasks, onTaskEdit, onTaskDelete, onStatusChange }) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id)
    return acc
  }, {})

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return
    if (destination.droppableId !== source.droppableId) {
      onStatusChange(draggableId, destination.droppableId)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex-1 min-w-64 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm"
          >
            <div className={`px-4 py-3 border-b border-slate-100 shrink-0 flex items-center gap-2.5 ${col.header}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
              <span className="text-sm font-semibold text-slate-700 flex-1">{col.label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.countClass}`}>
                {grouped[col.id]?.length || 0}
              </span>
            </div>
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-2.5 overflow-y-auto transition-colors ${
                    snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  {grouped[col.id]?.map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided) => (
                        <TaskCard
                          task={task}
                          onEdit={onTaskEdit}
                          onDelete={onTaskDelete}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
