import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/* Senza vite-tsconfig-paths gli import "@/lib/..." non risolvono nei test:
   l'alias vive in tsconfig.json, che vitest non legge da solo. */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
