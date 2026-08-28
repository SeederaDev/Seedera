import { defineConfig } from "vitest/config";

/* `resolve.tsconfigPaths` fa risolvere a vitest gli alias "@/..." leggendoli da
   tsconfig.json, che altrimenti non guarda. E' il supporto nativo di Vite: il
   plugin vite-tsconfig-paths non serve, e una dipendenza in meno in questo
   repo e' un rischio in meno di risollevare pacchetti che rompono la build
   (vedi la nota su postcss nel README). */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
