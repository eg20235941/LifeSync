import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Login</h1>

        <p>
          Sign in to access your LifeSync dashboard.
        </p>
        <p>
  Don't have an account?{' '}
  <Link to="/register">Create Account</Link>
</p>
      </section>
    </main>
  )
}

export default Login
