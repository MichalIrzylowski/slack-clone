import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@emoji-datasource-facebook": path.resolve(
        __dirname,
        "../../node_modules/emoji-datasource-facebook/img/facebook/64/"
      ),
    },
  },
});
