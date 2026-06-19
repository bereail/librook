import { useState } from 'react'
import styles from './BookCard.module.css'
import StarRating from './StarRating'

export default function BookCard({ book, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = (e) => {
    if (e.target.closest('[data-action]')) return
    setFlipped(f => !f)
  }

  const coverBg = book.cover
    ? `url(${book.cover})`
    : null

  const initials = book.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className={styles.wrapper} onClick={handleFlip}>
      <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
        {/* FRENTE */}
        <div className={styles.front}>
          <div
            className={styles.cover}
            style={{
              backgroundImage: coverBg,
              backgroundColor: book.color || 'var(--color-accent)',
            }}
          >
            {!book.cover && (
              <div className={styles.initials}>
                <span>{initials}</span>
              </div>
            )}
            <div className={styles.spine} style={{ backgroundColor: darken(book.color) }} />
            {book.endDate && (
              <div className={styles.badge}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {book.startDate && !book.endDate && (
              <div className={`${styles.badge} ${styles.badgeReading}`}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.6"/>
                  <path d="M6 4v2l1.5 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
          <div className={styles.info}>
            <p className={styles.title}>{book.title}</p>
            <p className={styles.author}>{book.author}</p>
          </div>
        </div>

        {/* REVERSO */}
        <div className={styles.back}>
          <div className={styles.backHeader} style={{ backgroundColor: book.color || 'var(--color-accent)' }}>
            <p className={styles.backTitle}>{book.title}</p>
            <p className={styles.backAuthor}>{book.author}</p>
          </div>
          <div className={styles.backBody}>
            {book.publisher && (
              <div className={styles.row}>
                <span className={styles.rowLabel}>Editorial</span>
                <span className={styles.rowValue}>{book.publisher}</span>
              </div>
            )}
            {book.startDate && (
              <div className={styles.row}>
                <span className={styles.rowLabel}>Inicio</span>
                <span className={styles.rowValue}>{formatDate(book.startDate)}</span>
              </div>
            )}
            {book.endDate && (
              <div className={styles.row}>
                <span className={styles.rowLabel}>Fin</span>
                <span className={styles.rowValue}>{formatDate(book.endDate)}</span>
              </div>
            )}
            {book.score > 0 && (
              <div className={styles.row}>
                <span className={styles.rowLabel}>Puntaje</span>
                <StarRating value={book.score} readonly size={13} />
              </div>
            )}
            {book.notes && (
              <div className={styles.notes}>
                <span className={styles.rowLabel}>Notas</span>
                <p className={styles.notesText}>{book.notes}</p>
              </div>
            )}
            <div className={styles.actions}>
              <button
                data-action="edit"
                className={styles.actionBtn}
                onClick={onEdit}
              >
                Editar
              </button>
              <button
                data-action="delete"
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este libro?')) onDelete() }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

function darken(hex) {
  if (!hex || !hex.startsWith('#')) return 'rgba(0,0,0,0.25)'
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - 40)
  const g = Math.max(0, ((n >> 8) & 0xff) - 40)
  const b = Math.max(0, (n & 0xff) - 40)
  return `rgb(${r},${g},${b})`
}
