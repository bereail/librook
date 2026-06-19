import { useState, useMemo, useRef } from 'react'
import BookCard from '../components/BookCard'
import styles from './LibraryPage.module.css'

const STATUS_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'reading', label: 'Leyendo' },
  { key: 'finished', label: 'Leídos' },
  { key: 'pending', label: 'Pendientes' },
]

const SORT_OPTIONS = [
  { key: 'recent', label: 'Más recientes' },
  { key: 'oldest', label: 'Menos recientes' },
  { key: 'score', label: 'Mejor puntaje' },
  { key: 'az', label: 'A → Z' },
  { key: 'za', label: 'Z → A' },
]

function GoalBar({ books, goal }) {
  const currentYear = new Date().getFullYear()
  const done = books.filter(b => b.endDate && b.endDate.startsWith(String(currentYear))).length
  const pct = Math.min(100, Math.round((done / goal.count) * 100))
  return (
    <div className={styles.goalBar}>
      <div className={styles.goalInfo}>
        <span className={styles.goalLabel}>Meta {currentYear}</span>
        <span className={styles.goalCount}>{done} de {goal.count} libros leídos</span>
      </div>
      <div className={styles.goalTrack}>
        <div className={styles.goalFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.goalPct}>{pct}%</span>
    </div>
  )
}

function sortBooks(books, sort) {
  return [...books].sort((a, b) => {
    switch (sort) {
      case 'score':
        return (b.score || 0) - (a.score || 0) || Number(b.id) - Number(a.id)
      case 'oldest':
        return Number(a.id) - Number(b.id)
      case 'az':
        return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
      case 'za':
        return b.title.localeCompare(a.title, 'es', { sensitivity: 'base' })
      default: // recent
        return Number(b.id) - Number(a.id)
    }
  })
}

