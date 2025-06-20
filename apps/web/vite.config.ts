import { tanstackStart } from "@tanstack/react-start/plugin/vite";
// vite.config.ts
import tailwindPlugin from "@tailwindcss/vite";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    tailwindPlugin(),
    oxlintPlugin({
      path: "src",
    }),
  ],
});
