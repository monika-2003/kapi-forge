/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // The React Router plugin builds the app; Vitest renders components directly without it.
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
  server: {
    port: 3000,
    // Listen on all interfaces so forwarded ports and other devices can reach the dev server.
    host: true,
    // Allow Cursor / VS Code port-forwarding URLs (Vite blocks unknown Host headers by default).
    allowedHosts: ['.devtunnels.ms'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
