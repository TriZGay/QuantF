import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8888,
    proxy: {
      //转到stock-service
      '/api': {
        target: "http://localhost:9090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      //转到trade-service
      '/aapi': {
        target: "http://localhost:9092",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aapi/, '')
      },
      // '/rsocket': {
      //   target: "http://localhost:9000",
      //   changeOrigin: true,
      //   ws: true
      // }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
