import { useState, useCallback } from 'react'
import { useBooks } from './hooks/useBooks'
import { useGoal } from './hooks/useGoal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useToast } from './hooks/useToast'
import LibraryPage from './pages/LibraryPage'
import BookModal from './components/BookModal'
import BookSearchModal from './components/BookSearchModal'
import StatsModal from './components/StatsModal'
import ToastContainer from './components/Toast'

export default function LibraryMain({ user, onLogout, dark, onToggleTheme }) {
  const { books, addBook, updateBook, deleteBook, exportBooks, importBooks } = useBooks(user.email)
  const { goal, updateCount: updateGoal } = useGoal()
  const { toasts, addToast, removeToast } = useToast()

  const [modal, setModal] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const openAdd = useCallback(() => setModal({ mode: 'add' }), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const openStats = useCallback(() => setStatsOpen(true), [])

  useKeyboardShortcuts([
    { key: 'n', handler: openAdd },
    { key: 'b', handler: openSearch },
    { key: 'e', handler: openStats },
  ])

  const handleAddFromSearch = (bookData) => {
    setSearchOpen(false)
    setModal({
      mode: 'add',
      book: {
        title: bookData.title || '',
        author: bookData.author || '',
        publisher: bookData.publisher || '',
        cover: bookData.coverLarge || bookData.cover || '',
        genre: '',
        startDate: '',
        endDate: '',
        notes: '',
        score: 0,
        color: '',
        totalPages: '',
        currentPage: '',
      },
    })
  }

  const handleImport = async (file) => {
    if (!file) return
    try {
      const count = await importBooks(file)
      addToast(`Se importaron ${count} libros correctamente.`)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id)
    } catch (err) {
      addToast((err as Error).message, 'error')
    }
  }

  return (
    <>
      <LibraryPage
        books={books}
        dark={dark}
        goal={goal}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        onAddBook={openAdd}
        onSearchBooks={openSearch}
        onEditBook={(book) => setModal({ mode: 'edit', book })}
        onDeleteBook={handleDelete}
        onShowStats={openStats}
        onExport={exportBooks}
        onImport={handleImport}
        modal={
          modal && (
            <BookModal
              mode={modal.mode}
              book={modal.book}
              onSave={async (data) => {
                try {
                  if (modal.mode === 'add') await addBook(data)
                  else await updateBook(modal.book.id, data)
                  setModal(null)
                } catch (err) {
                  addToast((err as Error).message, 'error')
                }
              }}
              onClose={() => setModal(null)}
            />
          )
        }
      />

      {searchOpen && (
        <BookSearchModal
          onSelect={handleAddFromSearch}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {statsOpen && (
        <StatsModal
          books={books}
          goal={goal}
          onUpdateGoal={updateGoal}
          onClose={() => setStatsOpen(false)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
