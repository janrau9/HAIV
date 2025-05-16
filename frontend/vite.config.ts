import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8000', // Proxy API calls to your backend server
    },
  },
  resolve: {
    alias: {
      'phaser': 'phaser/dist/phaser.esm.js',
    },
  },
})
