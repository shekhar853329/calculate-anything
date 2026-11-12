import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    'User-agent: *\nAllow: /\nSitemap: https://calculateanything.pages.dev/sitemap-index.xml',
    { headers: { 'Content-Type': 'text/plain' } }
  );
