import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import LoginPage from './pages/LoginPage'
import LibraryMain from './LibraryMain'

export default function App() {
  const { user, login, register, resetPassword, logout } = useAuth()
  const { dark, toggle: toggleTheme } = useTheme()

  if (!user) {
    return <LoginPage onLogin={login} onRegister={register} onResetPassword={resetPassword} />
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
