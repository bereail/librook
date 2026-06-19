import { useState, useEffect } from 'react'

export function useGoal() {
  const currentYear = new Date().getFullYear()

  const [goal, setGoal] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('librook_goal'))
      if (stored?.year === currentYear) return stored
      return { year: currentYear, count: 0 }
    } catch {
      return { year: currentYear, count: 0 }
    }
  })

  useEffect(() => {
    localStorage.setItem('librook_goal', JSON.stringify(goal))
  }, [goal])

  const updateCount = (n) => {
    const v = Math.max(0, parseInt(n) || 0)
    setGoal(g => ({ ...g, count: v }))
  }

  return { goal, updateCount }
}
