import { useState, useCallback, useRef } from 'react'

const API = 'https://openlibrary.org/search.json'
const COVERS = 'https://covers.openlibrary.org/b/id'
const FIELDS = 'key,title,author_name,publisher,cover_i,first_publish_year,language'

function mapDoc(doc) {
  return {
    key: doc.key,
    title: doc.title || '',
    author: doc.author_name?.[0] || '',
    publisher: doc.publisher?.[0] || '',
    cover: doc.cover_i ? `${COVERS}/${doc.cover_i}-M.jpg` : '',
    coverLarge: doc.cover_i ? `${COVERS}/${doc.cover_i}-L.jpg` : '',
    year: doc.first_publish_year || null,
  }
}

export function useBookSearch() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  const search = useCallback((query, { lang } = {}) => {
    clearTimeout(debounceRef.current)
    abortRef.current?.abort()

    if (!query || query.trim().length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const params = new URLSearchParams({ q: query.trim(), limit: 8, fields: FIELDS })
        if (lang) params.set('lang', lang)

        const res = await fetch(`${API}?${params}`, { signal: controller.signal })
        if (!res.ok) throw new Error('respuesta inválida')
        const data = await res.json()
        setSuggestions((data.docs || []).slice(0, 8).map(mapDoc))
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }, [])

  const searchByISBN = useCallback(async (isbn) => {
    const clean = isbn.replace(/[-\s]/g, '')
    const params = new URLSearchParams({ isbn: clean, limit: 1, fields: FIELDS })
    const res = await fetch(`${API}?${params}`)
    if (!res.ok) throw new Error('Sin respuesta')
    const data = await res.json()
    const doc = data.docs?.[0]
    if (!doc) return null
    return mapDoc(doc)
  }, [])

  const clear = useCallback(() => {
    setSuggestions([])
    setLoading(false)
    clearTimeout(debounceRef.current)
    abortRef.current?.abort()
  }, [])

  return { suggestions, loading, search, searchByISBN, clear }
}
