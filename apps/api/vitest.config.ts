import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      "src/modules/**/*.test.ts",
      "src/middleware/**/*.test.ts",
      "src/cron/**/*.test.ts",
    ],
    pool: "vmForks",
    environment: "node",
    reporters: ["default"],
    hookTimeout: 100000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "$": path.resolve(__dirname, "./src/modules/"),
    },
  },
});
