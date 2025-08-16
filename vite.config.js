import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://marina-cociug.com",
        changeOrigin: true,
        secure: true,
      },
      "/admin": {
        target: "https://marina-cociug.com",
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxying request:", req.method, req.url);
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Doar librăriile pe care le folosiți sigur
          vendor: ["react", "react-dom", "react-router-dom"],
          stripe: ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          icons: ["lucide-react", "react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
