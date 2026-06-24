import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function mockAnalytics() {
  const now = new Date()
  const hourly = Array.from({ length: 24 }, (_, h) => ({
    hour: h, count: h >= 8 && h <= 22 ? Math.floor(Math.random() * 110) : Math.floor(Math.random() * 15)
  }))
  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i))
    return { date: d.toISOString().slice(0, 10), count: 20 + Math.floor(Math.random() * 190) }
  })
  const active = Array.from({ length: 6 }, (_, i) => ({
    created_at: new Date(Date.now() - i * 35000).toISOString(),
    ip_address: `190.${192 + i}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    user_email: i < 2 ? 'berenicesolohaga@gmail.com' : null,
    path: ['biblioteca', 'login', 'biblioteca', 'biblioteca', 'admin', 'login'][i],
    device_type: ['Desktop', 'Móvil', 'Desktop', 'Desktop', 'Desktop', 'Móvil'][i],
    browser: ['Chrome', 'Safari', 'Chrome', 'Firefox', 'Chrome', 'Chrome'][i],
    session_id: Math.random().toString(36).slice(2),
  }))
  return {
    overview: { total: 1842, today: 47, week: 318, unique_sessions: 734, unique_today: 19 },
    hourly, daily,
    pages: [
      { path: 'biblioteca', count: 1124 },
      { path: 'login', count: 503 },
      { path: 'admin', count: 215 },
    ],
    browsers: [
      { browser: 'Chrome', count: 1240 },
      { browser: 'Safari', count: 380 },
      { browser: 'Firefox', count: 142 },
      { browser: 'Edge', count: 80 },
    ],
    devices: [
      { device_type: 'Desktop', count: 1380 },
      { device_type: 'Móvil', count: 402 },
      { device_type: 'Tablet', count: 60 },
    ],
    active,
  }
}

export default defineConfig({
  base: '/librook/',
  server: {
    proxy: {
      '/librook-api/admin/analytics': {
        bypass(req, res) {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(mockAnalytics()))
            return false
          }
        },
      },
      '/librook-api/analytics/track': {
        bypass(_req, res) {
          res.setHeader('Content-Type', 'application/json')
          res.end('{"ok":true}')
          return false
        },
      },
      '/librook-api': {
        target: 'https://ailonline.com.ar',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Librook',
        short_name: 'Librook',
        description: 'Tu biblioteca personal de libros',
        theme_color: '#2d4a3e',
        background_color: '#faf9f7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/librook/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/covers\.openlibrary\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'openlibrary-covers',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
