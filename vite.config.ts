import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8888,
    proxy: {
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
      "/itick": {
        target: "http://localhost:9093",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/itick/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
