
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExpenses, deleteExpense } from '../api/expenseApi'
import ExpenseForm from '../components/ExpenseForm'

const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses()
        setExpenses(data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load transactions.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const handleExpenseAdded = (newExpense) => {
    setExpenses((previous) => [newExpense, ...previous])
  }

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses((previous) =>
      previous.map((item) =>
        item._id === updatedExpense._id ? updatedExpense : item
      )
    )
    setEditingExpense(null)
  }

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `Delete the ${expense.category} transaction?`
    )

    if (!confirmed) return

    setActionError('')
    setDeletingId(expense._id)

    try {
      await deleteExpense(expense._id)

      setExpenses((previous) =>
        previous.filter((item) => item._id !== expense._id)
      )

      if (editingExpense?._id === expense._id) {
        setEditingExpense(null)
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to delete transaction.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const totalIncome = expenses
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)

  const totalExpenses = expenses
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Expense Tracker</h1>
        <p>Manage your income and expenses in LKR.</p>

        {loading && <p>Loading transactions...</p>}

        {error && (
          <p role="alert" className="auth-error">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="expense-summary">
              <div className="summary-card">
                <h3>Total Income</h3>
                <p className="income-text">
                  {formatCurrency(totalIncome)}
                </p>
              </div>

              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p className="expense-text">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>

              <div className="summary-card">
                <h3>Current Balance</h3>
                <p className={
                  balance < 0 ? 'expense-text' : 'income-text'
                }>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>

            <ExpenseForm
              key={editingExpense?._id || 'new'}
              expenseToEdit={editingExpense}
              onExpenseAdded={handleExpenseAdded}
              onExpenseUpdated={handleExpenseUpdated}
              onCancelEdit={() => setEditingExpense(null)}
            />

            <div className="transaction-section">
              <h2>Transaction History</h2>
              <p>{expenses.length} transaction(s)</p>

              {actionError && (
                <p role="alert" className="auth-error">
                  {actionError}
                </p>
              )}

              {expenses.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <div className="transaction-list">
                  {expenses.map((item) => (
                    <div
                      className="transaction-item"
                      key={item._id}
                    >
                      <div>
                        <h3>{item.category}</h3>
                        <p>
                          {item.description || 'No description'}
                        </p>
                        <small>{formatDate(item.date)}</small>
                      </div>

                      <div className="transaction-actions">
                        <strong className={
                          item.type === 'income'
                            ? 'income-text'
                            : 'expense-text'
                        }>
                          {item.type === 'income' ? '+' : '-'}
                          {formatCurrency(item.amount)}
                        </strong>

                        <div className="transaction-buttons">
                          <button
                            type="button"
                            onClick={() => {
                              setActionError('')
                              setEditingExpense(item)
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                          >
                            {deletingId === item._id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <p className="auth-footer">
          <Link to="/dashboard">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  )
}

export default Expenses
