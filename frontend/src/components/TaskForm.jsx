
import { useState } from 'react'
import { createTask, updateTask } from '../api/taskApi'

const getInitialForm = (task) => ({
  title: task?.title || '',
  description: task?.description || '',
  priority: task?.priority || 'medium',
  dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  status: task?.status || 'todo',
})

function TaskForm({
  taskToEdit = null,
  onTaskAdded,
  onTaskUpdated,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(
    () => getInitialForm(taskToEdit)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = Boolean(taskToEdit)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const title = formData.title.trim()

    if (!title) {
      setError('Task title is required.')
      return
    }

    const taskData = {
      title,
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || null,
    }

    setLoading(true)

    try {
      if (isEditing) {
        const updatedTask = await updateTask(
          taskToEdit._id,
          taskData
        )
        onTaskUpdated(updatedTask)
      } else {
        const newTask = await createTask(taskData)
        onTaskAdded(newTask)
        setFormData(getInitialForm(null))
        setSuccess('Task created successfully!')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to save task.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-card">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="task-title">Task Title</label>
        <input
          id="task-title"
          name="title"
          type="text"
          maxLength={150}
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          maxLength={1000}
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label htmlFor="task-due-date">Due Date</label>
        <input
          id="task-due-date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {error && (
          <p role="alert" className="auth-error">{error}</p>
        )}

        {success && (
          <p role="status" className="task-success">{success}</p>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : isEditing
              ? 'Update Task'
              : 'Create Task'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="expense-cancel-button"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancel Editing
          </button>
        )}
      </form>
    </div>
  )
}

export default TaskForm
