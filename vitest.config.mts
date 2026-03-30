import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    exclude: [...configDefaults.exclude, ".worktrees/**"],
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    testTimeout: 10_000,
  },
});
