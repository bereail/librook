import { useState, useEffect } from 'react'
import { api } from '../api'
import type { Book } from '../types'

export function useBooks(userEmail: string) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userEmail) return
    let cancelled = false
    setLoading(true)
    api.get('/books')
      .then(data => { if (!cancelled) setBooks(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [userEmail])

  const addBook = async (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook = await api.post('/books', book)
    setBooks(prev => [newBook, ...prev])
    return newBook
  }

  const updateBook = async (id: string, data: Partial<Book>) => {
    const updated = await api.put(`/books/${id}`, data)
    setBooks(prev => prev.map(b => b.id === id ? updated : b))
  }

  const deleteBook = async (id: string) => {
    await api.delete(`/books/${id}`)
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  const exportBooks = () => {
    const payload = JSON.stringify({ version: 1, exportDate: new Date().toISOString(), books }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `librook-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importBooks = (file: File): Promise<number> => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target!.result as string)
        const imported: Book[] = Array.isArray(data) ? data : (data.books || [])
        if (!Array.isArray(imported) || imported.length === 0) {
          reject(new Error('El archivo está vacío o tiene un formato inválido'))
          return
        }
        const results = await Promise.all(imported.map(b => api.post('/books', b)))
        setBooks(prev => [...results, ...prev])
        resolve(results.length)
      } catch {
        reject(new Error('No se pudo leer el archivo. Verificá que sea un backup válido de Librook.'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })

  return { books, loading, addBook, updateBook, deleteBook, exportBooks, importBooks }
}
