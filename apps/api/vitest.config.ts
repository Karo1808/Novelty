import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/modules/**/*.test.ts", "src/middleware/**/*.test.tsx"],
    environment: "node",
    reporters: ["default"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "$": path.resolve(__dirname, "./src/modules/"),
    },
  },
});
