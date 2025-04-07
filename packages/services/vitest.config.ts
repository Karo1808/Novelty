import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    reporters: ["default"],
    hookTimeout: 300000,
    include: ["**/*.test.ts", "**/*.test.tsx", "!**/docker-data/**"],
    setupFiles: "./test-setup.ts",
  },
});
