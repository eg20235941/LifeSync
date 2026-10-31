import { useEffect, useState } from 'react'
import {
  getTasks,
  deleteTask,
  updateTaskStatus,
} from '../api/taskApi'
import TaskForm from '../components/TaskForm'
import KanbanBoard from '../components/KanbanBoard'
import './Tasks.css'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [busyTaskId, setBusyTaskId] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load tasks.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleTaskAdded = (newTask) => {
    setTasks((previous) => [newTask, ...previous])
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks((previous) =>
      previous.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    )

    setEditingTask(null)
  }

  const handleMove = async (task, newStatus) => {
    setActionError('')
    setBusyTaskId(task._id)

    try {
      const updatedTask = await updateTaskStatus(
        task._id,
        newStatus
      )

      setTasks((previous) =>
        previous.map((item) =>
          item._id === updatedTask._id ? updatedTask : item
        )
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to move task.'
      )
    } finally {
      setBusyTaskId(null)
    }
  }

  const handleDelete = async (task) => {
    const confirmed = window.confirm(
      `Delete task "${task.title}"?`
    )

    if (!confirmed) return

    setActionError('')
    setBusyTaskId(task._id)

    try {
      await deleteTask(task._id)

      setTasks((previous) =>
        previous.filter((item) => item._id !== task._id)
      )

      if (editingTask?._id === task._id) {
        setEditingTask(null)
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to delete task.'
      )
    } finally {
      setBusyTaskId(null)
    }
  }

  const todoCount = tasks.filter(
    (task) => task.status === 'todo'
  ).length

  const inProgressCount = tasks.filter(
    (task) => task.status === 'in_progress'
  ).length

  const doneCount = tasks.filter(
    (task) => task.status === 'done'
  ).length

  return (
    <div className="tasks-page">

      {/* Page heading */}

      <section className="tasks-heading">
        <div>
          <h1>Task Manager</h1>
          <p>Plan your work, stay focused, and get things done.</p>
        </div>

        <div className="tasks-heading-tag">
          ☷ &nbsp; My Tasks
        </div>
      </section>

      {loading && (
        <div className="tasks-message">
          Loading your tasks...
        </div>
      )}

      {error && (
        <div role="alert" className="tasks-message tasks-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Task summary */}

          <section className="tasks-summary">

            <div className="tasks-summary-card">
              <div className="tasks-summary-icon total-tasks-icon">
                ☷
              </div>
              <div>
                <p>Total Tasks</p>
                <h2>{tasks.length}</h2>
                <span>All your tasks</span>
              </div>
            </div>

            <div className="tasks-summary-card">
              <div className="tasks-summary-icon todo-tasks-icon">
                ○
              </div>
              <div>
                <p>To Do</p>
                <h2>{todoCount}</h2>
                <span>Waiting to start</span>
              </div>
            </div>

            <div className="tasks-summary-card">
              <div className="tasks-summary-icon progress-tasks-icon">
                ◷
              </div>
              <div>
                <p>In Progress</p>
                <h2>{inProgressCount}</h2>
                <span>Currently working</span>
              </div>
            </div>

            <div className="tasks-summary-card">
              <div className="tasks-summary-icon done-tasks-icon">
                ✓
              </div>
              <div>
                <p>Completed</p>
                <h2>{doneCount}</h2>
                <span>Successfully finished</span>
              </div>
            </div>

          </section>

          {/* Create or edit task */}

          <section className="tasks-form-panel">
            <div className="tasks-section-heading">
              <h2>
                {editingTask ? 'Edit Task' : 'Create a Task'}
              </h2>

              <p>
                {editingTask
                  ? 'Update your task details.'
                  : 'Add a new task to your workspace.'}
              </p>
            </div>

            <TaskForm
              key={editingTask?._id || 'new'}
              taskToEdit={editingTask}
              onTaskAdded={handleTaskAdded}
              onTaskUpdated={handleTaskUpdated}
              onCancelEdit={() => setEditingTask(null)}
            />
          </section>

          {/* Kanban board */}

          {actionError && (
            <p role="alert" className="tasks-action-error">
              {actionError}
            </p>
          )}

          <KanbanBoard
            tasks={tasks}
            onEdit={(task) => {
              setActionError('')
              setEditingTask(task)
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }}
            onDelete={handleDelete}
            onMove={handleMove}
            busyTaskId={busyTaskId}
          />
        </>
      )}
    </div>
  )
}

export default Tasks