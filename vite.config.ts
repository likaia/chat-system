import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 8020,
    proxy: {}
  },
  resolve: {
    // 设置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "*": resolve("")
    }
  },
  base: IS_PRODUCTION ? "/chat-system" : "./",
  build: {
    outDir: resolve(__dirname, "dist")
  }
});
