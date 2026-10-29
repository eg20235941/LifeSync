
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import api from '../api/axios'


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('lifesync_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          setUser(response.data.data.user)
        }
      } catch {
        localStorage.removeItem('lifesync_token')
        localStorage.removeItem('lifesync_user')
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('lifesync_token', token)
    localStorage.setItem('lifesync_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('lifesync_token')
    localStorage.removeItem('lifesync_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
