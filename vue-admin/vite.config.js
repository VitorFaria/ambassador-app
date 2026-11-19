import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode} ) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '')
  
  return {
    plugins: [vue(), vuetify({ autoImport: true })],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    // server: { host: '0.0.0.0', port: 5173, strictPort: true },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true
        }
      }
    }
  }
})
