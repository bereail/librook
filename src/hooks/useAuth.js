import { useState } from 'react'

const DEMO_USER = { email: 'lector@librook.com', password: '1234' }
const AUTH_KEY = 'librook_auth'

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = { email }
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData))
      setUser(userData)
      return { ok: true }
    }
    return { ok: false, error: 'Email o contraseña incorrectos' }
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return { user, login, logout }
}
