const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const pool = require('../db')

const ADMIN_EMAIL = 'berenicesolohaga@gmail.com'

function adminOnly(req, res, next) {
  if (req.userEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Acceso denegado' })
  }
  next()
}

router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.created_at,
             COUNT(b.id)::int AS book_count
      FROM users u
      LEFT JOIN books b ON b.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('admin users error', err)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

router.get('/users/:id/books', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT title, author, start_date, end_date, score, created_at
       FROM books WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('admin books error', err)
    res.status(500).json({ error: 'Error al obtener libros' })
  }
})

module.exports = router
