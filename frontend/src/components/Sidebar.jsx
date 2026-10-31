
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

function Sidebar({ isOpen, closeSidebar }) {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '▦' },
    { name: 'Expenses', path: '/expenses', icon: '◈' },
    { name: 'Tasks', path: '/tasks', icon: '☷' },
    { name: 'Academic Hub', path: '/academic', icon: '⌂' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">▣</span>
          <span>LifeSync</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p>Your personal student workspace.</p>
          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>↪</span> Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
