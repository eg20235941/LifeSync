
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
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

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match')
    return
  }

  setLoading(true)

  try {
    const response = await api.post('/auth/register', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    })

    if (response.data.success) {
      setSuccess('Registration successful! You can now log in.')

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        'Registration failed. Please try again.'
    )
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>
        <h1>Create Account</h1>

        <p>Start managing your student life with LifeSync.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {error && <p role="alert" className="auth-error">{error}</p>}
          {success && <p role="status" className="auth-success">{success}</p>}

          <button
  type="submit"
  className="auth-button"
  disabled={loading}
>
  {loading ? 'Creating Account...' : 'Create Account'}
</button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
