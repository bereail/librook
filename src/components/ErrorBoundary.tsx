import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Error en la aplicación:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100dvh', gap: '1rem',
          padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Algo salió mal</h1>
          <p style={{ color: '#666', maxWidth: '360px', lineHeight: 1.5 }}>
            Ocurrió un error inesperado. Recargá la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem', background: '#2d4a3e', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
