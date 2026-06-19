import { useState, useEffect } from 'react'


export function useBooks(userEmail) {
  const storageKey = `librook_books_${userEmail}`

  const [books, setBooks] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(books))
    } catch (_e) {
      // localStorage lleno (puede ocurrir con imágenes en base64)
    }
  }, [books, storageKey])

  const addBook = (book) => {
    const newBook = { ...book, id: Date.now().toString(), color: book.color || randomColor() }
    setBooks(prev => [newBook, ...prev])
    return newBook
  }

  const updateBook = (id, data) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))
  }

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  const exportBooks = () => {
    const payload = JSON.stringify({ version: 1, exportDate: new Date().toISOString(), books }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fecha = new Date().toLocaleDateString('es-AR').replace(/\//g, '-')
    a.download = `librook-backup-${fecha}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importBooks = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const imported = Array.isArray(data) ? data : (data.books || [])
        if (!Array.isArray(imported) || imported.length === 0) {
          reject(new Error('El archivo está vacío o tiene un formato inválido'))
          return
        }
        setBooks(imported)
        resolve(imported.length)
      } catch {
        reject(new Error('No se pudo leer el archivo. Verificá que sea un backup válido de Librook.'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })

  return { books, addBook, updateBook, deleteBook, exportBooks, importBooks }
}

function randomColor() {
  const colors = [
    '#2d4a3e', '#1a3a5c', '#4a2040', '#5c3d1e', '#1c3d5a',
    '#3d2b1f', '#2a4858', '#4d3319', '#1e3a2f', '#3d1c1c',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
