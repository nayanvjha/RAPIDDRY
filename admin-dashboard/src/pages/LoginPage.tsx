import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-forest-dark)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--color-white)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0px 24px 64px rgba(15,46,42,0.20)',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div
            className="font-display"
            style={{
              color: 'var(--color-gold)',
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            RAPIDRY
          </div>
          <div
            className="font-body"
            style={{
              color: 'var(--color-muted)',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            Admin Portal
          </div>
        </div>

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          required
          style={{
            width: '100%',
            height: '48px',
            border: '1.5px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            marginBottom: '12px',
            color: 'var(--color-dark)',
          }}
        />

        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          style={{
            width: '100%',
            height: '48px',
            border: '1.5px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            marginBottom: '24px',
            color: 'var(--color-dark)',
          }}
        />

        {error ? (
          <p
            className="font-body"
            style={{
              marginTop: '-10px',
              marginBottom: '14px',
              fontSize: '13px',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </p>
        ) : null}

        <button
          disabled={isLoading}
          type="submit"
          className="font-body"
          style={{
            width: '100%',
            height: '48px',
            border: 'none',
            borderRadius: '999px',
            background: 'var(--color-gold)',
            color: 'var(--color-dark)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.9 : 1,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(event) => {
            if (!isLoading) {
              event.currentTarget.style.opacity = '0.9'
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.opacity = isLoading ? '0.9' : '1'
          }}
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
