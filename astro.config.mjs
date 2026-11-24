import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set SITE_URL when deploying, e.g. SITE_URL=https://preview.example.com pnpm build.
  // Local builds intentionally omit canonical/og:url rather than emitting localhost.
  site: process.env.SITE_URL || undefined,
  build: { inlineStylesheets: 'auto' },
});
