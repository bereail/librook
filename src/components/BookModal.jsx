import { useState, useEffect, useRef } from 'react'
import StarRating from './StarRating'
import styles from './BookModal.module.css'

const EMPTY = {
  title: '', author: '', publisher: '',
  startDate: '', endDate: '', notes: '',
  score: 0, cover: '', color: '',
}

const COLORS = [
  '#2d4a3e', '#1a3a5c', '#4a2040', '#5c3d1e', '#1c3d5a',
  '#3d2b1f', '#2a4858', '#4d3319', '#1e3a2f', '#6b3737',
  '#344055', '#3d4a2d',
]

export default function BookModal({ mode, book, onSave, onClose }) {
  const [form, setForm] = useState(mode === 'edit' ? { ...EMPTY, ...book } : EMPTY)
  const [errors, setErrors] = useState({})
  const overlayRef = useRef(null)

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'El título es obligatorio'
    if (!form.author.trim()) e.author = 'El autor es obligatorio'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'add' ? 'Agregar libro' : 'Editar libro'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.scroll}>
            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">Título *</label>
                <input
                  id="title"
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Nombre del libro"
                  autoFocus
                />
                {errors.title && <span className={styles.error}>{errors.title}</span>}
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="author">Autor *</label>
                  <input
                    id="author"
                    className={`${styles.input} ${errors.author ? styles.inputError : ''}`}
                    value={form.author}
                    onChange={e => set('author', e.target.value)}
                    placeholder="Nombre del autor"
                  />
                  {errors.author && <span className={styles.error}>{errors.author}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="publisher">Editorial</label>
                  <input
                    id="publisher"
                    className={styles.input}
                    value={form.publisher}
                    onChange={e => set('publisher', e.target.value)}
                    placeholder="Ej: Alfaguara"
                  />
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="startDate">Inicio de lectura</label>
                  <input
                    id="startDate"
                    className={styles.input}
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="endDate">Fin de lectura</label>
                  <input
                    id="endDate"
                    className={styles.input}
                    type="date"
                    value={form.endDate}
                    onChange={e => set('endDate', e.target.value)}
                    min={form.startDate || undefined}
                  />
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label}>Puntaje</label>
                <StarRating value={form.score} onChange={v => set('score', v)} size={22} />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="notes">Anotaciones</label>
                <textarea
                  id="notes"
                  className={styles.textarea}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Observaciones, reflexiones, citas..."
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="cover">URL de la tapa</label>
                <input
                  id="cover"
                  className={styles.input}
                  value={form.cover}
                  onChange={e => set('cover', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Color de la tapa</label>
                <div className={styles.colorPicker}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.colorDot} ${form.color === c ? styles.colorSelected : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => set('color', c)}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {form.cover && (
                <div className={styles.coverPreview}>
                  <img src={form.cover} alt="Preview" onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>
              {mode === 'add' ? 'Agregar libro' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
