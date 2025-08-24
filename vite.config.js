import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ask":           { target: "http://localhost:8080", changeOrigin: true },
      "/history":       { target: "http://localhost:8080", changeOrigin: true },
      "/health":        { target: "http://localhost:8080", changeOrigin: true },
      "/risk-analysis": { target: "http://localhost:8080", changeOrigin: true },
      "/recommend":     { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
