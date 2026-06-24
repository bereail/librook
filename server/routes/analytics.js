const router = require('express').Router()
const pool = require('../db')

function parseUA(ua = '') {
  let device = 'Desktop'
  if (/Mobi|Android|iPhone/i.test(ua)) device = 'Móvil'
  else if (/iPad|Tablet/i.test(ua)) device = 'Tablet'

  let browser = 'Otro'
  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'
  else if (/Chrome/i.test(ua)) browser = 'Chrome'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/Safari/i.test(ua)) browser = 'Safari'

  let os = 'Otro'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/iPhone/i.test(ua)) os = 'iOS'
  else if (/iPad/i.test(ua)) os = 'iPadOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/Mac OS X/i.test(ua)) os = 'Mac'
  else if (/Linux/i.test(ua)) os = 'Linux'

  return { device, browser, os }
}

router.post('/track', async (req, res) => {
  const ip = ((req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '') + '')
    .split(',')[0].trim()
  const { session_id, path, referrer, user_agent, user_email } = req.body ?? {}

  res.json({ ok: true })

  if (!session_id || !path) return

  const { device, browser, os } = parseUA(user_agent)
  try {
    await pool.query(
      `INSERT INTO page_views
         (session_id, user_email, path, referrer, device_type, browser, os, ip_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [session_id, user_email || null, path, referrer || null, device, browser, os, ip]
    )
  } catch (err) {
    console.error('analytics track error', err)
  }
})

module.exports = router
