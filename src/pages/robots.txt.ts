import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ? site.origin : url.origin).replace(/\/$/, '');
  return new Response(
    `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-index.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
