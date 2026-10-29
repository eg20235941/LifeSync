
import { useState } from 'react'
import { createExpense, updateExpense } from '../api/expenseApi'

const getInitialForm = (expense) => ({
  type: expense?.type || 'expense',
  amount: expense?.amount?.toString() || '',
  category: expense?.category || '',
  description: expense?.description || '',
  date: expense?.date
    ? expense.date.slice(0, 10)
    : new Date().toLocaleDateString('en-CA'),
})

function ExpenseForm({
  expenseToEdit = null,
  onExpenseAdded,
  onExpenseUpdated,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(
    () => getInitialForm(expenseToEdit)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = Boolean(expenseToEdit)

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

    const amount = Number(formData.amount)

    if (!Number.isFinite(amount) || amount < 0.01) {
      setError('Amount must be at least Rs. 0.01')
      return
    }

    setLoading(true)

    const transactionData = {
      type: formData.type,
      amount,
      category: formData.category.trim(),
      description: formData.description.trim(),
      date: formData.date,
    }

    try {
      if (isEditing) {
        const updatedExpense = await updateExpense(
          expenseToEdit._id,
          transactionData
        )

        onExpenseUpdated(updatedExpense)
      } else {
        const newExpense = await createExpense(transactionData)

        onExpenseAdded(newExpense)
        setFormData(getInitialForm(null))
        setSuccess('Transaction saved successfully!')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to save transaction.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="expense-form-card">
      <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="type">Transaction Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label htmlFor="amount">Amount (LKR)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount in Rs."
          required
        />

        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          maxLength={50}
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Food, Transport, Salary"
          required
        />

        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          maxLength={500}
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter transaction details"
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="auth-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : isEditing
              ? 'Update Transaction'
              : 'Save Transaction'}
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

export default ExpenseForm
