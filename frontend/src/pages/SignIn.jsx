import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Brand from '../components/Brand.jsx'
import SocialButton from '../components/SocialButton.jsx'
import TextField from '../components/TextField.jsx'
import { FacebookIcon, GoogleIcon } from '../components/Icons.jsx'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => {
    if (!touched) return {}
    return {
      email:
        email.trim().length === 0
          ? 'Email is required.'
          : !isValidEmail(email)
            ? 'Enter a valid email.'
            : '',
      password: password.length === 0 ? 'Password is required.' : '',
    }
  }, [email, password, touched])

  async function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (errors.email || errors.password) return

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 550))
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="authShell">
      <aside className="authSide">
        <div className="authSideInner">
          <Brand />
          <h1 className="authSideTitle">Welcome back.</h1>
          <p className="authSideText">
            Sign in to continue your orders, favorites, and saved addresses. Designed to be
            quick on mobile and comfortable on desktop.
          </p>
          <div className="feature">
            <div className="featureTitle">Tip</div>
            <p className="featureText">
              You can plug in real auth later (Firebase, Auth0, your API) without changing
              this UI.
            </p>
          </div>
        </div>
      </aside>

      <main className="authMain">
        <section className="authCard" aria-label="Sign in">
          <Brand />

          <h2 className="authTitle" style={{ marginTop: 14 }}>
            Sign in
          </h2>
          <p className="authHint">Use email & password, or continue with Google/Facebook.</p>

          <div className="socialRow">
            <SocialButton
              provider="Google"
              icon={<GoogleIcon />}
              onClick={() => alert('Connect Google sign-in here.')}
            />
            <SocialButton
              provider="Facebook"
              icon={<FacebookIcon />}
              onClick={() => alert('Connect Facebook sign-in here.')}
            />
          </div>

          <div className="divider">or</div>

          <form className="form" onSubmit={onSubmit}>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              right={
                <Link to="/signin" className="label">
                  Forgot password?
                </Link>
              }
              error={errors.password}
            />

            <button className="btn btnPrimary" disabled={submitting} type="submit">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="finePrint">
              New here? <Link to="/signup">Create an account</Link>.
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

