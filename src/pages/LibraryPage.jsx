import { useState } from 'react'
import BookCard from '../components/BookCard'
import styles from './LibraryPage.module.css'

export default function LibraryPage({ books, user, onLogout, onAddBook, onEditBook, onDeleteBook, modal }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | reading | finished

  const filtered = books.filter(b => {
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'finished' && b.endDate) ||
      (filter === 'reading' && b.startDate && !b.endDate)
    return matchSearch && matchFilter
  })

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>Librook</h1>
          <nav className={styles.nav}>
            <button className={styles.addBtn} onClick={onAddBook}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Agregar libro
            </button>
            <button className={styles.logoutBtn} onClick={onLogout} title="Cerrar sesión">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
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

          <div className={styles.filters}>
            {['all', 'reading', 'finished'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Todos' : f === 'reading' ? 'Leyendo' : 'Leídos'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'libro' : 'libros'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay libros en esta categoría.</p>
            {search && <button className={styles.clearSearch} onClick={() => setSearch('')}>Limpiar búsqueda</button>}
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
