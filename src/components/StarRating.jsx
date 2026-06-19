import styles from './StarRating.module.css'

export default function StarRating({ value, onChange, readonly = false, size = 20 }) {
  return (
    <div className={styles.stars} style={{ '--size': `${size}px` }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`${styles.star} ${n <= value ? styles.filled : ''}`}
          onClick={readonly ? undefined : () => onChange(n === value ? 0 : n)}
          disabled={readonly}
          aria-label={`${n} estrellas`}
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21 2 7.31l5.53-.8L10 1.5z"
              fill={n <= value ? 'var(--color-gold)' : 'none'}
              stroke={n <= value ? 'var(--color-gold)' : 'var(--color-border)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}
