import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = onLogin(email, password)
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.decoration}>
          <div className={styles.bookStack}>
            <div className={styles.book} style={{ '--c': '#2d4a3e', '--r': '-8deg', '--t': '0px' }} />
            <div className={styles.book} style={{ '--c': '#c9a84c', '--r': '3deg', '--t': '-12px' }} />
            <div className={styles.book} style={{ '--c': '#1a3a5c', '--r': '-2deg', '--t': '-24px' }} />
            <div className={styles.book} style={{ '--c': '#4a2040', '--r': '6deg', '--t': '-36px' }} />
          </div>
        </div>
        <div className={styles.leftContent}>
          <h1 className={styles.brand}>Librook</h1>
          <p className={styles.tagline}>Tu biblioteca personal, siempre contigo.</p>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h2 className={styles.welcome}>Bienvenida</h2>
            <p className={styles.subtitle}>Iniciá sesión para ver tu biblioteca</p>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="lector@librook.com"
                required
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Contraseña</label>
              <input
                id="password"
                className={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Ingresar'}
            </button>
          </div>

          <p className={styles.hint}>
            Demo: <span>lector@librook.com</span> / <span>1234</span>
          </p>
        </form>
      </div>
    </div>
  )
}
