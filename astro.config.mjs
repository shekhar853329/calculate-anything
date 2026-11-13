import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('dev');
const site = process.env.SITE_URL || (isDev ? 'http://localhost:4321' : 'https://calculate-anything.in');

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
