import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    globals: true,
    // Must outlast Testing Library's asyncUtilTimeout, or a slow query
    // fails the file before the wait reports what was missing.
    testTimeout: 15000,
    // Tests always run against the mock layer, whatever .env.local says.
    env: { VITE_USE_MOCKS: 'true' },
  },
})
