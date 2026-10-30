
const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

const formatDate = (date) => {
  if (!date) return 'No due date'

  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onMove,
  busyTaskId,
}) {
  return (
    <section className="kanban-section">
      <h2>Kanban Board</h2>

      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = tasks
            .filter((task) => task.status === column.id)
            .sort((a, b) => a.position - b.position)

          return (
            <div className="kanban-column" key={column.id}>
              <div className="kanban-column-header">
                <h3>{column.title}</h3>
                <span>{columnTasks.length}</span>
              </div>

              <div className="kanban-task-list">
                {columnTasks.length === 0 ? (
                  <p className="kanban-empty">No tasks</p>
                ) : (
                  columnTasks.map((task) => {
                    const currentIndex = columns.findIndex(
                      (item) => item.id === task.status
                    )

                    return (
                      <article
                        className="kanban-task-card"
                        key={task._id}
                      >
                        <h4>{task.title}</h4>

                        {task.description && (
                          <p>{task.description}</p>
                        )}

                        <span
                          className={`task-priority priority-${task.priority}`}
                        >
                          {task.priority} priority
                        </span>

                        <small>
                          Due: {formatDate(task.dueDate)}
                        </small>

                        <div className="kanban-card-actions">
                          {currentIndex > 0 && (
                            <button
                              type="button"
                              disabled={busyTaskId === task._id}
                              onClick={() =>
                                onMove(
                                  task,
                                  columns[currentIndex - 1].id
                                )
                              }
                            >
                              ← Back
                            </button>
                          )}

                          {currentIndex < columns.length - 1 && (
                            <button
                              type="button"
                              disabled={busyTaskId === task._id}
                              onClick={() =>
                                onMove(
                                  task,
                                  columns[currentIndex + 1].id
                                )
                              }
                            >
                              Next →
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={busyTaskId === task._id}
                            onClick={() => onEdit(task)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="kanban-delete"
                            disabled={busyTaskId === task._id}
                            onClick={() => onDelete(task)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default KanbanBoard
