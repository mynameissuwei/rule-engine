import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      comps: path.resolve(__dirname, "src/components"),
      styles: path.resolve(__dirname, "src/styles"),
      plugins: path.resolve(__dirname, "src/plugins"),
      views: path.resolve(__dirname, "src/views"),
      layouts: path.resolve(__dirname, "src/layouts"),
      utils: path.resolve(__dirname, "src/utils"),
      api: path.resolve(__dirname, "src/api"),
      dirs: path.resolve(__dirname, "src/directives"),
    },
  },
  plugins: [vue()],
  server:{
    https:true,
    hostname: '0.0.0.0',
    port: 3000,
    open: true,
    // 反向代理
    proxy: {
      '/api': {
        target: 'https://os-rule-engine.dev.ennew.com/rule/',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }},
})

