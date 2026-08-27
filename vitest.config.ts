import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Logic-only tests (Pages Functions + pure helpers). `node` is the default so the
// run stays fast and `Request`/`Response` come from Node's built-in fetch globals;
// the few files that touch browser storage opt into happy-dom with a
// `// @vitest-environment happy-dom` pragma of their own.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
