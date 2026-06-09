// @tanstack/react-start/config already bundles the following — do NOT add them manually
// or the build will break with duplicate plugin errors:
//   @vitejs/plugin-react, @tanstack/router-plugin, React/TanStack deduplication,
//   SSR shell plumbing, VITE_* env injection, and the @ path alias.
// Only add project-specific extras (Tailwind, tsconfig-paths) inside vite.plugins.
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});
