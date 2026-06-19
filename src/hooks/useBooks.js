import { useState, useEffect } from 'react'

const STORAGE_KEY = 'librook_books'

const SAMPLE_BOOKS = [
  {
    id: '1',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    publisher: 'DAW Books',
    startDate: '2024-01-10',
    endDate: '2024-02-03',
    notes: 'Una obra maestra de la fantasía. La voz de Kvothe es hipnótica.',
    score: 5,
    cover: 'https://covers.openlibrary.org/b/id/8234869-L.jpg',
    color: '#8B4513',
  },
  {
    id: '2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    publisher: 'Sudamericana',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    notes: 'Un viaje mágico por la familia Buendía. Lectura imprescindible.',
    score: 5,
    cover: 'https://covers.openlibrary.org/b/id/8775235-L.jpg',
    color: '#2c5f2e',
  },
  {
    id: '3',
    title: 'El principito',
    author: 'Antoine de Saint-Exupéry',
    publisher: 'Gallimard',
    startDate: '2024-05-20',
    endDate: '2024-05-22',
    notes: 'Simple y profundo. Cada vez que lo leo encuentro algo nuevo.',
    score: 4,
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    color: '#1a3a5c',
  },
]

export function useBooks() {
  const [books, setBooks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
      return SAMPLE_BOOKS
    } catch {
      return SAMPLE_BOOKS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }, [books])

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      color: book.color || randomColor(),
    }
    setBooks(prev => [newBook, ...prev])
    return newBook
  }

  const updateBook = (id, data) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))
  }

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return { books, addBook, updateBook, deleteBook }
}

function randomColor() {
  const colors = [
    '#2d4a3e', '#1a3a5c', '#4a2040', '#5c3d1e', '#1c3d5a',
    '#3d2b1f', '#2a4858', '#4d3319', '#1e3a2f', '#3d1c1c',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
