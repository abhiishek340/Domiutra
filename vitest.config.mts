import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    // Compile MDX the same way Next does, so content tests load real files.
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: "@mdx-js/react" }) },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "text", "html", "lcov"],
      include: ["lib/**/*.ts", "components/**/*.tsx", "app/api/**/*.ts", "mdx-components.tsx"],
      exclude: [
        // Canvas render loops and pointer physics are verified in the browser (E2E), not jsdom.
        "components/animations/WaveField.tsx",
        "components/animations/motion-features.ts",
      ],
      thresholds: {
        // Whole codebase: fail the run if coverage drops below these.
        statements: 90,
        lines: 90,
        functions: 88,
        branches: 82,
        // Business logic must stay well covered.
        "lib/**/*.ts": { lines: 90, functions: 90, branches: 80, statements: 90 },
        "app/api/**/*.ts": { lines: 90, functions: 90, branches: 80, statements: 90 },
      },
    },
  },
});
