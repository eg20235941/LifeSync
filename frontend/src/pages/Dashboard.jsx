
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext.js'

function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Welcome, {user?.name || 'Student'}!</h1>

        <p>
          Your personal student productivity dashboard.
        </p>

        <div className="dashboard-user-info">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <button
          type="button"
          className="auth-button logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
        <div className="dashboard-user-info">
  <h2>LifeSync Modules</h2>
  <p>
    <Link to="/expenses">Expense Tracker</Link>
  </p>
</div>
      </section>
    </main>
  )
}

export default Dashboard
