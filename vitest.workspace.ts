import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  ".",
  {
    plugins: [tsconfigPaths()],
  },
  "apps/api/*",
  {
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      include: ["src/modules/**/*.test.ts", "src/middleware/**/*.test.tsx"],
      environment: "node",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./apps/api/src"),
        "$": path.resolve(__dirname, "./src/modules/"),
      },
    },
  },
  "packages/lib/*",
  {
    test: {
      globals: true,
      environment: "node",
    },
  },
]);
