
import { useContext, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext.js'
import Sidebar from './Sidebar'
import './AppLayout.css'

function AppLayout() {
  const { user } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const pageNames = {
    '/dashboard': 'Dashboard',
    '/expenses': 'Expenses',
    '/tasks': 'Tasks',
    '/academic': 'Academic Hub',
  }

  const currentPage = pageNames[location.pathname] || 'Dashboard'

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />

      <main className="main-layout">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>

            <span className="breadcrumb">
              Workspace / <strong>{currentPage}</strong>
            </span>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>

            <div className="user-details">
              <strong>{user?.name || 'Student'}</strong>
              <span>{user?.email || ''}</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
