import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    reporters: ["default"],
    hookTimeout: 100000,
    include: ["**/*.test.ts"],
    setupFiles: "./test-setup.ts",
  },
});
