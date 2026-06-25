export interface Book {
  id: string
  title: string
  author: string
  cover?: string
  publisher?: string
  genre?: string
  isbn?: string
  pages?: number
  year?: number
  score?: number
  notes?: string
  startDate?: string
  endDate?: string
  color?: string
  totalPages?: number
  currentPage?: number
  createdAt?: string
  wouldReread?: boolean
}

export interface Goal {
  count: number
  year: number
}

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}
