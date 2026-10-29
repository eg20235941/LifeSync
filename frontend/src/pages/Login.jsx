
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'
  function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
      })

      if (response.data.success) {
        const { user, token } = response.data.data

       login(user, token)

        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Welcome Back</h1>
        <p>Login to continue managing your student life.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create Account</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
