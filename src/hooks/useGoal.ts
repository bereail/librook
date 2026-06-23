import { useState, useEffect } from 'react'

interface Goal { year: number; count: number }

export function useGoal() {
  const currentYear = new Date().getFullYear()

  const [goal, setGoal] = useState<Goal>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('librook_goal') || 'null')
      if (stored?.year === currentYear) return stored as Goal
      return { year: currentYear, count: 0 }
    } catch {
      return { year: currentYear, count: 0 }
    }
  })

  useEffect(() => {
    localStorage.setItem('librook_goal', JSON.stringify(goal))
  }, [goal])

  const updateCount = (n: number | string) => {
    const v = Math.max(0, parseInt(String(n)) || 0)
    setGoal(g => ({ ...g, count: v }))
  }

  return { goal, updateCount }
}
