import { useMemo, useState } from 'react'
import styles from './StatsModal.module.css'

function calcularStats(books) {
  const currentYear = new Date().getFullYear()
  const leidos = books.filter(b => b.endDate)
  const leyendo = books.filter(b => b.startDate && !b.endDate)
  const pendientes = books.filter(b => !b.startDate && !b.endDate)

  const scored = leidos.filter(b => b.score > 0)
  const avgScore = scored.length
    ? scored.reduce((s, b) => s + b.score, 0) / scored.length
    : null

  const byYear = {}
  leidos.forEach(b => {
    const y = b.endDate.slice(0, 4)
    byYear[y] = (byYear[y] || 0) + 1
  })
  const years = Object.entries(byYear)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .slice(0, 5)
  const maxInYear = Math.max(...years.map(([, n]) => n), 1)

  const authorCount = {}
  books.forEach(b => { if (b.author) authorCount[b.author] = (authorCount[b.author] || 0) + 1 })
  const topAuthors = Object.entries(authorCount).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const genreCount = {}
  books.forEach(b => { if (b.genre) genreCount[b.genre] = (genreCount[b.genre] || 0) + 1 })
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const reads = leidos
    .filter(b => b.startDate)
    .map(b => ({
      ...b,
      days: Math.max(1, Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / 86400000)),
    }))
    .sort((a, b) => a.days - b.days)

  const totalPages = books.reduce((s, b) => s + (Number(b.totalPages) || 0), 0)
  const bestRated = [...leidos].filter(b => b.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)
  const thisYear = leidos.filter(b => b.endDate?.startsWith(String(currentYear))).length

  return {
    total: books.length,
    leidos: leidos.length,
    leyendo: leyendo.length,
    pendientes: pendientes.length,
    avgScore,
    years,
    maxInYear,
    topAuthors,
    topGenres,
    fastest: reads[0] || null,
    slowest: reads[reads.length - 1] || null,
    totalPages,
    bestRated,
    thisYear,
  }
}

function Stars({ value }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ opacity: i <= Math.round(value) ? 1 : 0.2 }}>★</span>
      ))}
    </span>
  )
}

