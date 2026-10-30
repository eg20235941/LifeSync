
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTasks,
  deleteTask,
  updateTaskStatus,
} from '../api/taskApi'
import TaskForm from '../components/TaskForm'
import KanbanBoard from '../components/KanbanBoard'

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
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Task Manager</h1>
        <p>Organize your tasks using a Kanban board.</p>

        {loading && <p>Loading tasks...</p>}

        {error && (
          <p role="alert" className="auth-error">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="task-overview">
              <h2>Task Overview</h2>
              <p>Total Tasks: {tasks.length}</p>
              <p>To Do: {todoCount}</p>
              <p>In Progress: {inProgressCount}</p>
              <p>Done: {doneCount}</p>
            </div>

            <TaskForm
              key={editingTask?._id || 'new'}
              taskToEdit={editingTask}
              onTaskAdded={handleTaskAdded}
              onTaskUpdated={handleTaskUpdated}
              onCancelEdit={() => setEditingTask(null)}
            />

            {actionError && (
              <p role="alert" className="auth-error">
                {actionError}
              </p>
            )}

            <KanbanBoard
              tasks={tasks}
              onEdit={(task) => {
                setActionError('')
                setEditingTask(task)
              }}
              onDelete={handleDelete}
              onMove={handleMove}
              busyTaskId={busyTaskId}
            />
          </>
        )}

        <p className="auth-footer">
          <Link to="/dashboard">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  )
}

export default Tasks
