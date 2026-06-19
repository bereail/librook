import { useState } from 'react'

const USERS_KEY = 'librook_users'
const AUTH_KEY = 'librook_auth'

async function hashPassword(email, password) {
  const data = new TextEncoder().encode(email + ':' + password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const register = async (email, password) => {
    const key = email.toLowerCase().trim()
    const users = loadUsers()
    if (users[key]) return { ok: false, error: 'Ya existe una cuenta con ese email' }
    const passwordHash = await hashPassword(key, password)
    users[key] = { email: key, passwordHash }
    saveUsers(users)
    const userData = { email: key }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    setUser(userData)
    return { ok: true }
  }

  const login = async (email, password) => {
    const key = email.toLowerCase().trim()
    const users = loadUsers()
    const found = users[key]
    if (!found) return { ok: false, error: 'Email o contraseña incorrectos' }
    const passwordHash = await hashPassword(key, password)
    if (passwordHash !== found.passwordHash) return { ok: false, error: 'Email o contraseña incorrectos' }
    const userData = { email: key }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    setUser(userData)
    return { ok: true }
  }

  const resetPassword = async (email, newPassword) => {
    const key = email.toLowerCase().trim()
    const users = loadUsers()
    if (!users[key]) return { ok: false, error: 'No existe una cuenta con ese email' }
    const passwordHash = await hashPassword(key, newPassword)
    users[key] = { ...users[key], passwordHash }
    saveUsers(users)
    return { ok: true }
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return { user, login, register, resetPassword, logout }
}
