import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin, onRegister, onResetPassword }) {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const esRegistro = modo === 'registro'
  const esRecuperar = modo === 'recuperar'

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirm('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (esRegistro || esRecuperar) {
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      if (password !== confirm) {
        setError('Las contraseñas no coinciden')
        return
      }
    }

    setLoading(true)

    if (esRecuperar) {
      const result = await onResetPassword(email, password)
      setLoading(false)
      if (!result.ok) {
        setError(result.error)
      } else {
        setSuccess('Contraseña actualizada. Ya podés iniciar sesión.')
        setPassword('')
        setConfirm('')
      }
      return
    }

    const result = await (esRegistro ? onRegister(email, password) : onLogin(email, password))
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
    }
  }

  const titulo = esRegistro ? 'Crear cuenta'
    : esRecuperar ? 'Recuperar contraseña'
    : 'Bienvenida'

  const subtitulo = esRegistro ? 'Registrate para empezar tu biblioteca'
    : esRecuperar ? 'Ingresá tu email y una contraseña nueva'
    : 'Iniciá sesión para ver tu biblioteca'

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
          <p className={styles.tagline}>Tu biblioteca personal.</p>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formHeader}>
            <h2 className={styles.welcome}>{titulo}</h2>
            <p className={styles.subtitle}>{subtitulo}</p>
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
                placeholder="vos@ejemplo.com"
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            {!esRecuperar && (
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
                  autoComplete={esRegistro ? 'new-password' : 'current-password'}
                />
              </div>
            )}

            {(esRegistro || esRecuperar) && (
              <>
                {esRecuperar && (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">Contraseña nueva</label>
                    <input
                      id="password"
                      className={styles.input}
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                )}
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirm">
                    {esRecuperar ? 'Repetir contraseña nueva' : 'Repetir contraseña'}
                  </label>
                  <input
                    id="confirm"
                    className={styles.input}
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            {!success && (
              <button className={styles.btn} type="submit" disabled={loading}>
                {loading ? <span className={styles.spinner} />
                  : esRegistro ? 'Crear cuenta'
                  : esRecuperar ? 'Cambiar contraseña'
                  : 'Ingresar'}
              </button>
            )}

            {success && (
              <button
                type="button"
                className={styles.btn}
                onClick={() => cambiarModo('login')}
              >
                Ir al inicio de sesión
              </button>
            )}
          </div>

          <div className={styles.links}>
            {!esRegistro && !esRecuperar && (
              <button type="button" className={styles.toggleBtn} onClick={() => cambiarModo('recuperar')}>
                Olvidé mi contraseña
              </button>
            )}
            {esRecuperar && (
              <button type="button" className={styles.toggleBtn} onClick={() => cambiarModo('login')}>
                Volver al inicio de sesión
              </button>
            )}
            <p className={styles.toggle}>
              {esRegistro ? (
                <>¿Ya tenés cuenta?{' '}
                  <button type="button" className={styles.toggleBtn} onClick={() => cambiarModo('login')}>
                    Iniciá sesión
                  </button>
                </>
              ) : !esRecuperar ? (
                <>¿No tenés cuenta?{' '}
                  <button type="button" className={styles.toggleBtn} onClick={() => cambiarModo('registro')}>
                    Registrate
                  </button>
                </>
              ) : null}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
