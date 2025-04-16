import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
      coverage: {
        reporter: ["text", "json", "html"],
        all: true,
        exclude: ["**/generated/**", "**/node_modules/**"],
      },
      environment: 'jsdom',
      globals: true
    },
});