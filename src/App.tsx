import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import LoginPage from './pages/LoginPage'
import LibraryMain from './LibraryMain'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  const { user, login, register, forgotPassword, resetPassword, logout } = useAuth()
  const { dark, toggle: toggleTheme } = useTheme()

  const [resetToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('reset_token')
  })

  const handleResetDone = () => {
    window.history.replaceState({}, '', window.location.pathname)
    window.location.reload()
  }

  if (resetToken) {
    return <ResetPasswordPage token={resetToken} onReset={resetPassword} onDone={handleResetDone} />
  }

  if (!user) {
    return <LoginPage onLogin={login} onRegister={register} onForgotPassword={forgotPassword} />
  }

  return (
    <LibraryMain
      user={user}
      onLogout={logout}
      dark={dark}
      onToggleTheme={toggleTheme}
    />
  )
}
