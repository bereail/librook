import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useBooks } from './hooks/useBooks'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'
import BookModal from './components/BookModal'

export default function App() {
  const { user, login, logout } = useAuth()
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [modal, setModal] = useState(null) // null | { mode: 'add' | 'edit', book?: {} }

  if (!user) {
    return <LoginPage onLogin={login} />
  }

  return (
    <LibraryPage
      books={books}
      user={user}
      onLogout={logout}
      onAddBook={() => setModal({ mode: 'add' })}
      onEditBook={(book) => setModal({ mode: 'edit', book })}
      onDeleteBook={deleteBook}
      modal={
        modal && (
          <BookModal
            mode={modal.mode}
            book={modal.book}
            onSave={(data) => {
              if (modal.mode === 'add') addBook(data)
              else updateBook(modal.book.id, data)
              setModal(null)
            }}
            onClose={() => setModal(null)}
          />
        )
      }
    />
  )
}
