import { tanstackStart } from "@tanstack/react-start/plugin/vite";
// vite.config.ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [tsConfigPaths(), tanstackStart()],
});
