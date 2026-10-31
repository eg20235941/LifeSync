
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExpenses } from '../api/expenseApi'
import { getTasks } from '../api/taskApi'
import { getAcademicGPA } from '../api/academicApi'
import './Dashboard.css'

const formatCurrency = (amount) =>
  `LKR ${Number(amount || 0).toLocaleString('en-LK', {
    maximumFractionDigits: 2,
  })}`

const getMonthKey = (date) => {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return null

  return `${parsedDate.getFullYear()}-${String(
    parsedDate.getMonth() + 1
  ).padStart(2, '0')}`
}

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [tasks, setTasks] = useState([])
  const [gpaData, setGpaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Keep the current time updated
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [expenseData, taskData, academicData] =
          await Promise.all([
            getExpenses(),
            getTasks(),
            getAcademicGPA(),
          ])

        setExpenses(expenseData)
        setTasks(taskData)
        setGpaData(academicData)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load dashboard information.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const currentHour = now.getHours()

  const greeting =
    currentHour < 12
      ? 'morning'
      : currentHour < 17
        ? 'afternoon'
        : 'evening'

  const currentMonthKey = getMonthKey(now)

  const currentMonthExpenses = expenses.filter(
    (item) => getMonthKey(item.date) === currentMonthKey
  )

  const totalIncome = currentMonthExpenses
    .filter((item) => item.type === 'income')
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    )

  const totalExpenses = currentMonthExpenses
    .filter((item) => item.type === 'expense')
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    )

  const pendingTasks = tasks.filter(
    (task) => task.status === 'todo'
  ).length

  const taskCounts = {
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter(
      (task) => task.status === 'in_progress'
    ).length,
    done: tasks.filter((task) => task.status === 'done').length,
  }

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    )

    const monthKey = getMonthKey(date)

    const monthTransactions = expenses.filter(
      (item) => getMonthKey(item.date) === monthKey
    )

    return {
      month: date.toLocaleDateString('en-US', {
        month: 'short',
      }),
      income: monthTransactions
        .filter((item) => item.type === 'income')
        .reduce(
          (total, item) => total + Number(item.amount || 0),
          0
        ),
      expense: monthTransactions
        .filter((item) => item.type === 'expense')
        .reduce(
          (total, item) => total + Number(item.amount || 0),
          0
        ),
    }
  })

  const maxChartValue = Math.max(
    ...chartData.flatMap((item) => [
      item.income,
      item.expense,
    ]),
    1
  )

  const userName =
    JSON.parse(localStorage.getItem('lifesync_user') || 'null')
      ?.name || 'Student'

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading your dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-message dashboard-error">
        {error}
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard heading */}

      <section className="dashboard-heading">
        <div>
          <h1>
            Good {greeting}, {userName}!
          </h1>

          <p>Here's an overview of your student life.</p>
        </div>

        <div className="dashboard-tag">
          ✦ &nbsp; Your productivity space
        </div>
      </section>

      {/* Summary cards */}

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-icon income-icon">↗</div>
          <div>
            <p>Total Income</p>
            <h2>{formatCurrency(totalIncome)}</h2>
            <span>This month</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon expense-icon">↘</div>
          <div>
            <p>Total Expenses</p>
            <h2>{formatCurrency(totalExpenses)}</h2>
            <span>This month</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon task-icon">✓</div>
          <div>
            <p>Pending Tasks</p>
            <h2>{pendingTasks}</h2>
            <span>Tasks to do</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon gpa-icon">✧</div>
          <div>
            <p>Current GPA</p>
            <h2>
              {gpaData?.cgpa == null
                ? 'N/A'
                : Number(gpaData.cgpa).toFixed(2)}
            </h2>
            <span>Overall CGPA</span>
          </div>
        </div>
      </section>

      {/* Dashboard charts */}

      <section className="dashboard-overview">
        <div className="dashboard-panel expense-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Expense Overview</h2>
              <p>Income and expenses at a glance</p>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-income" /> Income
              </span>
              <span>
                <i className="legend-expense" /> Expenses
              </span>
            </div>
          </div>

          <div className="expense-chart">
            <div className="chart-grid">
              {chartData.map((item) => (
                <div className="chart-month" key={item.month}>
                  <div className="chart-bars">
                    <div
                      className="chart-bar income-bar"
                      style={{
                        height: `${(item.income / maxChartValue) * 100}%`,
                      }}
                      title={`Income: ${formatCurrency(item.income)}`}
                    />

                    <div
                      className="chart-bar expense-bar"
                      style={{
                        height: `${(item.expense / maxChartValue) * 100}%`,
                      }}
                      title={`Expenses: ${formatCurrency(item.expense)}`}
                    />
                  </div>

                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task progress */}

        <div className="dashboard-panel task-progress-panel">
          <div className="panel-heading">
            <div>
              <h2>Task Progress</h2>
              <p>Your current task distribution</p>
            </div>
          </div>

          <div className="task-progress-list">
            <div className="progress-item">
              <span>To Do</span>
              <div className="progress-track">
                <div
                  className="progress-fill todo-fill"
                  style={{
                    width: `${tasks.length
                      ? (taskCounts.todo / tasks.length) * 100
                      : 0}%`,
                  }}
                />
              </div>
              <strong>{taskCounts.todo}</strong>
            </div>

            <div className="progress-item">
              <span>In Progress</span>
              <div className="progress-track">
                <div
                  className="progress-fill in-progress-fill"
                  style={{
                    width: `${tasks.length
                      ? (taskCounts.inProgress / tasks.length) * 100
                      : 0}%`,
                  }}
                />
              </div>
              <strong>{taskCounts.inProgress}</strong>
            </div>

            <div className="progress-item">
              <span>Done</span>
              <div className="progress-track">
                <div
                  className="progress-fill done-fill"
                  style={{
                    width: `${tasks.length
                      ? (taskCounts.done / tasks.length) * 100
                      : 0}%`,
                  }}
                />
              </div>
              <strong>{taskCounts.done}</strong>
            </div>
          </div>

          <div className="dashboard-quick-links">
            <Link to="/expenses">View Expenses</Link>
            <Link to="/tasks">View Tasks</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
