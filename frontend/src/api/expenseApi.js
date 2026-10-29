
import api from './axios'

// Get the JWT token saved during login
const getAuthConfig = () => {
  const token = localStorage.getItem('lifesync_token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// GET /api/expenses
export const getExpenses = async () => {
  const response = await api.get('/expenses', getAuthConfig())
  return response.data.data.expenses
}

// GET /api/expenses/:id
export const getExpenseById = async (id) => {
  const response = await api.get(
    `/expenses/${id}`,
    getAuthConfig()
  )

  return response.data.data.expense
}

// POST /api/expenses
export const createExpense = async (expenseData) => {
  const response = await api.post(
    '/expenses',
    expenseData,
    getAuthConfig()
  )

  return response.data.data.expense
}

// PUT /api/expenses/:id
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(
    `/expenses/${id}`,
    expenseData,
    getAuthConfig()
  )

  return response.data.data.expense
}

// DELETE /api/expenses/:id
export const deleteExpense = async (id) => {
  const response = await api.delete(
    `/expenses/${id}`,
    getAuthConfig()
  )

  return response.data.data.deletedId
}
    