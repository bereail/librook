import { useState, useEffect } from 'react'
import { api } from '../api'
import styles from './AdminPage.module.css'

interface UserRow {
  id: string
  email: string
  created_at: string
  book_count: number
}

interface BookRow {
  title: string
  author: string | null
  start_date: string | null
  end_date: string | null
  score: number | null
  created_at: string
}

function bookStatus(b: BookRow) {
  if (b.end_date) return 'Leído'
  if (b.start_date) return 'Leyendo'
  return 'Pendiente'
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<UserRow[]>([])
  const [books, setBooks] = useState<Record<string, BookRow[]>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/users')
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (userId: string) => {
    if (expanded === userId) { setExpanded(null); return }
    setExpanded(userId)
    if (!books[userId]) {
      try {
        const data = await api.get(`/admin/users/${userId}/books`)
        setBooks(prev => ({ ...prev, [userId]: data }))
      } catch { /* ignore */ }
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <h1 className={styles.title}>Panel Admin</h1>
        {!loading && !error && (
          <span className={styles.badge}>{users.length} usuarios</span>
        )}
      </header>

      <main className={styles.main}>
        {loading && <p className={styles.msg}>Cargando...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className={styles.msg}>No hay usuarios registrados.</p>
        )}

        {users.map(u => (
          <div key={u.id} className={styles.card}>
            <button className={styles.userRow} onClick={() => toggleUser(u.id)}>
              <div className={styles.userInfo}>
                <span className={styles.email}>{u.email}</span>
                <span className={styles.meta}>
                  Registrado el {fmt(u.created_at)}
                  {' · '}
                  {u.book_count} {u.book_count === 1 ? 'libro' : 'libros'}
                </span>
              </div>
              <svg
                className={`${styles.chevron} ${expanded === u.id ? styles.open : ''}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {expanded === u.id && (
              <div className={styles.bookList}>
                {!books[u.id] ? (
                  <p className={styles.msgSm}>Cargando libros...</p>
                ) : books[u.id].length === 0 ? (
                  <p className={styles.msgSm}>Sin libros cargados.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Autor/a</th>
                        <th>Estado</th>
                        <th>Puntaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books[u.id].map((b, i) => (
                        <tr key={i}>
                          <td>{b.title}</td>
                          <td>{b.author || '—'}</td>
                          <td>{bookStatus(b)}</td>
                          <td>{b.score != null ? `${b.score}/10` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
