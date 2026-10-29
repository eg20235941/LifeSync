
import { Link } from 'react-router-dom'

function Register() {
  return (
    <main className="app-container">
      <section className="welcome-card">
        <div className="app-name">LIFESYNC</div>

        <h1>Create Account</h1>

        <p>
          Create your LifeSync account to manage
          your academic and daily activities.
        </p>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
