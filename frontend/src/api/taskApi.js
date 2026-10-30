
import api from './axios'

// Attach the JWT token to authenticated requests
const getAuthConfig = () => {
  const token = localStorage.getItem('lifesync_token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// GET /api/tasks
// Retrieve all tasks belonging to the logged-in user
export const getTasks = async () => {
  const response = await api.get('/tasks', getAuthConfig())

  return response.data.data.tasks
}

// GET /api/tasks/:id
// Retrieve one task
export const getTaskById = async (id) => {
  const response = await api.get(
    `/tasks/${id}`,
    getAuthConfig()
  )

  return response.data.data.task
}

// POST /api/tasks
// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post(
    '/tasks',
    taskData,
    getAuthConfig()
  )

  return response.data.data.task
}

// PUT /api/tasks/:id
// Update an existing task
export const updateTask = async (id, taskData) => {
  const response = await api.put(
    `/tasks/${id}`,
    taskData,
    getAuthConfig()
  )

  return response.data.data.task
}

// DELETE /api/tasks/:id
// Delete an existing task
export const deleteTask = async (id) => {
  const response = await api.delete(
    `/tasks/${id}`,
    getAuthConfig()
  )

  return response.data.data.deletedId
}

// Move a task to another Kanban column
export const updateTaskStatus = async (id, status) => {
  return updateTask(id, { status })
}
