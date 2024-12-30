import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    reporters: ["default"],
    hookTimeout: 100000,
    include: ["**/*.test.ts", "**/*.test.tsx", "!**/docker-data/**"],
    setupFiles: "./test-setup.ts",
  },
});
