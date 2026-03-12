import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(username, password)

    if (result.success) {
      navigate('/compliance')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm px-8 py-10">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-3">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-heading font-bold text-lg">TapTap Send</h1>
            <span className="text-accent text-sm font-medium">AI Platform</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-heading text-xl font-semibold">Welcome back</h2>
            <p className="text-muted text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-heading text-sm
                  placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                  transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-heading text-sm
                  placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                  transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-full bg-heading text-white text-sm font-medium
                hover:bg-heading/90 focus:outline-none focus:ring-2 focus:ring-heading/30 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
