import { useEffect, useState } from 'react'
import { getExpenses, deleteExpense } from '../api/expenseApi'
import ExpenseForm from '../components/ExpenseForm'
import './Expenses.css'

const formatCurrency = (amount) =>
  `LKR ${Number(amount || 0).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

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
    .reduce((total, item) => total + Number(item.amount || 0), 0)

  const totalExpenses = expenses
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount || 0), 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="expenses-page">
      {/* Page heading */}

      <section className="expenses-heading">
        <div>
          <h1>Expense Tracker</h1>
          <p>Keep track of your income and spending.</p>
        </div>

        <div className="expenses-heading-tag">
          ◈ &nbsp; Personal Finance
        </div>
      </section>

      {loading && (
        <div className="expenses-message">
          Loading your transactions...
        </div>
      )}

      {error && (
        <div role="alert" className="expenses-message expenses-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Financial summary */}

          <section className="expenses-summary">
            <div className="expenses-summary-card">
              <div className="expenses-summary-icon income-summary-icon">
                ↗
              </div>

              <div>
                <p>Total Income</p>
                <h2>{formatCurrency(totalIncome)}</h2>
                <span>All recorded income</span>
              </div>
            </div>

            <div className="expenses-summary-card">
              <div className="expenses-summary-icon expense-summary-icon">
                ↘
              </div>

              <div>
                <p>Total Expenses</p>
                <h2>{formatCurrency(totalExpenses)}</h2>
                <span>All recorded expenses</span>
              </div>
            </div>

            <div className="expenses-summary-card">
              <div className="expenses-summary-icon balance-summary-icon">
                ⇄
              </div>

              <div>
                <p>Current Balance</p>
                <h2 className={balance < 0 ? 'negative-balance' : ''}>
                  {formatCurrency(balance)}
                </h2>
                <span>Income minus expenses</span>
              </div>
            </div>
          </section>

          {/* Form and transaction history */}

          <section className="expenses-content">
            <div className="expenses-form-panel">
              <div className="expenses-section-heading">
                <h2>
                  {editingExpense
                    ? 'Edit Transaction'
                    : 'Add a Transaction'}
                </h2>

                <p>
                  {editingExpense
                    ? 'Update your transaction details.'
                    : 'Record your income or expenses.'}
                </p>
              </div>

              <ExpenseForm
                key={editingExpense?._id || 'new'}
                expenseToEdit={editingExpense}
                onExpenseAdded={handleExpenseAdded}
                onExpenseUpdated={handleExpenseUpdated}
                onCancelEdit={() => setEditingExpense(null)}
              />
            </div>

            <div className="expenses-history-panel">
              <div className="expenses-section-heading history-heading">
                <div>
                  <h2>Transaction History</h2>
                  <p>Review your recorded transactions.</p>
                </div>

                <span className="transaction-count">
                  {expenses.length} transaction(s)
                </span>
              </div>

              {actionError && (
                <p role="alert" className="expenses-action-error">
                  {actionError}
                </p>
              )}

              {expenses.length === 0 ? (
                <div className="expenses-empty-state">
                  <div className="empty-state-icon">◈</div>
                  <h3>No transactions yet</h3>
                  <p>
                    Add your first income or expense using the form.
                  </p>
                </div>
              ) : (
                <div className="expenses-transaction-list">
                  {expenses.map((item) => (
                    <div
                      className="expenses-transaction-item"
                      key={item._id}
                    >
                      <div className="transaction-main">
                        <div
                          className={`transaction-type-icon ${
                            item.type === 'income'
                              ? 'transaction-income-icon'
                              : 'transaction-expense-icon'
                          }`}
                        >
                          {item.type === 'income' ? '↗' : '↘'}
                        </div>

                        <div className="transaction-details">
                          <h3>{item.category}</h3>

                          <p>
                            {item.description || 'No description'}
                          </p>

                          <div className="transaction-meta">
                            <span>{formatDate(item.date)}</span>
                            <span
                              className={`transaction-type-label ${
                                item.type === 'income'
                                  ? 'income-label'
                                  : 'expense-label'
                              }`}
                            >
                              {item.type === 'income'
                                ? 'Income'
                                : 'Expense'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="transaction-right">
                        <strong
                          className={
                            item.type === 'income'
                              ? 'income-text'
                              : 'expense-text'
                          }
                        >
                          {item.type === 'income' ? '+' : '-'}
                          {formatCurrency(item.amount)}
                        </strong>

                        <div className="transaction-buttons">
                          <button
                            type="button"
                            className="transaction-edit-button"
                            onClick={() => {
                              setActionError('')
                              setEditingExpense(item)
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="transaction-delete-button"
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
          </section>
        </>
      )}
    </div>
  )
}

export default Expenses