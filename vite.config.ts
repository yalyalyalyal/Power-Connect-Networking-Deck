// @tanstack/react-start/config already bundles the following — do NOT add them manually
// or the build will break with duplicate plugin errors:
//   @vitejs/plugin-react, @tanstack/router-plugin, React/TanStack deduplication,
//   SSR shell plumbing, VITE_* env injection, and the @ path alias.
// Only add project-specific extras (Tailwind, tsconfig-paths) inside vite.plugins.

import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TanStack Router: file-based routing rooted at src/
  tsr: {
    appDirectory: "src",
  },

  // Server: use Nitro's built-in Vercel preset.
  // This outputs to .vercel/output/ which Vercel's Build Output API picks up
  // automatically — no outputDirectory setting needed in vercel.json.
  server: {
    preset: "vercel",
  },

  // Additional Vite plugins only — framework plugins are injected by TanStack Start.
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
