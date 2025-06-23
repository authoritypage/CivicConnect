import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: process.env.BASE_URL || "/",
  plugins: [react()],
  root:
    process.env.VITE_ROOT || resolve(__dirname, "client") || resolve(__dirname),
  build: {
    outDir: process.env.VITE_OUT_DIR || resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    strictPort: true,
  },
});