export default function LibraryPage({
  books, dark, goal, onToggleTheme, onLogout,
  onAddBook, onSearchBooks, onEditBook, onDeleteBook,
  onShowStats, onExport, onImport, modal,
}) {
  const importRef = useRef(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('recent')
  const [advOpen, setAdvOpen] = useState(false)
  const [filterEditorial, setFilterEditorial] = useState('')
  const [filterAutor, setFilterAutor] = useState('')
  const [filterGenero, setFilterGenero] = useState('')

  const editorials = useMemo(() =>
    [...new Set(books.map(b => b.publisher).filter(Boolean))].sort(), [books])
  const autores = useMemo(() =>
    [...new Set(books.map(b => b.author).filter(Boolean))].sort(), [books])
  const generos = useMemo(() =>
    [...new Set(books.map(b => b.genre).filter(Boolean))].sort(), [books])

  const activeAdvCount = [filterEditorial, filterAutor, filterGenero].filter(Boolean).length

  const filtered = useMemo(() => {
    const base = books.filter(b => {
      const q = search.toLowerCase()
      const matchSearch = !search ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      const matchStatus =
        status === 'all' ||
        (status === 'finished' && b.endDate) ||
        (status === 'reading' && b.startDate && !b.endDate) ||
        (status === 'pending' && !b.startDate && !b.endDate)
      const matchEditorial = !filterEditorial || b.publisher === filterEditorial
      const matchAutor = !filterAutor || b.author === filterAutor
      const matchGenero = !filterGenero || b.genre === filterGenero
      return matchSearch && matchStatus && matchEditorial && matchAutor && matchGenero
    })
    return sortBooks(base, sort)
  }, [books, search, status, sort, filterEditorial, filterAutor, filterGenero])

  const clearAdv = () => {
    setFilterEditorial('')
    setFilterAutor('')
    setFilterGenero('')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>Librook</h1>
          <nav className={styles.nav}>
            <button className={styles.searchBtn} onClick={onSearchBooks} aria-label="Buscar en Open Library">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.btnText}>Buscar libros</span>
            </button>
            <button className={styles.addBtn} onClick={onAddBook}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.btnText}>Agregar</span>
            </button>
            <button
              className={styles.iconBtn}
              onClick={onToggleTheme}
              aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
              title={dark ? 'Modo claro' : 'Modo oscuro'}
            >
              {dark ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <button className={styles.iconBtn} onClick={onShowStats} title="Estadísticas" aria-label="Estadísticas">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.iconBtn} onClick={onExport} title="Exportar biblioteca" aria-label="Exportar">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <label className={styles.iconBtn} title="Importar biblioteca" aria-label="Importar" style={{ cursor: 'pointer' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input ref={importRef} type="file" accept=".json" onChange={e => { onImport(e.target.files[0]); e.target.value = '' }} hidden />
            </label>
            <button className={styles.iconBtn} onClick={onLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>

        {/* Meta anual */}
        {goal.count > 0 && (
          <GoalBar books={books} goal={goal} />
        )}

        {/* Barra superior: búsqueda + orden */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.search}
              type="search"
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Ordenar"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filtros de estado + avanzados */}
        <div className={styles.filtersRow}>
          <div className={styles.statusFilters}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${status === f.key ? styles.active : ''}`}
                onClick={() => setStatus(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            className={`${styles.advBtn} ${advOpen ? styles.advBtnOpen : ''}`}
            onClick={() => setAdvOpen(o => !o)}
            aria-expanded={advOpen}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Filtros</span>
            {activeAdvCount > 0 && (
              <span className={styles.advBadge}>{activeAdvCount}</span>
            )}
          </button>
        </div>

        {/* Panel filtros avanzados */}
        {advOpen && (
          <div className={styles.advPanel}>
            <div className={styles.advSelects}>
              <div className={styles.advField}>
                <label className={styles.advLabel}>Editorial</label>
                <select
                  className={styles.advSelect}
                  value={filterEditorial}
                  onChange={e => setFilterEditorial(e.target.value)}
                >
                  <option value="">Todas</option>
                  {editorials.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className={styles.advField}>
                <label className={styles.advLabel}>Autor/a</label>
                <select
                  className={styles.advSelect}
                  value={filterAutor}
                  onChange={e => setFilterAutor(e.target.value)}
                >
                  <option value="">Todos</option>
                  {autores.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.advField}>
                <label className={styles.advLabel}>Género</label>
                <select
                  className={styles.advSelect}
                  value={filterGenero}
                  onChange={e => setFilterGenero(e.target.value)}
                >
                  <option value="">Todos</option>
                  {generos.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {activeAdvCount > 0 && (
              <div className={styles.activeTags}>
                {filterEditorial && (
                  <span className={styles.tag}>
                    Editorial: {filterEditorial}
                    <button onClick={() => setFilterEditorial('')} aria-label="Quitar filtro editorial">×</button>
                  </span>
                )}
                {filterAutor && (
                  <span className={styles.tag}>
                    Autor/a: {filterAutor}
                    <button onClick={() => setFilterAutor('')} aria-label="Quitar filtro autor">×</button>
                  </span>
                )}
                {filterGenero && (
                  <span className={styles.tag}>
                    Género: {filterGenero}
                    <button onClick={() => setFilterGenero('')} aria-label="Quitar filtro género">×</button>
                  </span>
                )}
                <button className={styles.clearAll} onClick={clearAdv}>Limpiar todo</button>
              </div>
            )}
          </div>
        )}

        <div className={styles.stats}>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'libro' : 'libros'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <p>{search ? `Sin resultados para "${search}"` : 'No hay libros en esta categoría'}</p>
            {(search || activeAdvCount > 0 || status !== 'all') && (
              <button className={styles.clearSearch} onClick={() => { setSearch(''); clearAdv(); setStatus('all') }}>
                Limpiar todos los filtros
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => onEditBook(book)}
                onDelete={() => onDeleteBook(book.id)}
              />
            ))}
          </div>
        )}
      </main>

      {modal}
    </div>
  )
}
