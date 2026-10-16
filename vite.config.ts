import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The pages that are not released show on a Vercel preview deploy, with
// `SITE_STAGE=preview` on a local build, and on the dev server. Every other
// build hides them. A missing VERCEL_ENV thus gives the production site, not a
// site with the unreleased pages.
const PREVIEW_BUILD = process.env.VERCEL_ENV === 'preview' || process.env.SITE_STAGE === 'preview';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    // A literal in the bundle, so Rollup removes the unreleased page chunks
    // from a production build (see App.tsx).
    __SHOW_UNRELEASED__: JSON.stringify(command === 'serve' || PREVIEW_BUILD),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}));
