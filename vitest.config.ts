import { defineConfig } from "vitest/config";

// Logic-only tests (Pages Functions + pure helpers). No DOM is needed, so `node`
// keeps the run fast; `Request`/`Response` come from Node's built-in fetch globals.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
