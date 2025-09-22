import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8888,
    proxy: {
      "/rt": {
        target: "ws://localhost:9090",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rt/, "")
      },
      "/api": {
        target: "http://localhost:9090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/ana": {
        target: "http://localhost:9091",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ana/, "")
      },
      "/akshres": {
        target: "http://localhost:9093",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/akshres/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
