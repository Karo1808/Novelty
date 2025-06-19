import { tanstackStart } from "@tanstack/react-start/plugin/vite";
// vite.config.ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import oxlintPlugin from "vite-plugin-oxlint";

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    oxlintPlugin({
      path: "src",
    }),
  ],
});
