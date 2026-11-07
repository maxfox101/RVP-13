import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vitest подхватывает этот же конфиг (работа № 11)
  test: {
    environment: "node",
    include: ["src/**/*.test.js"]
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
    proxy: {
      // Заявки и картинки — Express + PostgreSQL (работы 7–8)
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true
      },
      "/images": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true
      },
      // Каталог — Strapi CMS (работа 9)
      "/cms": {
        target: "http://127.0.0.1:1337",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cms/, "")
      }
    }
  }
});
