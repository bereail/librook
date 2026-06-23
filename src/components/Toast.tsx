import { useState, useEffect } from 'react'
import styles from './Toast.module.css'

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10)
    const exit = setTimeout(() => setVisible(false), 3400)
    const remove = setTimeout(() => onRemove(toast.id), 3700)
    return () => {
      clearTimeout(enter)
      clearTimeout(exit)
      clearTimeout(remove)
    }
  }, [toast.id, onRemove])

  const isError = toast.type === 'error'

  return (
    <div
      className={`${styles.toast} ${isError ? styles.error : styles.success} ${visible ? styles.visible : ''}`}
      role="alert"
      aria-live="assertive"
    >
      {isError ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span>{toast.message}</span>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
