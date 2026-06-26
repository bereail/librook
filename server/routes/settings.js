const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const pool = require('../db')

router.get('/goal', auth, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT goal_count, goal_year FROM user_settings WHERE user_id = $1',
      [req.userId]
    )
    if (r.rows.length === 0) {
      return res.json({ count: 0, year: new Date().getFullYear() })
    }
    const row = r.rows[0]
    res.json({ count: row.goal_count, year: row.goal_year })
  } catch (err) {
    console.error('settings goal get error', err)
    res.status(500).json({ error: 'Error al obtener meta' })
  }
})

router.put('/goal', auth, async (req, res) => {
  const { count, year } = req.body
  const c = Math.max(0, parseInt(count) || 0)
  const y = parseInt(year) || new Date().getFullYear()
  try {
    await pool.query(
      `INSERT INTO user_settings (user_id, goal_count, goal_year)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET goal_count = $2, goal_year = $3, updated_at = NOW()`,
      [req.userId, c, y]
    )
    res.json({ count: c, year: y })
  } catch (err) {
    console.error('settings goal put error', err)
    res.status(500).json({ error: 'Error al guardar meta' })
  }
})

module.exports = router
