
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext.js'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <p>Checking your session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
