import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, type Connect, type Plugin } from 'vite'

/**
 * Vite's dev and preview servers answer any path they don't recognise with the
 * root index.html, so `/audit` would quietly show the demo widget. Send it on
 * to `/audit/`, the way hosting providers do.
 */
function auditTrailingSlash(): Plugin {
  const redirect: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (url.pathname !== '/audit') return next()
    res.statusCode = 302
    res.setHeader('Location', `/audit/${url.search}`)
    res.end()
  }

  return {
    name: 'audit-trailing-slash',
    configureServer: (server) => void server.middlewares.use(redirect),
    configurePreviewServer: (server) => void server.middlewares.use(redirect),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), auditTrailingSlash()],
  build: {
    // Two pages: the demo request at / and the web audit at /audit/.
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        audit: resolve(import.meta.dirname, 'audit/index.html'),
      },
    },
  },
})