export default function StatsModal({ books, goal, onUpdateGoal, onClose }) {
  const s = useMemo(() => calcularStats(books), [books])
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(goal?.count || 0))
  const currentYear = new Date().getFullYear()

  const formatDays = (d) => d === 1 ? '1 día' : `${d} días`

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Estadísticas</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.scroll}>

          {/* Resumen */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen</h3>
            <div className={styles.bigNumbers}>
              <div className={styles.bigNum}>
                <span className={styles.numValue}>{s.total}</span>
                <span className={styles.numLabel}>Total</span>
              </div>
              <div className={`${styles.bigNum} ${styles.numFinished}`}>
                <span className={styles.numValue}>{s.leidos}</span>
                <span className={styles.numLabel}>Leídos</span>
              </div>
              <div className={`${styles.bigNum} ${styles.numReading}`}>
                <span className={styles.numValue}>{s.leyendo}</span>
                <span className={styles.numLabel}>Leyendo</span>
              </div>
              <div className={styles.bigNum}>
                <span className={styles.numValue}>{s.pendientes}</span>
                <span className={styles.numLabel}>Pendientes</span>
              </div>
            </div>
          </section>

          {/* Meta anual */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Meta {currentYear}</h3>
            {editingGoal ? (
              <div className={styles.goalEdit}>
                <input
                  className={styles.goalInput}
                  type="number"
                  min="0"
                  max="365"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  autoFocus
                />
                <span className={styles.goalInputLabel}>libros</span>
                <button
                  className={styles.goalSave}
                  onClick={() => { onUpdateGoal(goalInput); setEditingGoal(false) }}
                >Guardar</button>
                <button
                  className={styles.goalCancel}
                  onClick={() => setEditingGoal(false)}
                >Cancelar</button>
              </div>
            ) : (
              <div className={styles.goalDisplay}>
                {goal?.count > 0 ? (
                  <>
                    <div className={styles.goalTrack}>
                      <div
                        className={styles.goalFill}
                        style={{ width: `${Math.min(100, Math.round((s.thisYear / goal.count) * 100))}%` }}
                      />
                    </div>
                    <span className={styles.goalText}>
                      {s.thisYear} de {goal.count} libros leídos este año
                    </span>
                  </>
                ) : (
                  <span className={styles.goalEmpty}>Sin meta definida</span>
                )}
                <button className={styles.goalEditBtn} onClick={() => { setGoalInput(String(goal?.count || '')); setEditingGoal(true) }}>
                  {goal?.count > 0 ? 'Cambiar meta' : 'Definir meta'}
                </button>
              </div>
            )}
          </section>

          {/* Por año */}
          {s.years.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Libros por año</h3>
              <div className={styles.chartWrap}>
                {s.years.map(([year, count]) => (
                  <div key={year} className={styles.chartRow}>
                    <span className={styles.chartYear}>{year}</span>
                    <div className={styles.chartBar}>
                      <div
                        className={styles.chartFill}
                        style={{ width: `${(count / s.maxInYear) * 100}%` }}
                      />
                    </div>
                    <span className={styles.chartCount}>{count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Puntajes */}
          {s.avgScore !== null && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Puntajes</h3>
              <div className={styles.avgScore}>
                <span className={styles.avgNum}>{s.avgScore.toFixed(1)}</span>
                <Stars value={s.avgScore} />
                <span className={styles.avgLabel}>promedio</span>
              </div>
              {s.bestRated.length > 0 && (
                <div className={styles.topBooks}>
                  {s.bestRated.map(b => (
                    <div key={b.id} className={styles.topBook}>
                      {b.cover && <img src={b.cover} alt="" className={styles.topBookCover} />}
                      <div className={styles.topBookInfo}>
                        <p className={styles.topBookTitle}>{b.title}</p>
                        <Stars value={b.score} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Favoritos */}
          {(s.topAuthors.length > 0 || s.topGenres.length > 0) && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Favoritos</h3>
              <div className={styles.favGrid}>
                {s.topAuthors.length > 0 && (
                  <div className={styles.favGroup}>
                    <span className={styles.favGroupTitle}>Autores/as</span>
                    {s.topAuthors.map(([name, count]) => (
                      <div key={name} className={styles.favItem}>
                        <span className={styles.favName}>{name}</span>
                        <span className={styles.favCount}>{count} {count === 1 ? 'libro' : 'libros'}</span>
                      </div>
                    ))}
                  </div>
                )}
                {s.topGenres.length > 0 && (
                  <div className={styles.favGroup}>
                    <span className={styles.favGroupTitle}>Géneros</span>
                    {s.topGenres.map(([name, count]) => (
                      <div key={name} className={styles.favItem}>
                        <span className={styles.favName}>{name}</span>
                        <span className={styles.favCount}>{count} {count === 1 ? 'libro' : 'libros'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Récords */}
          {(s.fastest || s.totalPages > 0) && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Récords</h3>
              <div className={styles.records}>
                {s.fastest && (
                  <div className={styles.record}>
                    <span className={styles.recordIcon}>⚡</span>
                    <div>
                      <p className={styles.recordLabel}>Más rápido</p>
                      <p className={styles.recordValue}>{s.fastest.title}</p>
                      <p className={styles.recordSub}>{formatDays(s.fastest.days)}</p>
                    </div>
                  </div>
                )}
                {s.slowest && s.slowest.id !== s.fastest?.id && (
                  <div className={styles.record}>
                    <span className={styles.recordIcon}>🐢</span>
                    <div>
                      <p className={styles.recordLabel}>Más lento</p>
                      <p className={styles.recordValue}>{s.slowest.title}</p>
                      <p className={styles.recordSub}>{formatDays(s.slowest.days)}</p>
                    </div>
                  </div>
                )}
                {s.totalPages > 0 && (
                  <div className={styles.record}>
                    <span className={styles.recordIcon}>📄</span>
                    <div>
                      <p className={styles.recordLabel}>Páginas en biblioteca</p>
                      <p className={styles.recordValue}>{s.totalPages.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {books.length === 0 && (
            <div className={styles.empty}>
              <p>Aún no hay libros en tu biblioteca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
